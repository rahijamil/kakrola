import { supabaseBrowser } from "@/utils/supabase/client";
import { ProfileType } from "@/types/user";
import { ProjectType } from "@/types/project";

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
