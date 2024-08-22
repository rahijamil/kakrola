import { useAuthProvider } from "@/context/AuthContext";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType } from "@/types/project";
import {
  TemplateProjectType,
  TemplateSectionType,
  TemplateTaskType,
} from "@/types/template";
import { supabaseBrowser } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

const SaveTemplateModal = ({
  onClose,
  project,
}: {
  onClose: () => void;
  project: ProjectType;
}) => {
  const { profile } = useAuthProvider();
  const { sections, tasks } = useTaskProjectDataProvider();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createTemplate = async () => {
      setIsSaving(true);
      setError(null);
      try {
        if (project && profile) {
          const templateProject: TemplateProjectType = {
            name: project.name,
            slug: project.slug,
            color: project.color,
            description: "", // You might want to add a description input in the modal
            preview_image: "", // You might want to add an image upload feature
            view: project.view,
            template_creator: {
              id: profile.id,
              name: profile.full_name,
              avatar_url: profile.avatar_url,
            },
          };

          const { data: templateProjectData, error: projectError } =
            await supabaseBrowser
              .from("template_projects")
              .insert(templateProject)
              .select()
              .single();

          if (projectError) throw projectError;

          if (templateProjectData && templateProjectData.id) {
            const projectSections = sections.filter(
              (section) => section.project_id === project.id
            );
            const projectTasks = tasks.filter(
              (task) => task.project_id === project.id
            );

            // Create a map to store the relation between original section IDs and new template section IDs
            const sectionIdMap = new Map<string | number, string | number>();

            // Insert template sections
            for (const section of projectSections) {
              const templateSection: TemplateSectionType = {
                template_project_id: templateProjectData.id,
                name: section.name,
                order: section.order,
              };

              const { data: templateSectionData, error: sectionError } =
                await supabaseBrowser
                  .from("template_sections")
                  .insert(templateSection)
                  .select()
                  .single();

              if (sectionError) throw sectionError;

              if (templateSectionData) {
                sectionIdMap.set(section.id, templateSectionData.id);
              }
            }

            // Create a map to store the relation between original task IDs and new template task IDs
            const taskIdMap = new Map<string | number, string | number>();

            // Insert template tasks
            for (const task of projectTasks) {
              const templateTask: TemplateTaskType = {
                template_project_id: templateProjectData.id,
                template_section_id: task.section_id
                  ? sectionIdMap.get(task.section_id) ?? null
                  : null,
                parent_template_task_id: null, // We'll update this in the next step
                title: task.title,
                description: task.description,
                priority: task.priority,
                due_date: task.due_date,
                reminder_time: task.reminder_time,
                order: task.order,
              };

              const { data: templateTaskData, error: taskError } =
                await supabaseBrowser
                  .from("template_tasks")
                  .insert(templateTask)
                  .select()
                  .single();

              if (taskError) throw taskError;

              if (templateTaskData) {
                taskIdMap.set(task.id, templateTaskData.id);
              }
            }

            // Update parent_template_task_id for tasks with parent tasks
            for (const task of projectTasks) {
              if (task.parent_task_id) {
                const templateTaskId = taskIdMap.get(task.id);
                const templateParentTaskId = taskIdMap.get(task.parent_task_id);

                if (templateTaskId && templateParentTaskId) {
                  await supabaseBrowser
                    .from("template_tasks")
                    .update({ parent_template_task_id: templateParentTaskId })
                    .eq("id", templateTaskId);
                }
              }
            }
          }
        }
        onClose();
      } catch (error) {
        console.error(error);
        setError("Failed to save template. Please try again.");
      } finally {
        setIsSaving(false);
      }
    };

    createTemplate();
  }, [project, profile, sections, tasks, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-20">
      <div className="bg-white p-4 rounded-lg overflow-hidden">
        <h2 className="font-bold text-base">Saving Template</h2>
        {isSaving ? (
          <p>Saving template...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <p>Template saved successfully!</p>
        )}
        <button onClick={onClose} disabled={isSaving}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SaveTemplateModal;
