"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  const { error } = await supabaseServer.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message || "Unknown error" };
  }

  revalidatePath("/", "layout");
  redirect("/app");
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
}
