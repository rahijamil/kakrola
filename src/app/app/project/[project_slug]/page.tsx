"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import LayoutWrapper from "@/components/LayoutWrapper";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import { ViewTypes } from "@/types/viewTypes";
import { supabaseBrowser } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";

const ProjectDetails = ({
  params: { project_slug },
}: {
  params: { project_slug: string };
}) => {
  const {
    projects,
    setProjects,
    projectsLoading,
    sections,
    setSections,
    tasks,
    setTasks,
    setActiveProject,
  } = useTaskProjectDataProvider();

  const [currentProject, setCurrentProject] = useState<ProjectType | null>(
    null
  );
  const [showShareOption, setShowShareOption] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [showNoDateTasks, setShowNoDateTasks] = useState(false);

  const projectSections = useMemo(() => {
    if (!currentProject) return [];
    return sections
      .filter((s) => s.project_id === currentProject.id)
      .sort((a, b) => a.order - b.order);
  }, [currentProject, sections]);

  const projectTasks = useMemo(() => {
    if (!currentProject) return [];
    return tasks
      .filter((t) => t.project_id === currentProject.id)
      .sort((a, b) => a.order - b.order);
  }, [currentProject, tasks]);

  const setProjectSections = useCallback(
    (updatedSections: SectionType[]) => {
      setSections((prev) => {
        const allSections = prev.filter(
          (s) => s.project_id !== currentProject?.id
        );

        return [...allSections, ...updatedSections];
      });
    },
    [currentProject?.id, setSections]
  );

  const setProjectTasks = useCallback(
    (updatedTasks: TaskType[]) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.project_id === currentProject?.id
            ? updatedTasks.find((t) => t.id === task.id) || task
            : task
        )
      );
    },
    [currentProject?.id, setTasks]
  );

  useEffect(() => {
    if (projectsLoading) return;

    const project = projects.find((p) => p.slug === project_slug);

    if (project) {
      setCurrentProject(project);
      setActiveProject(project);
      setNotFound(false);
    } else {
      setNotFound(true);
      setCurrentProject(null);
      setActiveProject(null);
    }

    return () => {
      setActiveProject(null);
      setCurrentProject(null);
      setNotFound(false);
    };
  }, [project_slug, projects, projectsLoading]);

  useEffect(() => {
    if (currentProject?.name) {
      document.title = `${currentProject.name} - Kakrola`;
    } else {
      document.title = "Kakrola";
    }
  }, [currentProject?.name]);

  const updateProjectView = useCallback(
    async (view: ViewTypes["view"]) => {
      if (!currentProject?.id) return;

      setProjects((prev) =>
        prev.map((p) => (p.id === currentProject?.id ? { ...p, view } : p))
      );

      const { error } = await supabaseBrowser
        .from("projects")
        .update({ view })
        .eq("id", currentProject?.id);

      if (error) console.log(error);
    },
    [currentProject?.id, setProjects]
  );

  if (notFound) {
    return (
      <div className="flex items-center justify-center flex-col gap-1 h-[70vh] select-none w-full">
        <Image
          src="/not_found.png"
          width={220}
          height={200}
          alt="Project not found"
          className="rounded-full object-cover"
          draggable={false}
        />

        <div className="text-center space-y-2 w-72">
          <h3 className="font-bold text-base">Project not found</h3>
          <p className="text-sm text-gray-600 pb-4">
            The project doesn&apos;t seem to exist or you don&apos;t have
            permission to access it.
          </p>
          <Link href="/app">
            <Button>Go back to home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (currentProject?.id) {
    return (
      <LayoutWrapper
        headline={currentProject.name}
        view={currentProject.view}
        setView={updateProjectView}
        project={currentProject}
        showShareOption={showShareOption}
        setShowShareOption={setShowShareOption}
        setTasks={setProjectTasks}
        tasks={projectTasks}
        showNoDateTasks={showNoDateTasks}
      >
        <TaskViewSwitcher
          project={currentProject}
          tasks={projectTasks}
          setTasks={setProjectTasks}
          sections={projectSections}
          setSections={setProjectSections}
          view={currentProject.view}
          showShareOption={showShareOption}
          setShowShareOption={setShowShareOption}
          showNoDateTasks={showNoDateTasks}
          setShowNoDateTasks={setShowNoDateTasks}
        />

        {projectTasks.length === 0 && currentProject.view === "List" && (
          <div className="flex items-center justify-center flex-col gap-1 h-[30vh] select-none">
            <Image
              src="/project.png"
              width={220}
              height={200}
              alt="Empty project"
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
      <div className="flex items-center justify-center w-full h-screen">
        <Spinner />
      </div>
    );
  }
};

export default ProjectDetails;
