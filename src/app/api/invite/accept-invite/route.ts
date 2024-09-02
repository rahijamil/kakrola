import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/auth";
import { InviteType, ProjectMemberType, TeamMemberType } from "@/types/team";
import { ProfileType } from "@/types/user";
import { differenceInDays } from "date-fns";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  const supabase = createClient();
  const user = await getUser();

  const { data: invite, error } = await supabase
    .from("invites")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !invite) {
    return NextResponse.json(
      { error: error?.message || "Invalid invite token" },
      { status: 400 }
    );
  }

  // Check if the invite has expired
  const isExpired =
    differenceInDays(new Date(), new Date(invite.created_at)) > 7;
  if (isExpired) {
    return NextResponse.json({ error: "Invite has expired" }, { status: 400 });
  }

  if (user) {
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
  const supabase = createClient();

  // Update the invite status to 'accepted'
  const { error: updateError } = await supabase
    .from("invites")
    .update({ status: "accepted" })
    .eq("id", invite.id);

  if (updateError) {
    throw new Error("Failed to update invite status");
  }

  // Insert into the appropriate members table
  if (invite.project_id) {
    const projectMember: Omit<ProjectMemberType, "id"> = {
      project_id: invite.project_id,
      profile_id: profile.id,
      role: invite.role,
    };

    const { error: projectInsertError } = await supabase
      .from("project_members")
      .insert(projectMember);

    if (projectInsertError) {
      throw new Error("Failed to add to project members");
    }
  }

  if (invite.team_id) {
    const teamMember: Omit<TeamMemberType, "id"> = {
      email: profile.email,
      team_id: invite.team_id,
      profile_id: profile.id,
      team_role: invite.role,
    };

    const { error: teamInsertError } = await supabase
      .from("team_members")
      .insert(teamMember);

    if (teamInsertError) {
      throw new Error("Failed to add to team members");
    }
  }
}
