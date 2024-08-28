"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabaseServer = createClient();
  const { error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message || "Unknown error" };
  }

  revalidatePath("/", "layout");
  redirect("/app");
}

export async function signup({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabaseServer = createClient();
  const { error, data } = await supabaseServer.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message || "Unknown error" };
  }

  if (data.user) {
    // Store userId and email in cookies (or session)
    const userId = data.user.id;
    cookies().set("userId", userId, {
      path: "/",
      httpOnly: true, // Makes the cookie inaccessible to JavaScript
      secure: true, // Sends the cookie only over HTTPS
      maxAge: 60 * 60 * 24, // 1 day
    });

    cookies().set("email", email, {
      path: "/",
      httpOnly: true, // Makes the cookie inaccessible to JavaScript
      secure: true, // Sends the cookie only over HTTPS
      maxAge: 60 * 60 * 24, // 1 day
    });
  }

  console.log({ user: data.user });

  revalidatePath("/", "layout");
  redirect("/confirmation");
}

export async function forgotPassword(email: string) {
  const supabaseServer = createClient();

  // Check if email is exists
  const { data, error } = await supabaseServer
    .from("profiles")
    .select()
    .eq("email", email);
  if (error) {
    return { success: false, error: error.message || "Unknown error" };
  }
  if (data?.length === 0) {
    return { success: false, error: "Email not found" };
  }

  const { error: resetError } = await supabaseServer.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/update-password`,
    }
  );

  if (resetError) {
    return { success: false, error: resetError.message || "Unknown error" };
  }

  return { success: true, error: "" };
}

export async function updatePassword(newPassword: string) {
  const supabaseServer = createClient();

  const { error } = await supabaseServer.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message || "Unknown error" };
  }

  // Sign out the user after password update
  await supabaseServer.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/auth/login");
}

export async function signInWithProvider(provider: "google" | "github") {
  const supabaseServer = createClient();
  const { data, error } = await supabaseServer.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message || "Unknown error" };
  }

  if (data.url) {
    redirect(data.url);
  }

  // After redirect and successful OAuth flow, handle user session check
  const { data: sessionData, error: sessionError } =
    await supabaseServer.auth.getSession();

  if (sessionError || !sessionData?.session?.user) {
    return {
      success: false,
      error: sessionError?.message || "Unable to retrieve user session.",
    };
  }

  const user = sessionData.session.user;

  // Check if the user is onboarded by checking the is_onboarded flag in the profiles table
  const { data: profile, error: profileError } = await supabaseServer
    .from("profiles")
    .select("is_onboarded")
    .eq("email", user.email)
    .single();

  if (profileError) {
    // Handle the case where there is an error checking the profile table
    return { success: false, error: profileError.message || "Unknown error" };
  }

  if (profile && profile.is_onboarded === false) {
    // If the user is not onboarded, redirect to the onboarding page
    revalidatePath("/", "layout");
    redirect("/app/onboarding");
  } else {
    // If the user is onboarded, proceed with normal login
    revalidatePath("/", "layout");
    redirect("/app");
  }
}
