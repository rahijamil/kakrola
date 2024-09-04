import { ProjectType } from "@/types/project";
import { ProjectMemberType } from "@/types/team";

export const sortProjects = (
    projects: ProjectType[],
    projectMembers: ProjectMemberType[]
  ): ProjectType[] => {
    // Create a map from user settings for quick lookup
    const settingsMap = new Map<number, ProjectMemberType>(
      projectMembers.map((setting) => [setting.project_id, setting])
    );
  
    // Sort projects based on user settings
    return [...projects].sort((a, b) => {
      const aSettings = settingsMap.get(a.id);
      const bSettings = settingsMap.get(b.id);
  
      // Default order to 0 if settings are not found
      const aOrder = aSettings?.project_settings.order || 0;
      const bOrder = bSettings?.project_settings.order || 0;
  
      return aOrder - bOrder;
    });
  };