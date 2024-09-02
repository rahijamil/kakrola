import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("query");
  const profile_id = searchParams.get("profile_id");

  if (!searchQuery) {
    return NextResponse.json({ users: [] }); // Return an empty array if no query is provided
  }

  const supabase = createClient();

  try {
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("id")
      .eq("profile_id", profile_id);

    if (teamsError) {
      console.error("Failed to fetch teams", teamsError);
      return NextResponse.json(
        { error: "Failed to fetch teams" },
        { status: 500 }
      );
    }

    // Perform a search query to find users that match the searchQuery
    const { data: users, error } = await supabase
      .from("team_members")
      .select("*")
      .in(
        "team_id",
        teams.map((team) => team.id)
      )
      .ilike("email", `%${searchQuery}%`)
      .limit(10);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    return NextResponse.json({ users });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
