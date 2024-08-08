"use client";
import { ProjectType, SectionType } from "@/types/project";
import { TaskType } from "@/types/project";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
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

const TaskProjectDataContext = createContext<{
  supabase: SupabaseClient<any, "public", any>;
  // tasks: TaskType[];
  // setTasks: Dispatch<SetStateAction<TaskType[]>>;
  projects: ProjectType[];
  // setProjects: Dispatch<SetStateAction<ProjectType[]>>;
  // sections: SectionType[];
  // setSections: Dispatch<SetStateAction<SectionType[]>>;
  activeProject: ProjectType | null;
  setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
}>({
  supabase: createClient(),
  // tasks: [],
  // setTasks: (value) => value,
  projects: [],
  // setProjects: (value) => value,
  // sections: [],
  // setSections: (value) => value,
  activeProject: null,
  setActiveProject: (value) => value,
});

const TaskProjectDataProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const { profile } = useAuthProvider();
  // const [tasks, setTasks] = useState<TaskType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  // const [sections, setSections] = useState<SectionType[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("profile_id", profile?.id);

        if (!projectError) {
          setProjects(projectData || []);
        }

        // const { data: sectionData, error: sectionError } = await supabase
        //   .from("sections")
        //   .select("*")
        //   .eq("profile_id", profile?.id);

        // if (!sectionError) {
        //   setSections(sectionData || []);
        // }

        // const { data: taskData, error: taskError } = await supabase
        //   .from("tasks")
        //   .select("*")
        //   .eq("profile_id", profile?.id);

        // if (!taskError) {
        //   setTasks(taskData || []);
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [supabase, profile?.id]);

  return (
    <TaskProjectDataContext.Provider
      value={{
        supabase,
        // tasks,
        // setTasks,
        projects,
        // setProjects,
        // sections,
        // setSections,
        activeProject,
        setActiveProject,
      }}
    >
      {children}
    </TaskProjectDataContext.Provider>
  );
};

export const useTaskProjectDataProvider = () =>
  useContext(TaskProjectDataContext);

export default TaskProjectDataProvider;
