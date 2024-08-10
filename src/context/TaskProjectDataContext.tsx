"use client";
import { ProjectType } from "@/types/project";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthProvider } from "./AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";

const TaskProjectDataContext = createContext<{
  // tasks: TaskType[];
  // setTasks: Dispatch<SetStateAction<TaskType[]>>;
  projects: ProjectType[];
  setProjects: Dispatch<SetStateAction<ProjectType[]>>;
  // sections: SectionType[];
  // setSections: Dispatch<SetStateAction<SectionType[]>>;
}>({
  // tasks: [],
  // setTasks: (value) => value,
  projects: [],
  setProjects: (value) => value,
  // sections: [],
});

const sortProjects = (projects: ProjectType[]): ProjectType[] => {
  return [...projects].sort((a, b) => a.order - b.order);
};

const TaskProjectDataProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useAuthProvider();
  const [projects, setProjects] = useState<ProjectType[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projectData, error: projectError } = await supabaseBrowser
          .from("projects")
          .select("*")
          .eq("profile_id", profile?.id);

        if (!projectError) {
          setProjects(sortProjects(projectData || []));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [profile?.id]);

  useEffect(() => {
    // Subscribe to real-time changes for projects
    const projectsSubscription = supabaseBrowser
      .channel("projects-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `profile_id=eq.${profile?.id}`,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" &&
            payload.new.profile_id === profile?.id
          ) {
            setProjects((prev) =>
              sortProjects([...prev, payload.new as ProjectType])
            );
          } else if (payload.eventType === "UPDATE") {
            setProjects((prev) =>
              sortProjects(
                prev.map((project) =>
                  project.id === payload.new.id
                    ? (payload.new as ProjectType)
                    : project
                )
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProjects((prev) =>
              sortProjects(
                prev.filter((project) => project.id !== payload.old.id)
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(projectsSubscription);
    };
  }, [profile?.id]);

  return (
    <TaskProjectDataContext.Provider
      value={{
        // tasks,
        // setTasks,
        projects,
        setProjects,
        // sections,
        // setSections,
      }}
    >
      {children}
    </TaskProjectDataContext.Provider>
  );
};

export const useTaskProjectDataProvider = () =>
  useContext(TaskProjectDataContext);

export default TaskProjectDataProvider;
