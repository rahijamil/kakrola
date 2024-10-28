import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/auth";
import {
  ProjectInviteType,
  PageInviteType,
  WorkspaceInviteType,
  TeamMemberType,
} from "@/types/team";
import { ProfileType } from "@/types/user";
import { differenceInDays } from "date-fns";
import {
  PersonalRoleType,
  TeamRoleType,
  WorkspaceRoleType,
} from "@/types/role";
import { updateSubscription } from "@/utils/paddle/update-subscription";
import { WorkspaceMemberType } from "@/types/workspace";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    console.error("Token is missing");
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  const supabase = createClient();

  // Fetch invite and user in parallel
  const [user, { data: invite, error: inviteError }] = await Promise.all([
    getUser(),
    supabase.from("invites").select("*").eq("token", token).single(),
  ]);

  if (inviteError || !invite) {
    console.error(
      "Invalid invite token:",
      inviteError?.message || "No invite found"
    );
    return NextResponse.json(
      { error: inviteError?.message || "Invalid invite token" },
      { status: 400 }
    );
  }

  // Quick validation checks
  const inviteAgeInDays = differenceInDays(
    new Date(),
    new Date(invite.created_at)
  );

  if (inviteAgeInDays > 7) {
    console.error("Invite has expired");
    return NextResponse.json({ error: "Invite has expired" }, { status: 400 });
  }

  // If user is logged in
  if (user) {
    // For email invites, check if the user's email matches
    // For link invites (where invite.email is null), allow any logged-in user
    if (!invite.email || user.email === invite.email) {
      try {
        await handleOptimizedInviteAcceptance(invite, user);
        return NextResponse.redirect(`${origin}/app`);
      } catch (error: any) {
        console.error("Error while accepting invite:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      // If emails don't match for an email invite, show error
      return NextResponse.json(
        { error: "This invite is for a different email address" },
        { status: 403 }
      );
    }
  }

  // If no user is logged in
  const redirectUrl = invite.email
    ? `${origin}/auth/login?email=${invite.email}&token=${token}`
    : `${origin}/auth/login?token=${token}`;

  return NextResponse.redirect(redirectUrl);
}

async function handleOptimizedInviteAcceptance(
  invite: ProjectInviteType | PageInviteType | WorkspaceInviteType,
  profile: ProfileType
) {
  const supabase = createClient();
  const operations = [];

  try {
    // First, determine the workspace_id for billing purposes
    let relevantWorkspaceId: number | null = null;

    if (invite.workspace_id) {
      // Direct workspace invite
      relevantWorkspaceId = invite.workspace_id;
    } else if (invite.team_id) {
      // For team invites, get the workspace_id from the team
      const { data: teamData } = await supabase
        .from("teams")
        .select("workspace_id")
        .eq("id", invite.team_id)
        .single();
      relevantWorkspaceId = teamData?.workspace_id || null;
    } else if (invite.project_id) {
      // For project invites, get workspace_id through team or workspace
      const { data: projectData } = await supabase
        .from("projects")
        .select("team_id, workspace_id")
        .eq("id", invite.project_id)
        .single();
      relevantWorkspaceId = projectData?.workspace_id || null;
    } else if (invite.page_id) {
      // For page invites, get workspace_id through project/team or directly
      const { data: pageData } = await supabase
        .from("pages")
        .select("project_id, team_id, workspace_id")
        .eq("id", invite.page_id)
        .single();
      relevantWorkspaceId = pageData?.workspace_id || null;
    }

    if (!relevantWorkspaceId) {
      throw new Error("Could not determine workspace for invite");
    }

    // Check if user is already a workspace member
    const { data: existingWorkspaceMember } = await supabase
      .from("workspace_members")
      .select("id")
      .eq("workspace_id", relevantWorkspaceId)
      .eq("profile_id", profile.id)
      .single();

    // Handle workspace membership and billing if needed
    if (!existingWorkspaceMember) {
      // Check subscription for the workspace
      const { data: workspaceSubscription } = await supabase
        .from("subscriptions")
        .select("subscription_id, price_id, seats, customer_profile_id")
        .eq("workspace_id", relevantWorkspaceId)
        .single();

      if (workspaceSubscription) {
        // Count current workspace members
        const { count } = await supabase
          .from("workspace_members")
          .select("id", { count: "exact" })
          .eq("workspace_id", relevantWorkspaceId);

        console.log({ count, seats: workspaceSubscription.seats });

        const currentMemberCount = count || 0;

        // Update subscription proration if needed
        if (currentMemberCount >= (workspaceSubscription.seats || 0)) {
          operations.push(
            updateSubscription(
              workspaceSubscription.subscription_id,
              workspaceSubscription.price_id,
              (workspaceSubscription.seats || 0) + 1
            )
          );
        }
      }

      // Add workspace member
      const workspaceMemberData: Omit<WorkspaceMemberType, "id"> = {
        email: profile.email,
        workspace_id: relevantWorkspaceId,
        profile_id: profile.id,
        workspace_role: WorkspaceRoleType.WORKSPACE_MEMBER,
        settings: {},
      };

      operations.push(
        supabase.from("workspace_members").insert(workspaceMemberData)
      );

      // Update user's metadata if this is their first workspace
      if (!profile.metadata?.current_workspace_id) {
        operations.push(
          supabase
            .from("profiles")
            .update({
              metadata: {
                ...profile.metadata,
                current_workspace_id: relevantWorkspaceId,
              },
            })
            .eq("id", profile.id)
        );
      }
    }

    // Now handle the specific invite type
    if (invite.project_id || invite.page_id) {
      // Handle project/page member insertion
      const id = invite.project_id || invite.page_id;
      const column_name = invite.project_id ? "project_id" : "page_id";

      const { data: memberInfo } = await supabase
        .from("personal_members")
        .select("settings->order")
        .eq(column_name, id)
        .order("settings->order", { ascending: false })
        .limit(1);

      const newOrder = memberInfo?.[0]?.order
        ? Number(memberInfo[0].order) + 1
        : 1;

      const memberData = {
        [column_name]: id,
        profile_id: profile.id,
        role: invite.role as PersonalRoleType,
        settings: { is_favorite: false, order: newOrder },
      };

      operations.push(supabase.from("personal_members").insert(memberData));
    } else if (invite.team_id) {
      // Handle team member insertion
      const { data: existingTeamMember } = await supabase
        .from("team_members")
        .select("id")
        .eq("team_id", invite.team_id)
        .eq("profile_id", profile.id)
        .single();

      if (!existingTeamMember) {
        const teamMemberData: Omit<TeamMemberType, "id"> = {
          email: profile.email,
          team_id: invite.team_id,
          profile_id: profile.id,
          team_role: invite.role as TeamRoleType,
          settings: { projects: [], pages: [], channels: [] },
        };

        operations.push(supabase.from("team_members").insert(teamMemberData));
      }
    }

    // Delete the invite
    operations.push(supabase.from("invites").delete().eq("id", invite.id));

    // Execute all operations in parallel
    await Promise.all(operations);

    console.log("Invite acceptance operations completed successfully.");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to accept invite:", error.message);
    throw new Error(`Failed to accept invite: ${error.message}`);
  }
}
