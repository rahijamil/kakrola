import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import sendInviteEmail from "@/utils/sendEmail";
import { v4 as uuidv4 } from "uuid";
import { InviteStatus, InviteType, TeamType } from "@/types/team";
import { ProjectType } from "@/types/project";
import { RoleType } from "@/types/role";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { emails, team_id, project_id, role, inviter } = (await req.json()) as {
    emails: string[];
    team_id: number | null;
    project_id: number | null;
    inviter: { id: string; first_name: string; email: string }; // Include inviter's profile ID
    role?: RoleType;
  };

  if (!emails || !inviter) {
    return NextResponse.json(
      { success: false, message: "Missing required parameters." },
      { status: 400 }
    );
  }

  let team_data: TeamType | null = null;
  let project_data: ProjectType | null = null;

  if (project_id) {
    // Validate project name with project_id
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", project_id)
      .single();

    if (projectError || !projectData) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID." },
        { status: 400 }
      );
    }

    project_data = projectData;
  }

  if (team_id) {
    // Validate team name with team_id
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", team_id)
      .single();

    if (teamError || !teamData) {
      return NextResponse.json(
        { success: false, message: "Invalid team ID." },
        { status: 400 }
      );
    }
    team_data = teamData;

    // Check if the inviter is a team member and has the right to invite
    const { data: inviterData, error: inviterError } = await supabase
      .from("team_members")
      .select("team_role")
      .eq("profile_id", inviter.id)
      .eq("team_id", team_id)
      .single();

    if (
      inviterError ||
      !inviterData ||
      !["ADMIN", "MEMBER"].includes(inviterData.team_role)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only team admins or members can send invites.",
        },
        { status: 403 }
      );
    }
  }

  const errors = [];

  for (const email of emails) {
    try {
      if (team_id) {
        // Check if the user is already a member of the team
        const { data: existingMember, error: memberError } = await supabase
          .from("team_members")
          .select("id")
          .eq("email", email)
          .eq("team_id", team_id)
          .single();

        if (existingMember) {
          errors.push(`Email ${email} is already a member of the team.`);
          continue;
        }

        // Check for an existing pending invite
        const { data: existingInvite, error: inviteError } = await supabase
          .from("invites")
          .select("id, status, created_at")
          .eq("email", email)
          .eq("team_id", team_id)
          .single();

        if (existingInvite) {
          const inviteAge =
            Date.now() - new Date(existingInvite.created_at).getTime();
          const inviteExpired = inviteAge > 7 * 24 * 60 * 60 * 1000; // 7 days

          if (existingInvite.status === "pending" && !inviteExpired) {
            errors.push(`A pending invite already exists for ${email}.`);
            continue;
          }

          // If expired, delete the old invite
          if (inviteExpired) {
            await supabase.from("invites").delete().eq("id", existingInvite.id);
          }
        }
      }

      if (project_id) {
        // Check for an existing pending invite
        const { data: existingInvite, error: inviteError } = await supabase
          .from("invites")
          .select("id, status, created_at")
          .eq("email", email)
          .eq("project_id", project_id)
          .single();

        if (existingInvite) {
          const inviteAge =
            Date.now() - new Date(existingInvite.created_at).getTime();
          const inviteExpired = inviteAge > 7 * 24 * 60 * 60 * 1000; // 7 days

          if (existingInvite.status === "pending" && !inviteExpired) {
            errors.push(`A pending invite already exists for ${email}.`);
            continue;
          }

          // If expired, delete the old invite
          if (inviteExpired) {
            await supabase.from("invites").delete().eq("id", existingInvite.id);
          }
        }
      }

      const inviteData: Omit<InviteType, "id"> = {
        project_id,
        team_id,
        email,
        role: role ? role : RoleType["MEMBER"],
        status: InviteStatus.PENDING,
        token: uuidv4(),
      };

      // Insert a new invite into the database
      const { error: insertError } = await supabase
        .from("invites")
        .insert([inviteData]);

      if (insertError) {
        errors.push(
          `Failed to insert invite for ${email}: ${insertError.message}`
        );
        continue;
      }

      // Send the invite email
      await sendInviteEmail({
        to: email,
        token: inviteData.token,
        inviter,
        project_data,
        team_data,
      });
    } catch (error) {
      console.error(`Error inviting ${email}:`, error);
      errors.push(`Failed to invite ${email}.`);
    }
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { success: false, message: errors.join(", ") },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, message: "Invites sent." });
}