import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { feedbackSchema } from "@/schemas/feedback";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body
    const body = await req.json();
    const validatedData = feedbackSchema.parse(body);

    // Insert feedback into database
    const { data, error } = await supabase
      .from("feedback")
      .insert({
        ...validatedData,
        profile_id: user.id,
        status: "OPEN",
        votes: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
