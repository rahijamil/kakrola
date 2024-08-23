import { ViewTypes } from "./viewTypes";

// Project types
export interface ProjectType {
  id: number;
  team_id: number | null;
  profile_id: string; // UUID
  name: string;
  slug: string;
  color: string; // Store as string in DB, convert to ReactNode in frontend
  is_favorite: boolean;
  view: ViewTypes["view"];
  updated_at: string;
  created_at?: string;
  order: number;
  is_archived: boolean;
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

// Task types
export interface TaskType {
  id: string | number;
  project_id: number | null;
  section_id: string | number | null;
  parent_task_id: string | number | null; // For subtasks
  profile_id: string; // UUID of the profile who created the task
  assigned_to_id: string | null; // UUID of the profile the task is assigned to
  title: string;
  description: string;
  priority: "P1" | "P2" | "P3" | "Priority";
  is_inbox: boolean;
  due_date: string | null;
  reminder_time: string | null;
  is_completed: boolean;
  completed_at: string | null;
  order: number;
  updated_at?: string;
  created_at?: string;
  labels?: TaskLabelType[];
}
