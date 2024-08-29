"use client";
import {
  TemplateProjectType,
  TemplateSectionType,
  TemplateTaskType,
} from "@/types/template";
import { supabaseBrowser } from "@/utils/supabase/client";
import React, { createContext, ReactNode, useEffect, useState } from "react";

const TemplateContext = createContext<{
  projects: TemplateProjectType[];
  //   setProjects: React.Dispatch<React.SetStateAction<TemplateProjectType[]>>;
  projectsLoading: boolean;
  sections: TemplateSectionType[];
  //   setSections: React.Dispatch<React.SetStateAction<TemplateSectionType[]>>;
  tasks: TemplateTaskType[];
  //   setTasks: React.Dispatch<React.SetStateAction<TemplateTaskType[]>>;
}>({
  projects: [],
  //   setProjects: () => {},
  projectsLoading: true,
  sections: [],
  //   setSections: () => {},
  tasks: [],
  //   setTasks: () => {},
});

const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<TemplateProjectType[]>([]);
  const [sections, setSections] = useState<TemplateSectionType[]>([]);
  const [tasks, setTasks] = useState<TemplateTaskType[]>([]);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projects, error: projectsError } = await supabaseBrowser
          .from("template_projects")
          .select("*");

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
          return;
        }

        if (projects) {
          setProjects(projects);

          const { data: sections, error: sectionsError } = await supabaseBrowser
            .from("template_sections")
            .select("*");

          if (sectionsError) {
            console.error("Error fetching sections:", sectionsError);
            return;
          }

          if (sections) {
            setSections(sections);
          }

          const { data: tasks } = await supabaseBrowser
            .from("template_tasks")
            .select("*");
          if (tasks) {
            setTasks(tasks);
          }

          setProjectsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <TemplateContext.Provider
      value={{ projects, sections, tasks, projectsLoading }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplateProvider = () => {
  return React.useContext(TemplateContext);
};

export default TemplateProvider;
