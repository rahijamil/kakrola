import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const user = await supabase.auth.getUser();

  // Redirect if user is logged in and tries to access the /confirmation page
  if (request.nextUrl.pathname === "/confirmation" && user.data.user) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  if (
    (request.nextUrl.pathname.startsWith("/app") ||
      request.nextUrl.pathname == "/auth/update-password") &&
    user.error
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  } else if (
    ((request.nextUrl.pathname.startsWith("/auth") &&
      request.nextUrl.pathname !== "/auth/update-password") ||
      request.nextUrl.pathname == "/") &&
    !user.error
  ) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  if (request.nextUrl.pathname == "/app/projects" && user.data.user) {
    return NextResponse.redirect(new URL("/app/projects/active", request.url));
  }

  return supabaseResponse;
}
