import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/app";

  if (!token_hash || !type) {
    return NextResponse.redirect(new URL("/auth/error", request.url), {
      status: 302,
    });
  }

  const supabaseServer = createClient();
  const { data, error } = await supabaseServer.auth.verifyOtp({
    type,
    token_hash,
  });

  if (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.redirect(new URL("/auth/error", request.url), {
      status: 302,
    });
  }

  if (data.session && type == "recovery") {
    // Set the session using Supabase's setSession method
    await supabaseServer.auth.setSession(data.session);
  }

  // For both email confirmation and password reset, redirect to the next page
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("next");

  return NextResponse.redirect(redirectTo);
}