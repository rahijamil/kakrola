"use client";
import { ProjectType, SectionType } from "@/types/project";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { TeamType, TeamMemberType, ProjectMemberType } from "@/types/team";
import useProjects from "@/hooks/useProjects";
import useTeams from "@/hooks/useTeams";

const TaskProjectDataContext = createContext<{
  projects: ProjectType[];
  setProjects: (projects: ProjectType[]) => void;
  sectionsForProjectSelector: {
    id: SectionType["id"];
    name: SectionType["name"];
    project_id: SectionType["project_id"];
  }[];
  projectsLoading: boolean;
  teams: TeamType[];
  setTeams: (teams: TeamType[]) => void;
  teamMemberships: TeamMemberType[];
  activeProject: ProjectType | null;
  setActiveProject: React.Dispatch<React.SetStateAction<ProjectType | null>>;
  projectMembers: ProjectMemberType[];
  setProjectMembers: (members: ProjectMemberType[]) => void;
}>({
  projects: [],
  setProjects: () => {},
  sectionsForProjectSelector: [],
  projectsLoading: true,
  teams: [],
  setTeams: () => {},
  teamMemberships: [],
  activeProject: null,
  setActiveProject: () => {},
  projectMembers: [],
  setProjectMembers: () => {},
});

const TaskProjectDataProvider = ({ children }: { children: ReactNode }) => {
  const {
    projects,
    setProjects,
    projectMembers,
    setProjectMembers,
    loading: projectsLoading,
    sectionsForProjectSelector,
  } = useProjects();

  const { teams, setTeams, teamMemberships } = useTeams();

  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);

  return (
    <TaskProjectDataContext.Provider
      value={{
        projects,
        setProjects,
        sectionsForProjectSelector,
        projectsLoading,
        teams,
        setTeams,
        teamMemberships,
        activeProject,
        setActiveProject,
        projectMembers,
        setProjectMembers,
      }}
    >
      {children}
    </TaskProjectDataContext.Provider>
  );
};

export const useTaskProjectDataProvider = () =>
  useContext(TaskProjectDataContext);

export default TaskProjectDataProvider;
