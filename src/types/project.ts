import { ViewTypes } from "./viewTypes";

// Project types
export interface ProjectType {
  id: number;
  team_id: number | null;
  profile_id: string; // UUID
  name: string;
  slug: string;
  icon_url: string; // Store as string in DB, convert to ReactNode in frontend
  is_favorite: boolean;
  view: ViewTypes["view"];
  updated_at?: Date;
  created_at?: Date;
}

// Section types
export interface SectionType {
  id: number;
  project_id: number;
  profile_id: string;
  name: string;
  order: number;
  is_collapsed: boolean;
  updated_at?: Date;
  created_at?: Date;
}

// Task types
export interface TaskType {
  id: number;
  project_id: number | null;
  section_id: number | null;
  parent_task_id: number | null; // For subtasks
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
  created_at?: Date;
  updated_at?: Date;
}
