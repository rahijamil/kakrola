"use client";
import React, { useCallback, useEffect, useState } from "react";
import LayoutWrapper from "@/components/LayoutWrapper";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType } from "@/types/project";
import { ViewTypes } from "@/types/viewTypes";
import useProjectDetails from "@/hooks/useProjectDetails";
import Image from "next/image";
import Link from "next/link";
import { supabaseBrowser } from "@/utils/supabase/client";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useAuthProvider } from "@/context/AuthContext";

const ProjectDetails = ({
  params: { project_slug },
}: {
  params: { project_slug: string };
}) => {
  const { projects, setProjects, projectsLoading, setActiveProject } =
    useTaskProjectDataProvider();

  const [currentProject, setCurrentProject] = useState<ProjectType | null>(
    null
  );
  const [notFound, setNotFound] = useState<boolean>(false);
  const [showNoDateTasks, setShowNoDateTasks] = useState(false);

  const projectId = currentProject?.id || null;
  const { tasks, sections, setSections, setTasks, error, isPending, isError } =
    useProjectDetails(projectId);

  const { profile } = useAuthProvider();

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
    if (currentProject?.id) {
      document.title = `${currentProject.name} - Kakrola`;
    } else {
      document.title = "Kakrola";
    }
  }, [currentProject]);

  const updateProjectView = useCallback(
    async (view: ViewTypes["view"]) => {
      if (!profile?.id) return;

      if (!currentProject?.id) return;

      setProjects(
        projects.map((p) =>
          p.id === currentProject?.id
            ? { ...p, settings: { ...p.settings, view } }
            : p
        )
      );

      const { error } = await supabaseBrowser
        .from("projects")
        .update({ settings: { ...currentProject?.settings, view } })
        .eq("id", currentProject?.id);

      if (error) console.log(error);

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.UPDATED_PROJECT,
        entity_type: EntityType.PROJECT,
        entity_id: currentProject?.id,
        metadata: {
          old_data: {
            settings: currentProject?.settings,
          },
          new_data: {
            settings: { ...currentProject?.settings, view },
          },
        },
      });
    },
    [currentProject?.id, setProjects]
  );

  if (isPending) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching data:", error);
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p>Error loading project details</p>
      </div>
    );
  }

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
          <p className="text-sm text-text-600 pb-4">
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
        view={currentProject.settings.view}
        setView={updateProjectView}
        project={currentProject}
        setTasks={setTasks}
        tasks={tasks || []}
        showNoDateTasks={showNoDateTasks}
      >
        <TaskViewSwitcher
          project={currentProject}
          tasks={tasks || []}
          setTasks={setTasks}
          sections={sections || []}
          setSections={setSections}
          view={currentProject.settings.view}
          showNoDateTasks={showNoDateTasks}
          setShowNoDateTasks={setShowNoDateTasks}
        />

        {tasks?.length === 0 && currentProject.settings.view === "List" && (
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
              <p className="text-sm text-text-600">
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
