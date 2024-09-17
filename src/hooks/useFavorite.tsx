import { useAuthProvider } from "@/context/AuthContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { ActivityAction, createActivityLog, EntityType } from "@/types/activitylog";
import { ProjectType } from "@/types/project";
import { ProjectMemberType } from "@/types/team";
import { supabaseBrowser } from "@/utils/supabase/client";

const useFavorite = ({ project }: { project: ProjectType }) => {
  const { projectMembers, setProjectMembers } = useSidebarDataProvider();
  const { profile } = useAuthProvider();

  const handleFavorite = async () => {
    if(!profile?.id) return;

    // Find the current user project settings for the given project
    const currentProjectMemberSettings = projectMembers.find(
      (member) =>
        member.profile_id === profile?.id && member.project_id === project.id
    );

    if (!currentProjectMemberSettings) {
      console.error(
        "User project member settings not found for the given project"
      );
      return;
    }

    const updateProjectMemberSettings: ProjectMemberType = {
      ...currentProjectMemberSettings,
      project_settings: {
        ...currentProjectMemberSettings.project_settings,
        is_favorite: !currentProjectMemberSettings.project_settings.is_favorite,
      },
    };

    // Update local state
    setProjectMembers(
      projectMembers.map((member) =>
        member.project_id === project.id ? updateProjectMemberSettings : member
      )
    );

    // Update the database
    const { error } = await supabaseBrowser
      .from("project_members")
      .update({
        project_settings: updateProjectMemberSettings.project_settings,
      })
      .eq("profile_id", profile?.id)
      .eq("project_id", project.id);

    if (error) {
      console.error("Error updating user project settings:", error);
    }

    createActivityLog({
      actor_id: profile.id,
      action: ActivityAction.UPDATED_PROJECT,
      entity_id: project.id,
      entity_type: EntityType.PROJECT,
      metadata: {
        old_data: project,
        new_data: {
          ...project,
          ...updateProjectMemberSettings,
        },
      }
    })
  };

  return {
    handleFavorite,
  };
};

export default useFavorite;
