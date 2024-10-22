// app/api/import/notion/callback.ts
import { OAuthTokenProvider, OAuthTokenType } from "@/types/user";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPathname = searchParams.get("state") || "/app";

  if (!code) {
    console.error("No authorization code provided");
    return NextResponse.json(
      { message: "No authorization code provided" },
      { status: 400 }
    );
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID;
    const clientSecret = process.env.NOTION_CLIENT_SECRET;

    // encode in base 64
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    // Exchange code for access token
    const tokenResponse = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/import/notion/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Failed to exchange code for token:", errorData);
      return NextResponse.json(
        {
          message: "Failed to exchange authorization code for token",
          error: errorData,
        },
        { status: tokenResponse.status }
      );
    }

    const data = await tokenResponse.json();
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token; // If available
    const expiresAt = data.expires_in
      ? new Date(Date.now() + data.expires_in * 1000)
      : null;

    if (!accessToken) {
      console.error("No access token received from Notion");
      return NextResponse.json(
        { message: "No access token received from Notion" },
        { status: 500 }
      );
    }

    // Initialize Supabase client and get the current user
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      console.error(
        "Failed to get the authenticated user:",
        userError || "No user found"
      );
      return NextResponse.json(
        { message: "Failed to import from Notion, user not found" },
        { status: 500 }
      );
    }

    // Prepare token data for insertion
    const OAuthTokenData: Omit<OAuthTokenType, "id"> = {
      profile_id: user.id,
      provider: OAuthTokenProvider.NOTION,
      token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    };

    // Insert the token into the database
    const { error: insertError } = await supabase
      .from("oauth_tokens")
      .insert([OAuthTokenData]);

    if (insertError) {
      console.error(
        "Failed to insert OAuth token into the database:",
        insertError
      );
      return NextResponse.json(
        { message: "Failed to save Notion token", error: insertError },
        { status: 500 }
      );
    }

    // Redirect back to the import page after successful insertion
    return NextResponse.redirect(
      process.env.NEXT_PUBLIC_APP_URL +
        decodeURIComponent(nextPathname + "?settings=import&provider=notion")
    );
  } catch (error) {
    console.error("Error during Notion import callback:", error);
    return NextResponse.json(
      {
        message:
          "An error occurred while processing the Notion import callback",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
