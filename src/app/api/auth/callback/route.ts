import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";

  if (code) {
    try {
      const supabase = createClient();
      console.log("Attempting to exchange code for session...");
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Exchange code error:", error.message, error);
        return NextResponse.redirect(`${origin}/auth/error`);
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      console.log("Exchange successful, redirecting...");
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch (error: any) {
      console.error("Error during code exchange:", error.message, error);
    }
  }

  // Return the user to an error page with instructions
  console.error("No code found or exchange failed");
  return NextResponse.redirect(`${origin}/auth/error`);
}
