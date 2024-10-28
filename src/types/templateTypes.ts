// templateTypes.ts

import { JSONContent } from "novel";
import {
  ProjectType,
  SectionType,
  TaskPriority,
  TaskStatus,
  TaskType,
} from "./project";
import { ViewTypes } from "./viewTypes";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ProfileType } from "./user";
import { generateSlug } from "@/utils/generateSlug";
import {
  PersonalMemberForPageType,
  PersonalMemberForProjectType,
} from "./team";
import { PersonalRoleType } from "./role";
import { PageType } from "./pageTypes";
import { WorkspaceType } from "./workspace";

// Base template interface for common properties
export interface BaseTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  preview_image?: string;
  created_at?: string;
  updated_at?: string;
  creator_id: ProfileType["id"];
  is_featured?: boolean;
  category?: string;
  tags?: string[];
}

// Page template specific interface
export interface PageTemplate extends BaseTemplate {
  type: "page";
  content: JSONContent;
  settings: {
    color: string;
    banner_url?: string;
  };
}

// Project template interfaces
export interface ProjectTemplate extends BaseTemplate {
  type: "project";
  settings: {
    color: string;
    default_view: ViewTypes["view"];
  };
  sections: ProjectTemplateSectionType[];
  tasks: ProjectTemplateTaskType[];
}

// New Channel template interface
export interface ChannelTemplate extends BaseTemplate {
  type: "channel";
  settings: {
    color: string;
    is_private: boolean;
    order?: number;
  };
  starter_threads?: ChannelTemplateThreadType[];
}

export interface ChannelTemplateThreadType {
  title: string;
  content: string;
  pinned?: boolean;
  order?: number;
}

export interface ProjectTemplateSectionType {
  id: string;
  name: string;
  order: number;
  color?: string;
}

export interface ProjectTemplateTaskType {
  id: string;
  title: string;
  description: JSONContent | null;
  priority: TaskPriority;
  status: TaskStatus | null;
  order: number;
  section_id: TaskType["section_id"];
  parent_task_id: TaskType["parent_task_id"];
  relative_dates?: {
    start_offset_days?: number;
    duration_days?: number;
    reminder_before_hours?: number;
  };
}

// Template category type
export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  templates: (PageTemplate | ProjectTemplate | ChannelTemplate)[];
}

// Supabase types for database tables
export interface TemplateTable {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  preview_image?: string;
  creator_id: string;
  type: "page" | "project" | "channel";
  settings:
    | PageTemplate["settings"]
    | ProjectTemplate["settings"]
    | ChannelTemplate["settings"];
  content?: JSONContent;
  sections?: ProjectTemplateSectionType[];
  starter_threads?: ChannelTemplateThreadType[];
  is_featured: boolean;
  category?: string;
  tags?: string[];
}

// Helper functions for handling dates
const templateDateUtils = {
  calculateActualDates(
    relativeDate: {
      start_offset_days?: number;
      duration_days?: number;
    },
    projectStartDate: string
  ) {
    const startDate = new Date(projectStartDate);
    if (relativeDate.start_offset_days) {
      startDate.setDate(startDate.getDate() + relativeDate.start_offset_days);
    }

    let endDate = null;
    if (relativeDate.duration_days) {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + relativeDate.duration_days);
    }

    return {
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate ? endDate.toISOString().split("T")[0] : null,
      start_time: null,
      end_time: null,
      reminder: null,
    };
  },
};

export const templateService = {
  async createPageTemplate(
    template: Omit<PageTemplate, "id" | "created_at" | "updated_at">
  ): Promise<string> {
    const { data, error } = await supabaseBrowser
      .from("templates")
      .insert({
        ...template,
        type: "page",
      })
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  },

  async createChannelTemplate(
    template: Omit<ChannelTemplate, "id" | "created_at" | "updated_at">
  ): Promise<string> {
    const { data, error } = await supabaseBrowser
      .from("templates")
      .insert({
        ...template,
        type: "channel",
      })
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  },

  async createProjectTemplate(
    template: Omit<ProjectTemplate, "id" | "created_at" | "updated_at">
  ): Promise<string> {
    console.log({ template });
    const { data, error } = await supabaseBrowser
      .from("templates")
      .insert({
        ...template,
        type: "project",
      })
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  },

  // Convert the project template to a project
  async createProjectFromTemplate(
    template: ProjectTemplate,
    params: {
      team_id: ProjectType["team_id"];
      workspace_id: WorkspaceType["id"];
      profile_id: ProjectType["profile_id"];
      projectsLength: number;
    }
  ): Promise<{
    project: ProjectType;
    member: PersonalMemberForProjectType;
  }> {
    try {
      const start_date = new Date().toISOString();

      // 1. Create project
      const { data: insertedProjectData, error: projectError } =
        await supabaseBrowser.rpc("insert_project_with_member", {
          _team_id: params.team_id,
          _profile_id: params.profile_id,
          _project_name: template.name,
          _project_slug: generateSlug(template.name),
          _project_color: template.settings.color,
          _view: template.settings.default_view,
          _selected_views: [],
          _is_favorite: false,
          _order: params.projectsLength + 1,
          _workspace_id: params.workspace_id,
        });

      if (projectError || !insertedProjectData) {
        console.error("Project creation failed:", projectError);
        throw projectError || new Error("Failed to create project");
      }

      // 2. Create sections and store the mapping
      const sectionIdMap = new Map<string, string>();

      if (template.sections && template.sections.length > 0) {
        const sectionData: Omit<SectionType, "id" | "updated_at">[] =
          template.sections.map((section) => ({
            name: section.name,
            order: section.order,
            color: section.color,
            project_id: insertedProjectData[0].project_id,
            profile_id: params.profile_id,
            is_archived: false,
            is_collapsed: false,
            is_inbox: false,
            workspace_id: params.workspace_id,
          }));

        const { data: insertedSections, error: sectionError } =
          await supabaseBrowser
            .from("sections")
            .insert(sectionData)
            .select("id, name, order");

        if (sectionError || !insertedSections) {
          console.error("Section creation failed:", sectionError);
          throw sectionError || new Error("Failed to create sections");
        }

        // Create section mapping
        template.sections.forEach((templateSection, index) => {
          const templateSectionId = String(templateSection.id);
          const newSectionId = insertedSections[index].id;
          sectionIdMap.set(templateSectionId, newSectionId);
        });
      }

      // 3. Create tasks with correct section IDs
      if (template.tasks && template.tasks.length > 0) {
        const taskData: Omit<TaskType, "id">[] = template.tasks.map((task) => {
          // Convert section_id to string for consistent comparison
          const templateSectionId = task.section_id
            ? String(task.section_id)
            : null;
          const mappedSectionId = templateSectionId
            ? sectionIdMap.get(templateSectionId)
            : null;

          const dates = templateDateUtils.calculateActualDates(
            task.relative_dates || {},
            start_date
          );

          return {
            project_id: insertedProjectData[0].project_id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            order: task.order,
            section_id: mappedSectionId || null, // Use the mapped section ID
            parent_task_id: null,
            dates,
            profile_id: params.profile_id,
            assignees: [],
            task_labels: [],
            is_completed: false,
            is_inbox: false,
            completed_at: null,
            workspace_id: params.workspace_id,
          };
        });

        const { data: insertedTasks, error: taskError } = await supabaseBrowser
          .from("tasks")
          .insert(taskData)
          .select("id, title, section_id, project_id");

        if (taskError || !insertedTasks) {
          console.error("Task creation failed:", taskError);
          throw taskError || new Error("Failed to create tasks");
        }
      }

      const projectResult: ProjectType = {
        id: insertedProjectData[0].project_id,
        name: template.name,
        slug: generateSlug(template.name),
        team_id: params.team_id,
        settings: {
          view: template.settings.default_view,
          selected_views: [],
          color: template.settings.color,
        },
        is_archived: false,
        profile_id: params.profile_id,
        updated_at: new Date().toISOString(),
        workspace_id: params.workspace_id,
      };

      const member: PersonalMemberForProjectType = {
        id: insertedProjectData[0].member_id,
        profile_id: params.profile_id,
        project_id: insertedProjectData[0].project_id,
        role: PersonalRoleType.ADMIN,
        settings: {
          is_favorite: false,
          order: params.projectsLength + 1,
        },
      };

      return { project: projectResult, member };
    } catch (error) {
      console.error("Template creation failed with error:", error);
      throw error;
    }
  },

  // Convert the page template to a page
  async createPageFromTemplate(
    template: PageTemplate,
    params: {
      workspace_id: WorkspaceType["id"];
      team_id: PageType["team_id"];
      profile_id: string;
      pagesLength: number;
    }
  ): Promise<{
    page: PageType;
    member: PersonalMemberForPageType;
  }> {
    try {
      const slug = generateSlug(template.name);
      const { data, error } = await supabaseBrowser.rpc(
        "insert_page_with_member",
        {
          _team_id: params.team_id || null,
          _profile_id: params.profile_id,
          _title: template.name,
          _slug: slug,
          _color: template.settings.color || "gray-500",
          _is_favorite: false,
          _order: params.pagesLength + 1,
          _workspace_id: params.workspace_id,
        }
      );

      if (error || !data) {
        console.error("Page creation failed:", error);
        throw error || new Error("Failed to create page");
      }

      const { data: updateData, error: updateError } = await supabaseBrowser
        .from("pages")
        .update({ content: template.content })
        .eq("id", data[0].page_id);

      const pageResult: PageType = {
        id: data[0].page_id,
        title: template.name,
        slug,
        team_id: params.team_id,
        settings: {
          order_in_team: params.pagesLength + 1,
          color: template.settings.color,
        },
        is_archived: false,
        profile_id: params.profile_id,
        content: template.content,
        workspace_id: params.workspace_id,
      };

      const member: PersonalMemberForPageType = {
        id: data[0].member_id,
        profile_id: params.profile_id,
        project_id: data[0].project_id,
        role: PersonalRoleType.ADMIN,
        settings: {
          is_favorite: false,
          order: params.pagesLength + 1,
        },
        page_id: data[0].page_id,
      };

      return { page: pageResult, member };
    } catch (error) {
      console.error("Template creation failed with error:", error);
      throw error;
    }
  },
};
