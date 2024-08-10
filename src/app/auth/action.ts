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
  const { error } = await supabaseServer.auth.resetPasswordForEmail(email);

  if (error) {
    return { success: false, error: error.message || "Unknown error" };
  }

  return { success: true, error: "" };
}
