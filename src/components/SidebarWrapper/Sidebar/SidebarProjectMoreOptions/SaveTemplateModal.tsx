import ColorSelector from "@/components/AddEditProject/ColorSelector";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import Textarea from "@/components/ui/textarea";
import { useAuthProvider } from "@/context/AuthContext";
import { ProjectType } from "@/types/project";
import {
  TemplateProjectType,
  TemplateSectionType,
  TemplateTaskType,
} from "@/types/template";
import { fetchSectionsAndTasksByProjectId } from "@/utils/fetchSectionsAndTasksByProjectId";
import { generateSlug } from "@/utils/generateSlug";
import { supabaseBrowser } from "@/utils/supabase/client";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const SaveTemplateModal = ({
  onClose,
  project,
}: {
  onClose: () => void;
  project: ProjectType;
}) => {
  const { profile } = useAuthProvider();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [savingStatus, setSavingStatus] = useState<string>("");

  const [templateData, setTemplateData] = useState<{
    color: string;
    description: string;
  }>({
    color: project.settings.color,
    description: "",
  });

  const createTemplate = async () => {
    if (!templateData.description.trim()) {
      setError("Template description is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      if (project && profile) {
        setSavingStatus("Saving project...");
        const templateProject: TemplateProjectType = {
          name: project.name,
          slug: generateSlug(project.name, true),
          description: templateData.description,
          preview_image: "", // You might want to add an image upload feature
          template_creator: {
            id: profile.id,
            name: profile.full_name,
            avatar_url: profile?.avatar_url || "/default_avatar.png",
          },
          settings: {
            color: templateData.color,
            view: project.settings.view,
          },
        };

        const { data: templateProjectData, error: projectError } =
          await supabaseBrowser
            .from("template_projects")
            .insert(templateProject)
            .select()
            .single();

        if (projectError) throw projectError;

        fetchSectionsAndTasksByProjectId(project.id).then(
          async ({ sections, tasks }) => {
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
              // Update status to saving sections
              setSavingStatus("Saving sections...");
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
              // Update status to saving tasks
              setSavingStatus("Saving tasks...");
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
                  order: task.order,
                  // dates: task.dates,
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
              setSavingStatus("Updating task hierarchy...");

              for (const task of projectTasks) {
                if (task.parent_task_id) {
                  const templateTaskId = taskIdMap.get(task.id);
                  const templateParentTaskId = taskIdMap.get(
                    task.parent_task_id
                  );

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
        );
      }
      onClose();
    } catch (error) {
      console.error(error);
      setError("Failed to save template. Please try again.");
    } finally {
      setIsSaving(false);
      setSavingStatus("");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-20"
      onClick={onClose}
    >
      <div
        className="rounded-lg overflow-hidden w-11/12 max-w-md bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 py-3">
          <h3 className="font-semibold text-[15px]">Save as template</h3>

          <button
            className="p-1 rounded-lg hover:bg-text-100 transition"
            onClick={onClose}
          >
            <X strokeWidth={1.5} size={20} />
          </button>
        </div>

        <div className="w-full h-full border-t border-text-100 p-3 px-5 pb-4 space-y-4 text-xs">
          <div className="flex items-center p-3">
            <span
              className={`text-5xl rounded-lg w-16 h-16 flex items-center justify-center bg-${
                templateData.color.split("-")[0]
              }-100 text-${templateData.color}`}
              style={{ fontFamily: "fantasy" }}
            >
              #
            </span>
          </div>

          <div>
            <ColorSelector
              value={templateData.color}
              onChange={(color) =>
                setTemplateData((prev) => ({ ...prev, color }))
              }
              height="h-10"
            />
          </div>

          <div className="h-[1px] bg-text-100"></div>

          <div>
            <Textarea
              label="About this template"
              placeholder="Add your description..."
              className="resize-none text-xs"
              rows={4}
              value={templateData.description}
              onChange={(e) =>
                setTemplateData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="h-[1px] bg-text-100"></div>

          <div className="space-y-2">
            <p className="font-semibold text-text-700">Template by</p>
            <div className="flex items-center gap-1">
              <Image
                src={profile?.avatar_url || "/default_avatar.png"}
                alt="avatar"
                width={20}
                height={20}
                className={"rounded-md max-w-5 max-h-5 object-cover"}
              />

              <p>{profile?.full_name}</p>
            </div>
          </div>

          <div className="h-[1px] bg-text-100"></div>

          <div className="space-y-2">
            {error && <p className="text-red-500">{error}</p>}
            {isSaving && <p className="text-primary-500">{savingStatus}</p>}
            <Button
              type="button"
              fullWidth
              disabled={isSaving}
              onClick={createTemplate}
            >
              {isSaving ? <Spinner color="white" /> : "Save template"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveTemplateModal;
