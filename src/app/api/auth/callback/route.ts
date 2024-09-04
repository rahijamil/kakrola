import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin: siteOrigin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";
  const acceptInviteToken = searchParams.get("accept_invite_token");

  if (!code) {
    console.error("No code found in the request");
    // Redirect to a generic error page or login page
    return NextResponse.redirect(`${siteOrigin}/auth/login?error=missing_code`);
  }

  try {
    const supabase = createClient();
    console.log("Attempting to exchange code for session...");

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Exchange code error:", error.message, error);
      // Redirect to a page with an appropriate error message
      return NextResponse.redirect(
        `${siteOrigin}/auth/login?error=exchange_failed`
      );
    }

    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    console.log("Exchange successful, determining redirect...");

    let redirectUrl = `${siteOrigin}${next}`;
    if (acceptInviteToken) {
      redirectUrl = `${siteOrigin}/api/invite/accept-invite?token=${acceptInviteToken}`;
    }

    if (isLocalEnv) {
      return NextResponse.redirect(redirectUrl);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error: any) {
    console.error("Error during code exchange:", error.message, error);
    // Redirect to a generic error page or login page with a relevant error message
    return NextResponse.redirect(
      `${siteOrigin}/auth/login?error=unexpected_error`
    );
  }
}
