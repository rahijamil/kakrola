"use client";
import { ProjectType, SectionType } from "@/types/project";
import { Task } from "@/types/project";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

const TaskProjectDataContext = createContext<{
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  projects: ProjectType[];
  setProjects: Dispatch<SetStateAction<ProjectType[]>>;
  sections: SectionType[];
  setSections: Dispatch<SetStateAction<SectionType[]>>;
  activeProject: ProjectType | null;
  setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
}>({
  tasks: [],
  setTasks: (value) => value,
  projects: [],
  setProjects: (value) => value,
  sections: [],
  setSections: (value) => value,
  activeProject: null,
  setActiveProject: (value) => value,
});

const TaskProjectDataProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load data from local storage
    const storedTasks = localStorage.getItem("tasks");
    const storedProjects = localStorage.getItem("projects");
    const storedSections = localStorage.getItem("sections");

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedProjects) setProjects(JSON.parse(storedProjects));
    if (storedSections) setSections(JSON.parse(storedSections));

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Save data to local storage only after initial load
    if (isLoaded) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      localStorage.setItem("projects", JSON.stringify(projects));
      localStorage.setItem("sections", JSON.stringify(sections));
    }
  }, [tasks, projects, sections, isLoaded]);

  return (
    <TaskProjectDataContext.Provider
      value={{
        tasks,
        setTasks,
        projects,
        setProjects,
        sections,
        setSections,
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
