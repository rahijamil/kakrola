"use client";
import KriyaLogo from "@/app/KriyaLogo";
import LayoutWrapper from "@/components/LayoutWrapper";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { useAuthProvider } from "@/context/AuthContext";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import { ViewTypes } from "@/types/viewTypes";
import { supabaseBrowser } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ProjectDetails = ({
  params: { project_slug },
}: {
  params: { project_slug: string };
}) => {
  const { profile } = useAuthProvider();

  const [currentProject, setCurrentProject] = useState<ProjectType | null>(
    null
  );
  const [projectSections, setProjectSections] = useState<SectionType[]>([]);
  const [projectTasks, setProjectTasks] = useState<TaskType[]>([]);
  const [showShareOption, setShowShareOption] = useState<boolean>(false);

  const [notFound, setNotFound] = useState<boolean>(false);

  const handleTaskUpdate = (updatedTask: TaskType) => {
    // setTasks((prevTasks) => {
    //   const newTasks = prevTasks.map((t) =>
    //     t.id === updatedTask.id ? updatedTask : t
    //   );
    //   return newTasks;
    // });
  };

  useEffect(() => {
    const fetchProject = async () => {
      const { data: projectData, error: projectError } = await supabaseBrowser
        .from("projects")
        .select("*")
        .eq("slug", project_slug)
        .eq("profile_id", profile?.id)
        .single();

      if (!projectError) {
        setCurrentProject(projectData);
      } else {
        setNotFound(true);
      }
    };

    fetchProject();

    return () => {
      setCurrentProject(null);
    };
  }, [project_slug, profile?.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentProject?.id) {
          const { data: sectionData, error: sectionError } =
            await supabaseBrowser
              .from("sections")
              .select("*")
              .eq("project_id", currentProject?.id);

          if (!sectionError) {
            setProjectSections(sectionData || []);
          }

          const { data: taskData, error: taskError } = await supabaseBrowser
            .from("tasks")
            .select("*")
            .eq("project_id", currentProject?.id);

          if (!taskError) {
            setProjectTasks(taskData || []);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Subscribe to real-time changes for projects
    const projectSubcription = supabaseBrowser
      .channel("projects-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `id=eq.${currentProject?.id}`,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" &&
            payload.new.profile_id === profile?.id
          ) {
            setCurrentProject(payload.new as ProjectType);
          } else if (payload.eventType === "UPDATE") {
            setCurrentProject(payload.new as ProjectType);
          } else if (payload.eventType === "DELETE") {
            setCurrentProject(null);
            setNotFound(true);
          }
        }
      )
      .subscribe();

    // Subscribe to real-time changes for sections
    const sectionsSubcription = supabaseBrowser
      .channel("sections-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sections",
          filter: `project_id=eq.${currentProject?.id}`,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" &&
            payload.new.project_id === currentProject?.id
          ) {
            setProjectSections((prevSections) => [
              ...prevSections,
              payload.new as SectionType,
            ]);
          } else if (payload.eventType === "UPDATE") {
            setProjectSections((prevSections) =>
              prevSections.map((s) =>
                s.id === payload.new.id ? (payload.new as SectionType) : s
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProjectSections((prevSections) =>
              prevSections.filter((s) => s.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Subscribe to real-time changes for tasks
    const tasksSubcription = supabaseBrowser
      .channel("sections-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${currentProject?.id}`,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" &&
            payload.new.project_id === currentProject?.id
          ) {
            setProjectTasks((prev) => [...prev, payload.new as TaskType]);
          } else if (payload.eventType === "UPDATE") {
            setProjectTasks((prev) =>
              prev.map((s) =>
                s.id === payload.new.id ? (payload.new as TaskType) : s
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProjectTasks((prev) =>
              prev.filter((s) => s.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(projectSubcription);
      supabaseBrowser.removeChannel(sectionsSubcription);
    };
  }, [currentProject?.id, profile?.id]);

  const updateProjectView = async (view: ViewTypes["view"]) => {
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
          alt="Today"
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
          onTaskUpdate={handleTaskUpdate}
          showShareOption={showShareOption}
          setShowShareOption={setShowShareOption}
        />

        {projectTasks.length == 0 && currentProject.view == "List" && (
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
      <div className="flex items-center justify-center w-full h-screen">
        <Spinner />
      </div>
    );
  }
};

export default ProjectDetails;
