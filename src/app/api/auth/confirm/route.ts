import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/app";

  // Log the incoming parameters for debugging
  console.log("Received query parameters:", { token_hash, type, next });

  if (!token_hash || !type) {
    console.error("Missing token_hash or type in query parameters");
    // Throwing an error for global handling
    throw new Error("Missing token_hash or type in query parameters");
  }

  const supabaseServer = createClient();
  const { data, error } = await supabaseServer.auth.verifyOtp({
    type,
    token_hash,
  });

  // Log the response from verifyOtp
  if (error) {
    console.error("Error verifying OTP:", error);
    // Throwing an error for global handling
    throw new Error("Error verifying OTP");
  }

  console.log("OTP verification successful:", data);

  if (data.session && type == "recovery") {
    // Log the session before setting it
    console.log("Setting session:", data.session);
    await supabaseServer.auth.setSession(data.session);
  }

  // Log the redirect path
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("next");

  console.log("Redirecting to:", redirectTo.href);
  return NextResponse.redirect(redirectTo);
}
