import { JSONContent } from "novel";
import { TaskPriority } from "./project";
import { ViewTypes } from "./viewTypes";

export interface TemplateCreatorInfo {
  id: string | null;
  name: string;
  avatar_url: string | null;
}

export interface TemplateProjectType {
  id?: number;
  name: string;
  slug: string;
  description: string;
  preview_image: string;
  template_creator: TemplateCreatorInfo;
  created_at?: string;
  updated_at?: string;
  settings: {
    color: string;
    view: ViewTypes["view"];
  };
}

export interface TemplateSectionType {
  id?: string | number;
  template_project_id: number;
  name: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateTaskType {
  id?: string | number;
  template_project_id: number;
  template_section_id: string | number | null;
  parent_template_task_id: string | number | null;
  title: string;
  description: JSONContent | null;
  priority: TaskPriority;
  order: number;
  created_at?: string;
  updated_at?: string;
  // dates: {
  //   start_date: string | null; // ISO date (e.g., "2024-09-05")
  //   start_time: string | null; // Time (e.g., "15:30")
  //   end_date: string | null; // ISO date (e.g., "2024-09-05")
  //   end_time: string | null; // Time (e.g., "17:00")
  //   reminder: string | null; // 0, 5, 10, 15, 30, 60, 120, 1440, 2880, null
  // };
}
