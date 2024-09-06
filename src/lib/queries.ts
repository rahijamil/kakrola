import { supabaseBrowser } from "@/utils/supabase/client";
import { ProfileType } from "@/types/user";
import { ProjectType } from "@/types/project";

export const fetchAssigneeProfiles = async (projectId?: ProjectType['id']) => {
  if (!projectId) return [];
  const { data, error } = await supabaseBrowser.rpc("get_assignee_profiles", { _project_id: projectId });
  if (error) throw new Error(error.message);
  return data as ProfileType[];
};
