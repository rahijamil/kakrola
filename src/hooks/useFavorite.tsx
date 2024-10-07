import { useAuthProvider } from "@/context/AuthContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { PersonalMemberForPageType, PersonalMemberForProjectType } from "@/types/team";
import { supabaseBrowser } from "@/utils/supabase/client";

const useFavorite = ({
  column_value,
  column_name,
}: {
  column_value: number;
  column_name: "page_id" | "project_id";
}) => {
  const { personalMembers, setPersonalMembers } = useSidebarDataProvider();
  const { profile } = useAuthProvider();

  const handleFavorite = async () => {
    if (!profile?.id) return;

    // Find the current user project settings for the given project
    const currentProjectMemberSettings = personalMembers.find((member) =>
      member.profile_id === profile?.id && column_name == "project_id"
        ? member.project_id === column_value
        : member.page_id === column_value
    );

    if (!currentProjectMemberSettings) {
      console.error(
        "User project member settings not found for the given project"
      );
      return;
    }

    const updateProjectMemberSettings: PersonalMemberForProjectType | PersonalMemberForPageType = {
      ...currentProjectMemberSettings,
      settings: {
        ...currentProjectMemberSettings.settings,
        is_favorite: !currentProjectMemberSettings.settings.is_favorite,
      },
    };

    // Update local state
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

    createActivityLog({
      actor_id: profile.id,
      action: ActivityAction.UPDATED_PROJECT,
      entity_id: column_value,
      entity_type: EntityType.PROJECT,
      metadata: {
        old_data: currentProjectMemberSettings,
        new_data: {
          ...updateProjectMemberSettings,
        },
      },
    });
  };

  return {
    handleFavorite,
  };
};

export default useFavorite;
