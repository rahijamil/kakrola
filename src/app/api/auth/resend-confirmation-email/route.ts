import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers"; // For accessing cookies
import { type NextRequest, NextResponse } from "next/server";
import rateLimiter from "@/lib/rateLimiter";

export async function POST(req: NextRequest) {
  try {
    const userIdCookie = cookies().get("userId");
    const emailCookie = cookies().get("email");

    // Ensure the cookies are present and extract their values
    const userId = userIdCookie ? userIdCookie.value : null;
    const email = emailCookie ? emailCookie.value : null;

    console.log({ userId, email });

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Rate limit check
    const ip = req.ip || "unknown-ip";

    // Rate limit check
    try {
      await rateLimiter.consume(ip);
    } catch (rateLimitError) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const supabaseServer = createClient(true);

    // Query user from Supabase Auth by email using Admin API
    const { data: user, error: userError } =
      await supabaseServer.auth.admin.getUserById(userId);

    if (userError) {
      return NextResponse.json(
        { message: userError.message || "Unknown error" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: "No user found with this email." },
        { status: 404 }
      );
    }

    // Check if email is confirmed
    if (user.user.email_confirmed_at) {
      return NextResponse.json(
        { message: "Email is already confirmed." },
        { status: 400 }
      );
    }

    // Use Supabase Admin API to resend confirmation email
    const { error: resendError } = await supabaseServer.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      console.error("Supabase resend error:", resendError);
      return NextResponse.json(
        { message: resendError.message || "Unknown error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Confirmation email resent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
