import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import sendInviteEmail from "@/utils/sendEmail";
import { v4 as uuidv4 } from "uuid";
import { InviteType, RoleType } from "@/types/team";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { emails, team_id, inviter } = (await req.json()) as {
    emails: string[];
    team_id: number;
    inviter: { id: string; first_name: string; email: string }; // Include inviter's profile ID
  };

  if (!emails || !team_id || !inviter) {
    return NextResponse.json(
      { success: false, message: "Missing required parameters." },
      { status: 400 }
    );
  }

  // Validate team name with team_id
  const { data: teamData, error: teamError } = await supabase
    .from("teams")
    .select("name")
    .eq("id", team_id)
    .single();

  if (teamError || !teamData) {
    return NextResponse.json(
      { success: false, message: "Invalid team ID." },
      { status: 400 }
    );
  }

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

  const errors = [];

  for (const email of emails) {
    try {
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

      const inviteData: Omit<InviteType, "id"> = {
        project_id: null,
        team_id,
        email,
        role: RoleType["MEMBER"],
        status: "pending",
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
        team_name: teamData.name,
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
