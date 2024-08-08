"use client";
import EktaLogo from "@/app/EktaLogo";
import LayoutWrapper from "@/components/LayoutWrapper";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import Spinner from "@/components/ui/Spinner";
import { useAuthProvider } from "@/context/AuthContext";
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
  const { setActiveProject, supabase } =
    useTaskProjectDataProvider();
  const { profile } = useAuthProvider();

  const [currentProject, setCurrentProject] = useState<ProjectType | null>(
    null
  );
  const [projectSections, setProjectSections] = useState<SectionType[]>([]);
  const [projectTasks, setProjectTasks] = useState<TaskType[]>([]);
  const [showShareOption, setShowShareOption] = useState<boolean>(false);

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
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", project_slug)
        .eq("profile_id", profile?.id)
        .single();

      if (!projectError) {
        setCurrentProject(projectData);
      }
    };

    fetchProject();
  }, [project_slug]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sectionData, error: sectionError } = await supabase
          .from("sections")
          .select("*")
          .eq("project_id", currentProject?.id);

        if (!sectionError) {
          setProjectSections(sectionData || []);
        }

        const { data: taskData, error: taskError } = await supabase
          .from("tasks")
          .select("*")
          .eq("project_id", currentProject?.id);

        if (!taskError) {
          setProjectTasks(taskData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      setActiveProject(null);
    };
  }, [supabase, currentProject?.id]);

  const updateProjectView = async (view: ViewTypes["view"]) => {
    await supabase
      .from("projects")
      .update({ view })
      .eq("id", currentProject?.id);
  };

  if (currentProject?.id) {
    return (
      <LayoutWrapper
        headline={currentProject.name}
        view={currentProject.view}
        setView={(value) => updateProjectView(value)}
        isProject
        showShareOption={showShareOption}
        setShowShareOption={setShowShareOption}
      >
        <TaskViewSwitcher
          project={currentProject}
          tasks={projectTasks}
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
      <div className="flex items-center justify-center border w-full h-screen">
        <div className="flex flex-col gap-8 items-center justify-center">
          <EktaLogo size="lg" />
          <Spinner />
        </div>
      </div>
    );
  }
};

export default ProjectDetails;
