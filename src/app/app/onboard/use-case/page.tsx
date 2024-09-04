"use client";
import React, { useState } from "react";
import OnboardWrapper from "../OnboardWrapper";
import { Button } from "@/components/ui/button";
import useCaseImage from "./use_case.png";
import { BriefcaseBusiness, Hash, LucideIcon, User } from "lucide-react";
import AnimatedCircleCheck from "@/components/TaskViewSwitcher/AnimatedCircleCheck";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useTemplates from "@/hooks/useTemplates";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { TemplateProjectType } from "@/types/template";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import Spinner from "@/components/ui/Spinner";
import { ProjectMemberType } from "@/types/team";
import { RoleType } from "@/types/role";

interface UseCase {
  id: number;
  title: string;
  icon: LucideIcon;
  templateProjectId: TemplateProjectType["id"];
}

const useCases: UseCase[] = [
  {
    id: 1,
    title: "Personal",
    icon: User,
    templateProjectId: 11,
  },
  {
    id: 2,
    title: "Work",
    icon: BriefcaseBusiness,
    templateProjectId: 10,
  },
  // {
  //   id: 3,
  //   title: "Education",
  //   icon: Lightbulb,
  // },
];

const Step2UseCase = () => {
  const [selectedUseCases, setSelectedUseCases] = useState<UseCase[]>([]);

  const router = useRouter();
  const { templateProjects, templateSsections, templateTasks } = useTemplates();
  const { profile } = useAuthProvider();
  const { projects, projectMembers } = useTaskProjectDataProvider();
  const [loading, setLoading] = useState(false);

  const handleUseCaseClick = (useCase: UseCase) => {
    if (selectedUseCases.includes(useCase)) {
      setSelectedUseCases(
        selectedUseCases.filter(
          (selectedUseCase) => selectedUseCase.id !== useCase.id
        )
      );
    } else {
      setSelectedUseCases([...selectedUseCases, useCase]);
    }
  };

  const handleSubmit = async () => {
    if (!profile || selectedUseCases.length === 0) return;

    setLoading(true);

    try {
      for (const useCase of selectedUseCases) {
        // Find the corresponding template project
        const templateProject = templateProjects.find(
          (project) => project.id === useCase.templateProjectId
        );

        if (!templateProject) continue;

        const newTemplateProject: Omit<ProjectType, "id"> = {
          name: templateProject.name,
          slug: templateProject.slug,
          team_id: null,
          profile_id: profile.id,
          is_archived: false,
          updated_at: new Date().toISOString(),
          settings: {
            color: templateProject.color,
            view: templateProject.view,
            selected_views: ["List"],
          },
        };

        // Insert new project based on the template
        const { data: newProject, error: projectError } = await supabaseBrowser
          .from("projects")
          .insert([newTemplateProject])
          .select()
          .single();

        // If there's an error inserting the project (e.g., slug conflict), log and skip
        if (projectError) {
          console.error("Error creating project:", projectError);
          // If the error is related to unique constraint (e.g., slug conflict), skip to the next use case
          if (projectError.code === "23505") {
            // Assuming 23505 is the unique constraint violation code
            console.log(
              `Project with slug "${templateProject.slug}" already exists. Skipping...`
            );
            continue;
          } else {
            // Handle other types of errors if necessary
            continue;
          }
        }

        if (newProject.id) {
          // Determine the new project's order
          const maxOrder = Math.max(
            ...projectMembers.map((s) => s.project_settings.order),
            0
          );
          const newOrder = maxOrder + 1;

          const projectMemberData: Omit<ProjectMemberType, "id"> = {
            profile_id: profile.id,
            project_id: newProject.id,
            role: RoleType.ADMIN,
            project_settings: {
              is_favorite: false,
              order: newOrder,
            },
          };
          const { data, error: userSettingsError } = await supabaseBrowser
            .from("project_members")
            .insert([projectMemberData]);

          if (userSettingsError) {
            console.error(
              "Error creating user project settings:",
              userSettingsError
            );
          }
        }

        // Insert sections for the new project
        const relatedSections = templateSsections.filter(
          (section) => section.template_project_id === templateProject.id
        );

        for (const templateSection of relatedSections) {
          const newTemplateSection: Omit<SectionType, "id"> = {
            profile_id: profile.id,
            project_id: (newProject as ProjectType).id,
            name: templateSection.name,
            order: templateSection.order,
            is_collapsed: false,
            is_inbox: false,
            is_archived: false,
            updated_at: new Date().toISOString(),
          };

          const { data: newSection, error: sectionError } =
            await supabaseBrowser
              .from("sections")
              .insert([newTemplateSection])
              .select()
              .single();

          if (sectionError) {
            console.error("Error creating section:", sectionError);
            continue;
          }

          // Insert tasks for the new section
          const relatedTasks = templateTasks.filter(
            (task) => task.template_section_id === templateSection.id
          );

          for (const templateTask of relatedTasks) {
            const newTemplateTask: Omit<TaskType, "id"> = {
              project_id: (newProject as ProjectType).id,
              section_id: (newSection as SectionType).id,
              parent_task_id: templateTask.parent_template_task_id,
              assigned_to_id: null,
              title: templateTask.title,
              description: templateTask.description,
              priority: templateTask.priority,
              due_date: templateTask.due_date,
              reminder_time: templateTask.reminder_time,
              profile_id: profile.id,
              is_inbox: false,
              is_completed: false,
              completed_at: null,
              order: templateTask.order,
            };

            const { error: taskError } = await supabaseBrowser
              .from("tasks")
              .insert([newTemplateTask]);

            if (taskError) {
              console.error("Error creating task:", taskError);
            }
          }
        }
      }

      // Update profile that is being onboarded
      const { error } = await supabaseBrowser
        .from("profiles")
        .update({
          is_onboarded: true,
        })
        .eq("id", profile.id);

      if (error) {
        throw error;
      }

      // Redirect or update UI as needed
      router.push("/app");
    } catch (error) {
      console.error("Unexpected error:", error);
      setLoading(false);
    } finally {
    }
  };

  return (
    <OnboardWrapper
      leftSide={
        <>
          <div className="space-y-3 text-center">
            <h1 className="text-xl font-bold text-text-900">
              How do you plan to use Kakrola?
            </h1>
            <p className="text-text-500">Choose all that apply.</p>
          </div>
          <div>
            <ul className="space-y-2">
              {useCases.map((useCase) => (
                <li
                  key={useCase.id}
                  tabIndex={0}
                  className={`flex items-center justify-between cursor-pointer h-12 rounded-full px-4 border ${
                    selectedUseCases.includes(useCase)
                      ? "border-primary-500"
                      : "border-text-200"
                  } focus:outline-none hover:bg-text-50`}
                  onClick={() => handleUseCaseClick(useCase)}
                >
                  <div className="flex items-center gap-2">
                    <useCase.icon
                      strokeWidth={1.5}
                      size={20}
                      className="text-primary-500"
                    />
                    <span className="text-text-700 font-semibold">
                      {useCase.title}
                    </span>
                  </div>
                  <div>
                    <AnimatedCircleCheck
                      handleCheckSubmit={() => {}}
                      priority={"P3"}
                      is_completed={selectedUseCases.includes(useCase)}
                      playSound={false}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!selectedUseCases.length || loading}
              rightContent={
                <div className="bg-background text-primary-500 rounded-full w-8 h-8 flex items-center justify-center">
                  <Hash className="w-5 h-5" />
                </div>
              }
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner color="white" /> <span>Launching...</span>
                </div>
              ) : (
                "Launch Kakrola"
              )}
            </Button>
          </div>
        </>
      }
      rightSide={
        <Image
          src={useCaseImage}
          width={300}
          height={300}
          alt="Use Case"
          className="object-cover"
        />
      }
      useWithTeam={false}
      currentStep={2}
    />
  );
};

export default Step2UseCase;
