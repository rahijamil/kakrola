import { ViewTypes } from "./viewTypes";

// Project types
export interface ProjectType {
  id: number;
  team_id: number | null;
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
}

// Section types
export interface SectionType {
  id: string | number;
  project_id: number | null;
  profile_id: string;
  name: string;
  order: number;
  is_collapsed: boolean;
  is_inbox: boolean;
  is_archived: boolean;
  updated_at: string;
  created_at?: string;
  color?: string;
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
  created_at?: string;
}

export enum TaskPriority {
  P1 = "P1",
  P2 = "P2",
  P3 = "P3",
  Priority = "Priority",
}

export enum TaskStatus {
  OnTrack = "On Track",
  AtRisk = "At Risk",
  OffTrack = "Off Track",
}

// Task types
export interface TaskType {
  id: string | number;
  project_id: number | null;
  section_id: string | number | null;
  parent_task_id: string | number | null; // For subtasks
  profile_id: string; // UUID of the profile who created the task
  assignees: TaskAssigneeType[];
  title: string;
  description: string;
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
}
