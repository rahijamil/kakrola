"use client";
import LayoutWrapper from "@/components/LayoutWrapper";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { Task } from "@/types/project";
import { ViewTypes } from "@/types/viewTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ProjectDetails = ({
  params: { project_slug },
}: {
  params: { project_slug: string };
}) => {
  const { tasks, projects, setActiveProject, setTasks } =
    useTaskProjectDataProvider();

  const [view, setView] = useState<ViewTypes["view"]>("List");
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [showShareOption, setShowShareOption] = useState<boolean>(false);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((t) =>
        t.id === updatedTask.id ? updatedTask : t
      );
      setProjectTasks(newTasks.filter((t) => t.project?.slug === project_slug));
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
  }, [project_slug, projects, tasks, setActiveProject]);

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
        view={view}
        onTaskUpdate={handleTaskUpdate}
        showShareOption={showShareOption}
        setShowShareOption={setShowShareOption}
      />

      {tasks.length == 0 && (
        <div className="flex items-center justify-center flex-col gap-4 h-[50vh] select-none">
          <Image
            src="/project.png"
            width={220}
            height={200}
            alt="Today"
            className="rounded-full object-cover"
            draggable={false}
          />
          <h3 className="font-bold text-xl">Start small (or dream big)...</h3>
          <p className="text-sm font-thin">
            Add your tasks or find a template to get started with your project.
          </p>
        </div>
      )}
    </LayoutWrapper>
  );
};

export default ProjectDetails;
