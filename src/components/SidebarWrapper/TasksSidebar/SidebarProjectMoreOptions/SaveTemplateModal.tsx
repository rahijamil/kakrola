import { useAuthProvider } from "@/context/AuthContext";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType } from "@/types/project";
import {
  TemplateProjectType,
  TemplateSectionType,
  TemplateTaskType,
} from "@/types/template";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ChartPieIcon } from "@heroicons/react/24/outline";
import {
  BriefcaseBusiness,
  Brush,
  GraduationCap,
  Headset,
  Kanban,
  LucideProps,
  Palette,
  Puzzle,
  SquareGanttChart,
  SquareKanban,
  SquareTerminal,
  Star,
  SwatchBook,
  Target,
  User,
  UserCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const categories: {
  id: number;
  name: string;
  path: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}[] = [
  {
    id: 1,
    name: "Featured",
    path: "/app/templates/category/featured",
    icon: SwatchBook,
  },
  {
    id: 2,
    name: "Setups",
    path: "/app/templates/category/setups",
    icon: SquareGanttChart,
  },
  {
    id: 3,
    name: "Popular",
    path: "/app/templates/category/setups",
    icon: Star,
  },
  {
    id: 4,
    name: "Work",
    path: "/app/templates/category/setups",
    icon: BriefcaseBusiness,
  },
  {
    id: 5,
    name: "Personal",
    path: "/app/templates/category/setups",
    icon: User,
  },
  {
    id: 6,
    name: "Education",
    path: "/app/templates/category/setups",
    icon: GraduationCap,
  },
  {
    id: 7,
    name: "Management",
    path: "/app/templates/category/setups",
    icon: Puzzle,
  },
  {
    id: 8,
    name: "Marketing & Sales",
    path: "/app/templates/category/setups",
    icon: ChartPieIcon,
  },
  {
    id: 9,
    name: "Development",
    path: "/app/templates/category/setups",
    icon: SquareTerminal,
  },
  {
    id: 10,
    name: "Design & Product",
    path: "/app/templates/category/setups",
    icon: Brush,
  },
  {
    id: 11,
    name: "Customer Support",
    path: "/app/templates/category/setups",
    icon: Headset,
  },
  {
    id: 12,
    name: "Creative",
    path: "/app/templates/category/setups",
    icon: Palette,
  },
  {
    id: 12,
    name: "Boards",
    path: "/app/templates/category/setups",
    icon: SquareKanban,
  },
  {
    id: 12,
    name: "2024 Goals",
    path: "/app/templates/category/setups",
    icon: Target,
  },
];

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

    // createTemplate();
  }, [project, profile, sections, tasks, onClose]);

  const pathname = usePathname();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-20"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-lg overflow-hidden flex w-11/12 max-w-4xl h-[90%] max-h-[44rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <aside className="w-56 bg-primary-50">
          <div className="p-4 py-3">
            <h3 className="font-semibold text-[15px]">Templates</h3>
          </div>

          <div>
            <div className="px-2">
              <ul>
                <li>
                  <Link
                    href={"item.path"}
                    className={`flex items-center p-2 rounded-lg transition-colors gap-2 ${
                      "item.path" === pathname
                        ? "bg-primary-100 text-primary-700"
                        : "hover:bg-primary-50 text-text-700"
                    }`}
                  >
                    <UserCircle strokeWidth={1.5} className="w-5 h-5" />
                    My templates
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-[13px] font-semibold px-4 py-2 mt-3">
              Categories
            </div>

            <div className="px-2">
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={category.path}
                      className={`flex items-center p-2 rounded-lg transition-colors gap-2 ${
                        category.path === pathname
                          ? "bg-primary-100 text-primary-700"
                          : "hover:bg-primary-50 text-text-700"
                      }`}
                    >
                      <category.icon strokeWidth={1.5} className="w-5 h-5" />
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between p-4 py-3 border-b border-text-50">
            <h3 className="font-semibold text-[15px]">My templates</h3>

            <button className="p-1 rounded-lg hover:bg-primary-50 transition" onClick={onClose}>
              <X strokeWidth={1.5} size={20} />
            </button>
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
};

export default SaveTemplateModal;
