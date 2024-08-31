import { ProfileType } from "@/types/user";
import { createClient } from "@/utils/supabase/server";

export async function getUser(): Promise<ProfileType | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch the user's profile using their email to get the profile ID
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", user.email)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile; // Return the profile object with id
}
