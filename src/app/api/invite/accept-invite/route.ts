import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/auth";
import {
  InviteStatus,
  ProjectInviteType,
  PageInviteType,
  PersonalMemberForProjectType,
  TeamMemberType,
  PersonalMemberForPageType,
} from "@/types/team";
import { ProfileType } from "@/types/user";
import { differenceInDays } from "date-fns";
import { PersonalRoleType, TeamRoleType } from "@/types/role";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  console.debug("Received token:", token);

  if (!token) {
    console.error("Missing token parameter");
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  const supabase = createClient();
  const user = await getUser();

  console.debug("Authenticated user:", user);

  const { data: invite, error } = await supabase
    .from("invites")
    .select("*")
    .eq("token", token)
    .single();

  if (error) {
    console.error("Error fetching invite:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching invite" },
      { status: 400 }
    );
  }

  if (!invite) {
    console.warn("No invite found for token:", token);
    return NextResponse.json(
      { error: "Invalid invite token" },
      { status: 400 }
    );
  }

  // Check if the invite has expired
  const isExpired =
    differenceInDays(new Date(), new Date(invite.created_at)) > 7;
  if (isExpired) {
    console.error("Invite has expired for token:", token);
    return NextResponse.json({ error: "Invite has expired" }, { status: 400 });
  }

  if (user && invite.email === user.email) {
    console.debug("User is accepting their own invite:", invite);
    try {
      await handleInviteAcceptance(invite, user);
      return NextResponse.redirect(`${origin}/app`);
    } catch (error: any) {
      console.error("Error handling invite acceptance:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  console.debug("Fetching profile for invite email:", invite.email);
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", invite.email)
    .single();

  if (profileError || !userProfile) {
    console.error(
      "Error fetching profile for email:",
      invite.email,
      profileError
    );

    return NextResponse.redirect(
      `${origin}/auth/signup?email=${invite.email}&token=${token}`
    );
  } else {
    console.debug("Redirecting to login for invite email:", invite.email);
    return NextResponse.redirect(
      `${origin}/auth/login?email=${invite.email}&token=${token}`
    );
  }
}

// Centralized function to handle invite acceptance
async function handleInviteAcceptance(
  invite: ProjectInviteType | PageInviteType,
  profile: ProfileType
) {
  try {
    const supabase = createClient();
    const id = invite.project_id || invite.page_id;
    const column_name = invite.project_id ? "project_id" : "page_id";

    console.debug(
      "Processing invite acceptance for ID:",
      id,
      "Column:",
      column_name
    );

    // Insert into the appropriate members table for project
    if (id) {
      // check if the member is already in the project
      const { data: member, error: memberError } = await supabase
        .from("personal_members")
        .select("id")
        .eq(column_name, id)
        .eq("profile_id", profile.id)
        .single();

      if (member) {
        console.info("Member already exists in project:", member);
        return;
      }

      // Fetch existing all project members to determine the new order
      const { data: existingAllMembers, error: fetchError } = await supabase
        .from("personal_members")
        .select("settings->order")
        .eq(column_name, id)
        .order("settings->order", { ascending: false }); // Order by existing order values

      if (fetchError) {
        console.error("Failed to fetch project members:", fetchError);
        throw new Error(
          `Failed to fetch project members: ${fetchError.message}`
        );
      }

      console.debug("Existing project members:", existingAllMembers);

      // TypeScript will understand that `order` is a number
      const existingMembers: { order: number }[] = existingAllMembers as any[];

      const newOrder =
        existingMembers.length > 0 ? Number(existingMembers[0].order) + 1 : 1;

      const memberData: Omit<
        PersonalMemberForProjectType | PersonalMemberForPageType,
        "id"
      > = {
        [column_name]: id,
        profile_id: profile.id,
        role: invite.role as PersonalRoleType,
        settings: {
          is_favorite: false,
          order: newOrder,
        },
      };

      console.debug("Inserting new member data:", memberData);
      const { error: insertError } = await supabase
        .from("personal_members")
        .insert(memberData);

      if (insertError) {
        console.error("Failed to add to project members:", insertError);
        throw new Error(
          `Failed to add to project members: ${insertError.message}`
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
        console.error("Failed to check team members:", teamMemberError);
        throw new Error(
          `Failed to add to team members: ${teamMemberError.message}`
        );
      }

      if (teamMember.length > 0) {
        console.info("Member already exists in team:", teamMember);
        return;
      }

      const teamMemberData: Omit<TeamMemberType, "id"> = {
        email: profile.email,
        team_id: invite.team_id,
        profile_id: profile.id,
        team_role: invite.role as TeamRoleType,
        settings: {
          projects: [],
          pages: [],
          channels: [],
        },
      };

      console.debug("Inserting new team member data:", teamMemberData);
      const { error: teamInsertError } = await supabase
        .from("team_members")
        .insert(teamMemberData);

      if (teamInsertError) {
        console.error("Failed to add to team members:", teamInsertError);
        throw new Error(
          `Failed to add to team members: ${teamInsertError.message}`
        );
      }
    }

    // Update the invite status to 'accepted'
    console.debug(
      "Updating invite status to accepted for invite ID:",
      invite.id
    );
    const { error: updateError } = await supabase
      .from("invites")
      .update({ status: InviteStatus.ACCEPTED })
      .eq("id", invite.id);

    if (updateError) {
      console.error("Failed to update invite status:", updateError);
      throw new Error(`Failed to update invite: ${updateError.message}`);
    }

    console.info("Invite accepted successfully:", invite.id);

    return { success: true, invite };
  } catch (error) {
    console.error("Error accepting invite:", error);
    throw error;
  }
}
