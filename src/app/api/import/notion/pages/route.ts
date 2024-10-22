import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get("access_token");

  if (!accessToken) {
    return NextResponse.json(
      { message: "Access token is required" },
      { status: 400 }
    );
  }

  try {
    const notion = new Client({ auth: accessToken });

    const data = await notion.search({
      query: "",
      filter: {
        value: "page",
        property: "object",
      },
      sort: {
        direction: "ascending",
        timestamp: "last_edited_time",
      },
    });

    return NextResponse.json({ data });
  } catch (error: any) {
    // Handle different types of exceptions
    if (error.name === "TypeError") {
      // Handle network-related errors (e.g., request failure)
      return NextResponse.json(
        { message: "Network Error: Unable to reach Notion API" },
        { status: 502 }
      );
    }

    // Catch other unexpected errors
    console.error("Error fetching Notion pages:", error);
    return NextResponse.json(
      { message: "Unexpected Error", error: error.message },
      { status: 500 }
    );
  }
}
