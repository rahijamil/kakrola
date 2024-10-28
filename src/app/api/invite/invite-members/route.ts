import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendBulkInviteEmails } from "@/utils/sendEmail";
import { v4 as uuidv4 } from "uuid";
import { InviteStatus, TeamType } from "@/types/team";
import { PersonalRoleType } from "@/types/role";
import { ProjectType } from "@/types/project";
import { PageType } from "@/types/pageTypes";
import { ProfileType } from "@/types/user";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { emails, team_id, project_id, page_id, role, inviter } =
    (await req.json()) as {
      emails: ProfileType["email"][];
      team_id: TeamType["id"] | null;
      project_id: ProjectType["id"] | null;
      page_id: PageType["id"] | null;
      inviter: {
        id: ProfileType["id"];
        first_name: ProfileType["full_name"];
        email: ProfileType["email"];
        avatar_url: ProfileType["avatar_url"];
      };
      role?: PersonalRoleType;
    };

  if (!emails || !inviter) {
    return NextResponse.json(
      { success: false, message: "Missing required parameters." },
      { status: 400 }
    );
  }

  try {
    // Fetch all required data in parallel
    const [projectData, pageData, teamData, existingMembers, existingInvites] =
      await Promise.all([
        project_id
          ? supabase.from("projects").select("*").eq("id", project_id).single()
          : Promise.resolve(null),
        page_id
          ? supabase.from("pages").select("*").eq("id", page_id).single()
          : Promise.resolve(null),
        team_id
          ? supabase.from("teams").select("*").eq("id", team_id).single()
          : Promise.resolve(null),
        team_id
          ? supabase
              .from("team_members")
              .select("email")
              .eq("team_id", team_id)
              .in("email", emails)
          : Promise.resolve({ data: [] }),
        supabase
          .from("invites")
          .select("email, status, created_at")
          .in("email", emails)
          .or(
            `team_id.eq.${team_id},project_id.eq.${project_id},page_id.eq.${page_id}`
          ),
      ]);

    // Validate data existence
    if (project_id && !projectData?.data) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID." },
        { status: 400 }
      );
    }
    if (page_id && !pageData?.data) {
      return NextResponse.json(
        { success: false, message: "Invalid page ID." },
        { status: 400 }
      );
    }
    if (team_id && !teamData?.data) {
      return NextResponse.json(
        { success: false, message: "Invalid team ID." },
        { status: 400 }
      );
    }

    // Filter out invalid emails
    const existingMemberEmails = new Set(
      existingMembers?.data?.map((m) => m.email) || []
    );
    const existingValidInvites = new Set(
      existingInvites?.data
        ?.filter(
          (invite) =>
            invite.status === "pending" &&
            Date.now() - new Date(invite.created_at).getTime() <
              7 * 24 * 60 * 60 * 1000 // 7 days
        )
        .map((invite) => invite.email) || []
    );

    const validEmails = emails.filter(
      (email) =>
        !existingMemberEmails.has(email) && !existingValidInvites.has(email)
    );

    if (validEmails.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid emails to invite." },
        { status: 400 }
      );
    }

    // Prepare bulk invite data
    const invites = validEmails.map((email) => ({
      project_id: project_id || null,
      page_id: page_id || null,
      team_id: team_id || null,
      email,
      role: role || PersonalRoleType.MEMBER,
      status: InviteStatus.PENDING,
      token: uuidv4(),
    }));

    // Bulk insert invites
    const { error: insertError } = await supabase
      .from("invites")
      .insert(invites);
    if (insertError) throw insertError;

    // Send emails in bulk
    await sendBulkInviteEmails({
      invites,
      inviter,
      projectData: projectData?.data || null,
      pageData: pageData?.data || null,
      teamData: teamData?.data || null,
    });

    return NextResponse.json({ success: true, message: "Invites sent." });
  } catch (error) {
    console.error("Error in invite process:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process invites." },
      { status: 500 }
    );
  }
}
