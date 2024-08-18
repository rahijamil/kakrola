"use client";
import LayoutWrapper from "@/components/LayoutWrapper";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { useAuthProvider } from "@/context/AuthContext";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import { ViewTypes } from "@/types/viewTypes";
import { supabaseBrowser } from "@/utils/supabase/client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";

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
  } = useTaskProjectDataProvider();
  const { profile } = useAuthProvider();

  const [currentProject, setCurrentProject] = useState<ProjectType | null>(
    null
  );
  const [showShareOption, setShowShareOption] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

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

  const setProjectSections = (updatedSections: SectionType[]) => {
    setSections((prev) =>
      prev.map((section) =>
        section.project_id === currentProject?.id
          ? updatedSections.find((s) => s.id === section.id) || section
          : section
      )
    );
  };

  const setProjectTasks = (updatedTasks: TaskType[]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.project_id === currentProject?.id
          ? updatedTasks.find((t) => t.id === task.id) || task
          : task
      )
    );
  };

  useEffect(() => {
    if (projectsLoading) return;

    const project = projects.find((p) => p.slug === project_slug);

    if (project) {
      setCurrentProject(project);
    } else {
      setNotFound(true);
    }

    return () => {
      setCurrentProject(null);
    };
  }, [project_slug, profile?.id, projects, projectsLoading]);

  useEffect(() => {
    if (currentProject?.name) {
      document.title = `${currentProject.name} | Kriar`;
    }

    return () => {
      document.title = "Kriar";
    };
  }, [currentProject?.name]);

  const updateProjectView = async (view: ViewTypes["view"]) => {
    if (!currentProject?.id) return;

    setProjects((prev) =>
      prev.map((p) => (p.id === currentProject?.id ? { ...p, view } : p))
    );

    await supabaseBrowser
      .from("projects")
      .update({ view })
      .eq("id", currentProject?.id);
  };

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
      <>
        <Head>
          <title>{currentProject.name} | Kriar</title>
        </Head>
        <LayoutWrapper
          headline={currentProject.name}
          view={currentProject.view}
          setView={(value) => updateProjectView(value)}
          project={currentProject}
          showShareOption={showShareOption}
          setShowShareOption={setShowShareOption}
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
      </>
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
