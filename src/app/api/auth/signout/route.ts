import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabaseServer = createClient();
    // Check if a user's logged in
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (user) {
      await supabaseServer.auth.signOut();
    }

    revalidatePath("/", "layout");

    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error signing out:", error);

    // Return an error response
    return NextResponse.json({ success: false, message: "Error signing out" }, {
      status: 500,
    });
  }
}
