import { supabaseBrowser } from "@/utils/supabase/client";
import { ProfileType } from "@/types/user";
import { ProjectType, SectionType } from "@/types/project";
import { NotificationType } from "@/types/notification";
import {
  PersonalMemberForPageType,
  PersonalMemberForProjectType,
  TeamMemberType,
  TeamType,
} from "@/types/team";
import { PageType } from "@/types/pageTypes";
import { ChannelType } from "@/types/channel";

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
export const fetchSidebarData = async (
  profileId?: string
): Promise<{
  personal_members: (
    | PersonalMemberForProjectType
    | PersonalMemberForPageType
  )[];
  projects: ProjectType[];
  sections: SectionType[];
  team_members: TeamMemberType[];
  teams: TeamType[];
  pages: PageType[];
  channels: ChannelType[];
}> => {
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
    return {
      personal_members: [],
      projects: [],
      sections: [],
      team_members: [],
      teams: [],
      pages: [],
      channels: [],
    };
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
    const { data, error } = await supabaseBrowser.rpc(
      "get_notifications_for_recipient",
      {
        _recipient_id: recipient_id,
        _page: page,
        _limit: limit,
      }
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
