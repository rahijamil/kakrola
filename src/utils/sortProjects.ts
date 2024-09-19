import { ProjectType } from "@/types/project";
import { PersonalMemberType } from "@/types/team";

export const sortProjects = (
  projects: ProjectType[],
  personalMembers: PersonalMemberType[]
): ProjectType[] => {
  // Create a map from user settings for quick lookup
  const members = personalMembers.filter((member) => member.project_id != null);

  const settingsMap = new Map<number, PersonalMemberType>(
    members.map((member) => [member.project_id!, member])
  );

  // Sort projects based on user settings
  return [...projects].sort((a, b) => {
    const aSettings = settingsMap.get(a.id);
    const bSettings = settingsMap.get(b.id);

    // Default order to 0 if settings are not found
    const aOrder = aSettings?.settings.order || 0;
    const bOrder = bSettings?.settings.order || 0;

    return aOrder - bOrder;
  });
};
