import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email, full_name, avatar_url, is_onboarded")
        .eq("id", user.id)
        .single();
      if (error) throw error;

      return NextResponse.json(data);
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching profile:", error);

    return NextResponse.json(
      { error: "Error fetching profile" },
      { status: 500 }
    );
  }
}
