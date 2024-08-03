"use client";
import LayoutWrapper from "@/components/LayoutWrapper";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { SectionType, Task } from "@/types/project";
import { ViewTypes } from "@/types/viewTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ProjectDetails = ({
  params: { project_slug },
}: {
  params: { project_slug: string };
}) => {
  const { tasks, sections, projects, setActiveProject, setTasks } =
    useTaskProjectDataProvider();

  const [view, setView] = useState<ViewTypes["view"]>("Board");
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [projectSections, setProjectSections] = useState<SectionType[]>([]);
  const [showShareOption, setShowShareOption] = useState<boolean>(false);

  const handleTaskUpdate = (updatedTask: Task) => {
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
      setProjectTasks(tasks.filter((t) => t.project?.id === currentProject.id));
    }

    setProjectSections(
      sections.filter((section) => section.project.id == currentProject?.id)
    );

    return () => {
      setActiveProject(null);
    };
  }, [project_slug, projects, tasks, setActiveProject, sections]);

  return (
    <LayoutWrapper
      headline={project_slug}
      view={view}
      setView={setView}
      isProject
      showShareOption={showShareOption}
      setShowShareOption={setShowShareOption}
    >
      <TaskViewSwitcher
        tasks={projectTasks}
        sections={projectSections}
        view={view}
        onTaskUpdate={handleTaskUpdate}
        showShareOption={showShareOption}
        setShowShareOption={setShowShareOption}
      />

      {projectTasks.length == 0 && view == "List" && (
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
};

export default ProjectDetails;
