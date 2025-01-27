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
import { WorkspaceType } from "@/types/workspace";

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
  profileId?: string,
  current_workspace_id?: WorkspaceType["id"]
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
    if (!current_workspace_id) throw new Error("No Workspace ID provided");

    const { data, error } = await supabaseBrowser.rpc(
      "fetch_sidebar_data_for_profile",
      { _profile_id: profileId, _workspace_id: current_workspace_id }
    );

    if (error) {
      console.error("RPC Fetch Error:", error.message);
      throw error;
    }

    // console.log({ data });

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

export interface TeamMemberData extends TeamMemberType {
  profile: ProfileType;
}

export const fetchTeamMembersData = async (teamId?: TeamType["id"]) => {
  const { data: members, error: membersError } = await supabaseBrowser
    .from("team_members")
    .select("id, team_role, profiles(id, avatar_url, full_name, email)")
    .eq("team_id", teamId);

  if (membersError) throw new Error("Failed to fetch members");

  return members.map((member) => {
    const { profiles, ...restMember } = member;
    return {
      ...restMember,
      team_id: teamId,
      profile_id: (profiles as any).id,
      profile: profiles as unknown as {
        id: any;
        avatar_url: any;
        full_name: any;
        email: any;
      },
    };
  }) as TeamMemberData[];
};
