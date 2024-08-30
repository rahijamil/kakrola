"use client";
import { useEffect, useState } from "react";
import {
  TemplateProjectType,
  TemplateSectionType,
  TemplateTaskType,
} from "@/types/template";
import { supabaseBrowser } from "@/utils/supabase/client";

const useTemplates: () => {
  templateProjects: TemplateProjectType[];
  templateSsections: TemplateSectionType[];
  templateTasks: TemplateTaskType[];
  projectsLoading: boolean;
} = () => {
  const [templateProjects, setTemplateProjects] = useState<
    TemplateProjectType[]
  >([]);
  const [templateSsections, setTemplateSections] = useState<
    TemplateSectionType[]
  >([]);
  const [templateTasks, setTemplateTasks] = useState<TemplateTaskType[]>([]);
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
          setTemplateProjects(projects);

          const { data: sections, error: sectionsError } = await supabaseBrowser
            .from("template_sections")
            .select("*");

          if (sectionsError) {
            console.error("Error fetching sections:", sectionsError);
            return;
          }

          if (sections) {
            setTemplateSections(sections);
          }

          const { data: tasks } = await supabaseBrowser
            .from("template_tasks")
            .select("*");
          if (tasks) {
            setTemplateTasks(tasks);
          }

          setProjectsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return {
    templateProjects,
    templateSsections,
    templateTasks,
    projectsLoading,
  };
};

export default useTemplates;
