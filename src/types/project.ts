import { JSONContent } from "novel";
import { ViewTypes } from "./viewTypes";
import { TeamType } from "./team";
import { WorkspaceType } from "./workspace";
import { ProfileType } from "./user";

// Project types
export interface ProjectType {
  id: number | string;
  team_id: TeamType["id"] | null;
  profile_id: string; // UUID
  name: string;
  slug: string;
  updated_at: string;
  created_at?: string;
  is_archived: boolean;
  settings: {
    color: string;
    view: ViewTypes["view"];
    selected_views: ViewTypes["view"][];
  };
  workspace_id: WorkspaceType["id"];
}

// Section types
export interface SectionType {
  id: string | number;
  project_id: ProjectType['id'] | null;
  profile_id: ProfileType['id'];
  name: string;
  order: number;
  is_collapsed: boolean;
  is_inbox: boolean;
  is_archived: boolean;
  updated_at: string;
  created_at?: string;
  color?: string;
  workspace_id: WorkspaceType["id"];
}

// Task Label types
export interface TaskLabelType {
  id: string | number;
  name: string;
  slug: string;
  color: string;
  profile_id: string;
  created_at?: string;
  is_favorite: boolean;
}

// Task Assignee types
export interface TaskAssigneeType {
  id: string | number;
  profile_id: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

export enum TaskPriority {
  P1 = "P1",
  P2 = "P2",
  P3 = "P3",
  Priority = "Priority",
}

export enum TaskStatus {
  ON_TRACK = "ON_TRACK",
  AT_RISK = "AT_RISK",
  OFF_TRACK = "OFF_TRACK",
  ON_HOLD = "ON_HOLD",
  COMPLETE = "COMPLETE",
}

// Task types
export interface TaskType {
  id: string | number;
  project_id: ProjectType['id'] | null;
  section_id: string | number | null;
  parent_task_id: string | number | null; // For subtasks
  profile_id: string; // UUID of the profile who created the task
  assignees: TaskAssigneeType[];
  title: string;
  description: JSONContent | null;
  priority: TaskPriority;
  is_inbox: boolean;
  status: TaskStatus | null;
  dates: {
    start_date: string | null; // ISO date (e.g., "2024-09-05")
    start_time: string | null; // Time (e.g., "15:30")
    end_date: string | null; // ISO date (e.g., "2024-09-05")
    end_time: string | null; // Time (e.g., "17:00")
    reminder: string | null; // 0, 5, 10, 15, 30, 60, 120, 1440, 2880, null
  };
  is_completed: boolean;
  completed_at: string | null;
  order: number;
  updated_at?: string;
  created_at?: string;
  task_labels: TaskLabelType[];
  workspace_id: WorkspaceType["id"];
}
