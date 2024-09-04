import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/auth";
import {
  InviteStatus,
  InviteType,
  ProjectMemberType,
  TeamMemberType,
} from "@/types/team";
import { ProfileType } from "@/types/user";
import { differenceInDays } from "date-fns";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    console.error("Missing token parameter");
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  const supabase = createClient();
  const user = await getUser();

  const { data: invite, error } = await supabase
    .from("invites")
    .select("*")
    .eq("token", token)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message || "Error fetching invite" },
      { status: 400 }
    );
  }

  if (!invite) {
    return NextResponse.json(
      { error: "Invalid invite token" },
      { status: 400 }
    );
  }

  // Check if the invite has expired
  const isExpired =
    differenceInDays(new Date(), new Date(invite.created_at)) > 7;
  if (isExpired) {
    console.error("Invite has expired");
    return NextResponse.json({ error: "Invite has expired" }, { status: 400 });
  }

  if (user && invite.email === user.email) {
    try {
      await handleInviteAcceptance(invite, user);
      return NextResponse.redirect(`${origin}/app`);
    } catch (error: any) {
      console.error("Error handling invite acceptance:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", invite.email)
    .single();

  if (profileError || !userProfile) {
    console.error("Error fetching profile:", profileError);

    return NextResponse.redirect(
      `${origin}/auth/signup?email=${invite.email}&token=${token}`
    );
  } else {
    return NextResponse.redirect(
      `${origin}/auth/login?email=${invite.email}&token=${token}`
    );
  }
}

// Centralized function to handle invite acceptance
async function handleInviteAcceptance(
  invite: InviteType,
  profile: ProfileType
) {
  try {
    const supabase = createClient();

    // Insert into the appropriate members table
    if (invite.project_id) {
      // check if the member is already in the project
      const { data: projectMember, error: projectMemberError } = await supabase
        .from("project_members")
        .select("id")
        .eq("project_id", invite.project_id)
        .eq("profile_id", profile.id)
        .single();

      // if (projectMemberError) throw new Error(`Failed to fetch project member: ${projectMemberError.message}`);

      if (projectMember) {
        return;
      }

      // Fetch existing all project members to determine the new order
      const { data: existingAllMembers, error: fetchError } = await supabase
        .from("project_members")
        .select("project_settings->order")
        .eq("project_id", invite.project_id)
        .order("project_settings->order", { ascending: false }); // Order by existing order values

      if (fetchError)
        throw new Error(
          `Failed to fetch project members: ${fetchError.message}`
        );

      console.log("existingAllMembers", existingAllMembers);

      // TypeScript will understand that `order` is a number
      const existingMembers: { order: number }[] = existingAllMembers as any[];

      const newOrder =
        existingMembers.length > 0 ? Number(existingMembers[0].order) + 1 : 1;

      const projectMemberData: Omit<ProjectMemberType, "id"> = {
        project_id: invite.project_id,
        profile_id: profile.id,
        role: invite.role,
        project_settings: {
          is_favorite: false,
          order: newOrder,
        },
      };

      const { error: projectInsertError } = await supabase
        .from("project_members")
        .insert(projectMemberData);

      if (projectInsertError) {
        throw new Error(
          `Failed to add to project members: ${projectInsertError.message}`
        );
      }
    }

    if (invite.team_id) {
      // check if the member is already in the team
      const { data: teamMember, error: teamMemberError } = await supabase
        .from("team_members")
        .select("id")
        .eq("team_id", invite.team_id)
        .eq("profile_id", profile.id);

      if (teamMemberError) {
        throw new Error(
          `Failed to add to team members: ${teamMemberError.message}`
        );
      }

      if (teamMember) {
        return;
      }

      const teamMemberData: Omit<TeamMemberType, "id"> = {
        email: profile.email,
        team_id: invite.team_id,
        profile_id: profile.id,
        team_role: invite.role,
      };

      const { error: teamInsertError } = await supabase
        .from("team_members")
        .insert(teamMemberData);

      if (teamInsertError) {
        throw new Error(
          `Failed to add to team members: ${teamInsertError.message}`
        );
      }
    }

    // Update the invite status to 'accepted'
    const { error: updateError } = await supabase
      .from("invites")
      .update({ status: InviteStatus.ACCEPTED })
      .eq("id", invite.id);

    if (updateError) {
      throw new Error(`Failed to update invite: ${updateError.message}`);
    }
  } catch (error) {
    console.error("Error accepting invite:", error);

    throw error;
  }
}
