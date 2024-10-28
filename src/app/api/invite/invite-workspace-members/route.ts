import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendBulkInviteEmails } from "@/utils/sendEmail";
import { v4 as uuidv4 } from "uuid";
import { InviteStatus } from "@/types/team";
import { WorkspaceRoleType } from "@/types/role";
import { WorkspaceType } from "@/types/workspace";
import { ProfileType } from "@/types/user";

const CACHE_EXPIRATION_SECONDS = 60; // 1 minute

let cachedWorkspaceData: WorkspaceType | null = null;
let cachedExistingMembers: Set<string> | null = null;
let cachedExistingInvites: Set<string> | null = null;

async function getWorkspaceData(
  supabase: ReturnType<typeof createClient>,
  workspace_id: WorkspaceType["id"]
): Promise<WorkspaceType> {
  if (cachedWorkspaceData && cachedWorkspaceData.id === workspace_id) {
    return cachedWorkspaceData;
  }

  const { data, error } = await supabase
    .from("workspaces")
    .select("id, name")
    .eq("id", workspace_id)
    .single();
  if (error || !data) {
    throw error || new Error("Invalid workspace ID.");
  }

  cachedWorkspaceData = data as WorkspaceType;
  setTimeout(() => {
    cachedWorkspaceData = null;
  }, CACHE_EXPIRATION_SECONDS * 1000);

  return data as WorkspaceType;
}

async function getExistingMembers(
  supabase: ReturnType<typeof createClient>,
  workspace_id: WorkspaceType["id"],
  emails: string[]
): Promise<Set<string>> {
  if (
    cachedExistingMembers &&
    emails.every((email) => cachedExistingMembers!.has(email))
  ) {
    return cachedExistingMembers;
  }

  const { data } = await supabase
    .from("workspace_members")
    .select("email")
    .eq("workspace_id", workspace_id)
    .in("email", emails);

  const existingMemberEmails = new Set(data?.map((m) => m.email) || []);

  cachedExistingMembers = existingMemberEmails;
  setTimeout(() => {
    cachedExistingMembers = null;
  }, CACHE_EXPIRATION_SECONDS * 1000);

  return existingMemberEmails;
}

async function getExistingInvites(
  supabase: ReturnType<typeof createClient>,
  workspace_id: WorkspaceType["id"],
  emails: string[]
): Promise<Set<string>> {
  if (
    cachedExistingInvites &&
    emails.every((email) => cachedExistingInvites!.has(email))
  ) {
    return cachedExistingInvites;
  }

  const { data } = await supabase
    .from("invites")
    .select("email, status, created_at")
    .eq("workspace_id", workspace_id)
    .in("email", emails);

  const existingValidInvites = new Set(
    data
      ?.filter(
        (invite) =>
          invite.status === InviteStatus.PENDING &&
          Date.now() - new Date(invite.created_at).getTime() <=
            7 * 24 * 60 * 60 * 1000 // 7 days
      )
      .map((invite) => invite.email) || []
  );

  cachedExistingInvites = existingValidInvites;
  setTimeout(() => {
    cachedExistingInvites = null;
  }, CACHE_EXPIRATION_SECONDS * 1000);

  return existingValidInvites;
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { emails, workspace_id, inviter, role } = (await req.json()) as {
    emails: ProfileType["email"][];
    workspace_id: WorkspaceType["id"];
    inviter: {
      id: ProfileType["id"];
      first_name: ProfileType["full_name"];
      email: ProfileType["email"];
      avatar_url: ProfileType["avatar_url"];
    };
    role?: WorkspaceRoleType;
  };

  if (!emails || !workspace_id || !inviter) {
    return NextResponse.json(
      { success: false, message: "Missing required parameters." },
      { status: 400 }
    );
  }

  try {
    // Fetch workspace, existing members, and existing invites in parallel
    const [workspaceData, existingMemberEmails, existingValidInvites] =
      await Promise.all([
        getWorkspaceData(supabase, workspace_id),
        getExistingMembers(supabase, workspace_id, emails),
        getExistingInvites(supabase, workspace_id, emails),
      ]);

    // Filter out existing members and valid pending invites
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

    // Prepare workspace invites
    const invites = validEmails.map((email) => ({
      workspace_id,
      email,
      role: role || WorkspaceRoleType.WORKSPACE_MEMBER,
      status: InviteStatus.PENDING,
      token: uuidv4(),
    }));

    // Insert invites in a single bulk operation
    const { error: insertError } = await supabase
      .from("invites")
      .insert(invites);
    if (insertError) throw insertError;

    // Send invitation emails asynchronously
    sendBulkInviteEmails({
      invites,
      inviter,
      workspaceData,
    });

    return NextResponse.json({
      success: true,
      message: "Workspace invites sent successfully.",
      data: {
        sent: validEmails.length,
        skipped: emails.length - validEmails.length,
      },
    });
  } catch (error) {
    console.error("Error in workspace invite process:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process workspace invites." },
      { status: 500 }
    );
  }
}
