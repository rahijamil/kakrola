import { useAuthProvider } from "@/context/AuthContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { ChannelType } from "@/types/channel";
import { PageType } from "@/types/pageTypes";
import { ProjectType } from "@/types/project";
import {
  PersonalMemberForPageType,
  PersonalMemberForProjectType,
  TeamMemberType,
  TeamType,
} from "@/types/team";
import { supabaseBrowser } from "@/utils/supabase/client";

const useFavorite = ({
  column_value,
  column_name,
  team_id,
}: {
  column_value: PageType["id"] | ProjectType["id"] | ChannelType["id"];
  column_name: "page_id" | "project_id" | "channel_id";
  team_id?: TeamType["id"];
}) => {
  const { personalMembers, setPersonalMembers, teamMembers, setTeamMembers } =
    useSidebarDataProvider();
  const { profile } = useAuthProvider();

  const handleFavorite = async () => {
    if (!profile?.id) return;

    if (team_id) {
      const findTeamMember = teamMembers.find(
        (member) => member.profile_id == profile.id && member.team_id == team_id
      );

      if (!findTeamMember) {
        console.error("Team member not found for the given team and profile");
        return;
      }

      const findTeamMemberSettings = findTeamMember.settings;

      // Find the item to toggle based on the column name
      let updatedSettings: TeamMemberType["settings"] = findTeamMemberSettings;

      if (column_name == "project_id") {
        const existingProject = findTeamMemberSettings.projects.find(
          (project) => project.id === column_value
        );

        updatedSettings = {
          ...findTeamMemberSettings,
          projects: existingProject
            ? findTeamMemberSettings.projects.map((project) =>
                project.id == column_value
                  ? { ...project, is_favorite: !project.is_favorite }
                  : project
              )
            : [
                ...findTeamMemberSettings.projects,
                { id: column_value, is_favorite: true },
              ],
        };
      } else if (column_name == "page_id") {
        const existingPage = findTeamMemberSettings.pages.find(
          (page) => page.id === column_value
        );

        updatedSettings = {
          ...findTeamMemberSettings,
          pages: existingPage
            ? findTeamMemberSettings.pages.map((page) =>
                page.id == column_value
                  ? { ...page, is_favorite: !page.is_favorite }
                  : page
              )
            : [
                ...findTeamMemberSettings.pages,
                { id: column_value, is_favorite: true },
              ],
        };
      } else if (column_name == "channel_id") {
        const existingChannel = findTeamMemberSettings.channels.find(
          (channel) => channel.id === column_value
        );

        updatedSettings = {
          ...findTeamMemberSettings,
          channels: existingChannel
            ? findTeamMemberSettings.channels.map((channel) =>
                channel.id == column_value
                  ? { ...channel, is_favorite: !channel.is_favorite }
                  : channel
              )
            : [
                ...findTeamMemberSettings.channels,
                { id: column_value, is_favorite: true },
              ],
        };
      }

      // Optimistic UI update
      setTeamMembers(
        teamMembers.map((member) =>
          member.profile_id === profile.id && member.team_id === team_id
            ? { ...member, settings: updatedSettings }
            : member
        )
      );

      // Update the database
      const { error } = await supabaseBrowser
        .from("team_members")
        .update({
          settings: updatedSettings,
        })
        .eq("profile_id", profile.id)
        .eq("team_id", team_id);

      if (error) {
        console.error("Error updating team member settings:", error);
      }
    } else {
      // Personal member update logic (already in place)
      const personalMember = personalMembers.find((member) =>
        member.profile_id === profile?.id && column_name == "project_id"
          ? member.project_id === column_value
          : member.page_id === column_value
      );

      if (!personalMember) {
        console.error(
          "User project member settings not found for the given project"
        );
        return;
      }

      const updateProjectMemberSettings:
        | PersonalMemberForProjectType
        | PersonalMemberForPageType = {
        ...personalMember,
        settings: {
          ...personalMember.settings,
          is_favorite: !personalMember.settings.is_favorite,
        },
      };

      // Optimistic update
      setPersonalMembers(
        personalMembers.map((member) =>
          (
            column_name == "project_id"
              ? member.project_id === column_value
              : member.page_id === column_value
          )
            ? updateProjectMemberSettings
            : member
        )
      );

      // Update the database
      const { error } = await supabaseBrowser
        .from("personal_members")
        .update({
          settings: updateProjectMemberSettings.settings,
        })
        .eq("profile_id", profile?.id)
        .eq(column_name, column_value);

      if (error) {
        console.error("Error updating user project settings:", error);
      }
    }
  };

  return {
    handleFavorite,
  };
};

export default useFavorite;
