import { ProjectType, SectionType, TaskType } from "@/types/project";
import { supabaseBrowser } from "./supabase/client";

export const fetchSectionsAndTasksByProjectId = async (_project_id: ProjectType['id']) => {
  const { data, error } = await supabaseBrowser
    .rpc("fetch_project_sections_and_tasks", { _project_id })
    .single();

  if (error) {
    console.error("Error fetching project data:", error.message);
    return { sections: [], tasks: [] };
  }

  // Extract sections and tasks from the response
  const sections = (data as { sections: SectionType[] }).sections || [];
  const tasks = (data as { tasks: TaskType[] }).tasks || [];

  return { sections, tasks };
};
