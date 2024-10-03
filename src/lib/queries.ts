import { supabaseBrowser } from "@/utils/supabase/client";
import { ProfileType } from "@/types/user";
import { ProjectType } from "@/types/project";
import { NotificationType } from "@/types/notification";

export const fetchAssigneeProfiles = async (projectId?: ProjectType["id"]) => {
  if (!projectId) return [];
  const { data, error } = await supabaseBrowser.rpc("get_assignee_profiles", {
    _project_id: projectId,
  });
  if (error) throw new Error(error.message);
  return data as ProfileType[];
};

export const getProfileById = async (id: string) => {
  const { data, error } = await supabaseBrowser
    .from("profiles")
    .select("id, username, avatar_url, email, full_name")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as ProfileType;
};

// Fetching merged data for projects, teams, sections, and pages
export const fetchSidebarData = async (profileId?: string) => {
  try {
    if (!profileId) throw new Error("No profile ID provided");

    const { data, error } = await supabaseBrowser.rpc(
      "fetch_sidebar_data_for_profile",
      { _profile_id: profileId }
    );

    if (error) {
      console.error("RPC Fetch Error:", error.message);
      throw error;
    }

    return data || {};
  } catch (error) {
    console.error("Error fetching data:", error);
    return {};
  }
};

// Function to get notifications for a specific user
export async function getNotifications({
  recipient_id,
  page = 1,
  limit = 50,
}: {
  recipient_id: string;
  page?: number;
  limit?: number;
}): Promise<NotificationType[]> {
  try {
    const { data, error } = await supabaseBrowser
      .from("notifications")
      .select("*")
      .in("recipients", [recipient_id])
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
