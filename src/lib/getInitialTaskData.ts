import {
  ProjectType,
  SectionType,
  TaskPriority,
  TaskType,
} from "@/types/project";
import { v4 as uuidv4 } from "uuid";

export const getInitialTaskData = ({
  project,
  section_id,
  profile,
}: {
  project: ProjectType | null;
  section_id?: SectionType["id"] | null;
  profile: {
    id: string;
  } | null;
}): Omit<TaskType, "workspace_id"> => ({
  id: uuidv4(),
  title: "",
  description: null,
  priority: TaskPriority.Priority,
  project_id: project?.id || null,
  section_id: section_id || null,
  parent_task_id: null,
  profile_id: profile?.id || "",
  assignees: [],
  dates: {
    start_date: null,
    start_time: null,
    end_date: null,
    end_time: null,
    reminder: null,
  },
  is_inbox: project ? false : true,
  is_completed: false,
  order: 0,
  completed_at: null,
  updated_at: new Date().toISOString(),
  status: null,
  task_labels: [],
});
