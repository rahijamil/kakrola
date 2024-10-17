"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function login({
  email,
  password,
  captchaToken,
}: {
  email: string;
  password: string;
  captchaToken?: string;
}) {
  const supabaseServer = createClient();
  const { error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
    // options: {
    //   captchaToken,
    // },
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
  captchaToken,
}: {
  email: string;
  password: string;
  captchaToken?: string;
}) {
  const supabaseServer = createClient();
  const { error, data } = await supabaseServer.auth.signUp({
    email,
    password,
    // options: {
    //   captchaToken,
    // },
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

export async function forgotPassword(email: string, captchaToken?: string) {
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
      // captchaToken,
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

export async function signInWithProvider(
  provider:
    | "google"
    | "github"
    | "linkedin"
    | "notion"
    | "slack_oidc",
  acceptInviteToken?: string | null
) {
  const supabaseServer = createClient();

  if (acceptInviteToken) {
    const { data, error } = await supabaseServer.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?&accept_invite_token=${acceptInviteToken}`,
      },
    });

    if (error) {
      return { success: false, error: error.message || "Unknown error" };
    }

    if (data.url) {
      redirect(data.url);
    }
  } else {
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

export async function linkAccountsAfterAuth() {
  const supabaseServer = createClient();

  // Retrieve the previous profile ID and linked accounts from cookies
  const previousProfileIdCookie = cookies().get("previousProfileId");
  const previousLinkedAccountsCookie = cookies().get("previousLinkedAccounts");

  if (!previousProfileIdCookie || !previousLinkedAccountsCookie) {
    return {
      success: false,
      error: "No previous profile or linked accounts found",
    };
  }

  const previousProfileId = previousProfileIdCookie.value;
  const previousLinkedAccounts = JSON.parse(
    decodeURIComponent(previousLinkedAccountsCookie.value)
  );

  // Get the current authenticated user (new account)
  const {
    data: { user },
    error: authError,
  } = await supabaseServer.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: authError?.message || "No authenticated user found",
    };
  }

  const newProfileId = user.id;

  // Prevent the same account from being linked to itself
  if (previousProfileId === newProfileId) {
    console.log("Same account can't be linked", newProfileId);
    return { success: false, error: "Same account can't be linked" };
  }

  // Check if the newProfileId is already in the linked accounts to avoid duplicates
  if (
    previousLinkedAccounts.some(
      (account: { profile_id: string }) => account.profile_id === newProfileId
    )
  ) {
    console.log("This account is already linked", newProfileId);
    return { success: false, error: "This account is already linked" };
  }

  // Create a new linked accounts list without the previous profile
  const updatedLinkedAccounts = [
    ...previousLinkedAccounts.filter(
      (account: { profile_id: string }) =>
        account.profile_id !== previousProfileId
    ),
    { profile_id: newProfileId },
  ];

  console.log({ updatedLinkedAccounts });

  // Update the current user (new account) with the new linked account
  const { data, error: updateError } = await supabaseServer
    .from("profiles")
    .update({
      linked_accounts: updatedLinkedAccounts,
    })
    .eq("id", newProfileId);

  if (updateError) {
    return {
      success: false,
      error: updateError.message || "Error linking accounts",
    };
  }

  // Update the previous profile with the new linked account as well
  const { error: prevUpdateError } = await supabaseServer
    .from("profiles")
    .update({
      linked_accounts: updatedLinkedAccounts,
    })
    .eq("id", previousProfileId);

  if (prevUpdateError) {
    return {
      success: false,
      error: prevUpdateError.message || "Error updating previous profile",
    };
  }

  // Clear the cookies
  cookies().set("previousProfileId", "", { path: "/", maxAge: -1 });
  cookies().set("previousLinkedAccounts", "", { path: "/", maxAge: -1 });

  // Revalidate the homepage or the layout to reflect the new session
  revalidatePath("/", "layout");

  return { success: true, data };
}
