import React, { useState } from "react";
import { ProjectType, TaskType, SectionType } from "@/types/project";
import { ProjectTemplate, templateService } from "@/types/templateTypes";
import TemplateManager from "../TemplateManager";
import { generateSlug } from "@/utils/generateSlug";
import { useAuthProvider } from "@/context/AuthContext";
import { ProfileType } from "@/types/user";

// Updated template creation function to include required fields
export const createTemplateFromProject = (
  project: ProjectType,
  sections: SectionType[],
  tasks: TaskType[],
  creator_id?: ProfileType["id"]
): Omit<ProjectTemplate, "id" | "created_at" | "updated_at"> => {
  if (!creator_id) throw new Error("Creator not found");

  return {
    type: "project", // Add required type field
    name: project.name,
    slug: generateSlug(project.name),
    description: "",
    creator_id,
    settings: {
      color: project.settings.color,
      default_view: project.settings.view,
    },
    sections: sections
      .filter((section) => !section.is_archived)
      .map((section) => ({
        id: section.id.toString(),
        name: section.name,
        order: section.order,
        color: section.color,
      })),
    tasks: tasks
      .filter((task) => !task.is_completed)
      .map((task) => ({
        id: task.id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        order: task.order,
        parent_task_id: task.parent_task_id,
        section_id: task.section_id,
        relative_dates: task.dates
          ? {
              start_offset_days: calculateOffsetDays(
                project.created_at,
                task.dates.start_date
              ),
              duration_days: calculateDurationDays(
                task.dates.start_date,
                task.dates.end_date
              ),
              reminder_before_hours: task.dates.reminder
                ? parseInt(task.dates.reminder)
                : undefined,
            }
          : undefined,
      })),
  };
};

// Helper functions remain the same
const calculateOffsetDays = (
  projectStart: string | undefined,
  taskStart: string | null
): number | undefined => {
  if (!projectStart || !taskStart) return undefined;
  const start = new Date(projectStart);
  const taskDate = new Date(taskStart);
  const diffTime = Math.abs(taskDate.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateDurationDays = (
  startDate: string | null,
  endDate: string | null
): number | undefined => {
  if (!startDate || !endDate) return undefined;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Updated SaveAsTemplateModal component with proper type handling
export const SaveProjectAsTemplate: React.FC<{
  project: ProjectType;
  sections: SectionType[];
  tasks: TaskType[];
  onClose: () => void;
}> = ({ project, sections, tasks, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { profile } = useAuthProvider();

  const templateData = createTemplateFromProject(
    project,
    sections,
    tasks,
    profile?.id
  );

  const handleSave = async (data: ProjectTemplate) => {
    try {
      setIsLoading(true);
      setError(null);

      const fullTemplateData: Omit<
        ProjectTemplate,
        "id" | "created_at" | "updated_at"
      > = {
        ...data,
        type: "project" as const,
      };

      await templateService.createProjectTemplate(fullTemplateData);

      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create template"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TemplateManager<"project">
      initialData={templateData}
      templateType="project"
      onSave={handleSave}
      onCancel={onClose}
      // isLoading={isLoading}
      // error={error}
    />
  );
};
