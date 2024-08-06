"use client";
import EktaLogo from "@/app/EktaLogo";
import LayoutWrapper from "@/components/LayoutWrapper";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import { ViewTypes } from "@/types/viewTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ProjectDetails = ({
  params: { project_slug },
}: {
  params: { project_slug: string };
}) => {
  const {
    tasks,
    sections,
    projects,
    setProjects,
    setActiveProject,
    activeProject,
    setTasks,
  } = useTaskProjectDataProvider();

  const [projectTasks, setProjectTasks] = useState<TaskType[]>([]);
  const [projectSections, setProjectSections] = useState<SectionType[]>([]);
  const [showShareOption, setShowShareOption] = useState<boolean>(false);

  const handleTaskUpdate = (updatedTask: TaskType) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((t) =>
        t.id === updatedTask.id ? updatedTask : t
      );
      return newTasks;
    });
  };

  useEffect(() => {
    const currentProject =
      projects.find((p) => p.slug === project_slug) || null;
    setActiveProject(currentProject);
    if (currentProject) {
      setProjectTasks(tasks.filter((t) => t.projectId === currentProject.id));
    }

    setProjectSections(
      sections.filter((section) => section.projectId == currentProject?.id)
    );

    return () => {
      setActiveProject(null);
    };
  }, [project_slug, projects, tasks, setActiveProject, sections]);

  if (activeProject) {
    return (
      <LayoutWrapper
        headline={activeProject.name}
        view={activeProject.view}
        setView={(value) =>
          setProjects((prev) =>
            prev.map((p) =>
              p.id == activeProject.id ? { ...p, view: value } : p
            )
          )
        }
        isProject
        showShareOption={showShareOption}
        setShowShareOption={setShowShareOption}
      >
        <TaskViewSwitcher
          tasks={projectTasks}
          sections={projectSections}
          view={activeProject.view}
          onTaskUpdate={handleTaskUpdate}
          showShareOption={showShareOption}
          setShowShareOption={setShowShareOption}
        />

        {projectTasks.length == 0 && activeProject.view == "List" && (
          <div className="flex items-center justify-center flex-col gap-1 h-[30vh] select-none">
            <Image
              src="/project.png"
              width={220}
              height={200}
              alt="Today"
              className="rounded-full object-cover"
              draggable={false}
            />

            <div className="text-center space-y-1 w-72">
              <h3 className="font-medium text-base">
                Start small (or dream big)...
              </h3>
              <p className="text-sm text-gray-600">
                Add your tasks or find a template to get started with your
                project.
              </p>
            </div>
          </div>
        )}
      </LayoutWrapper>
    );
  } else {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col gap-8 items-center justify-center">
          <EktaLogo size="lg" />
          <div className="w-6 h-6 rounded-full border-2 border-indigo-100 border-t-indigo-600 animate-spin"></div>
        </div>
      </div>
    );
  }
};

export default ProjectDetails;
