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
  color: string;
  description: string;
  preview_image: string;
  view: ViewTypes["view"];
  template_creator: TemplateCreatorInfo;
  created_at?: string;
  updated_at?: string;
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
  description: string;
  priority: "P1" | "P2" | "P3" | "Priority";
  order: number;
  created_at?: string;
  updated_at?: string;
}
