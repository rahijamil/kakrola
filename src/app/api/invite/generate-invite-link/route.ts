import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { InviteStatus, PageInviteType, ProjectInviteType } from "@/types/team";
import { RoleType } from "@/types/role";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { team_id } = (await req.json()) as { team_id: number };

  if (!team_id) {
    return NextResponse.json(
      { success: false, message: "Team ID is missing." },
      { status: 400 }
    );
  }

  // Generate a unique token for the invite link
  const token = uuidv4();

  try {
    const inviteData: Omit<ProjectInviteType | PageInviteType, "id"> = {
      team_id,
      email: null,
      role: RoleType["MEMBER"],
      status: InviteStatus.PENDING,
      token,
    };

    // Insert a new invite into the database with the status as 'pending'
    const { error: insertError } = await supabase
      .from("invites")
      .insert([inviteData]);

    if (insertError) {
      throw new Error("Failed to create invite token");
    }

    // Create the invite link using the generated token
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${token}`;

    return NextResponse.json({ success: true, link: inviteLink });
  } catch (error: any) {
    console.error("Error generating invite link:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate invite link." },
      { status: 500 }
    );
  }
}
