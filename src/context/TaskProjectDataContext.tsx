"use client";
import { ProjectType, SectionType } from "@/types/project";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { TeamType, TeamMemberType, ProjectMemberType } from "@/types/team";
import useTaskProjectData from "@/hooks/useTaskProjectData";

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
  isShowViewModal: boolean;
  setIsShowViewModal: React.Dispatch<React.SetStateAction<boolean>>
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
  isShowViewModal: false,
  setIsShowViewModal: () => {},
});

const TaskProjectDataProvider = ({ children }: { children: ReactNode }) => {
  const {
    projects,
    setProjects,
    sections,
    teams,
    setTeams,
    projectMembers,
    setProjectMembers,
    teamMembers,
    isLoading,
    isError,
    error,
  } = useTaskProjectData();

  // const {
  //   projects,
  //   setProjects,
  //   projectMembers,
  //   setProjectMembers,
  //   loading: projectsLoading,
  //   sectionsForProjectSelector,
  // } = useProjects();

  // const { teams, setTeams, teamMemberships } = useTeams();

  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);
  const [isShowViewModal, setIsShowViewModal] = useState(false);

  return (
    <TaskProjectDataContext.Provider
      value={{
        projects,
        setProjects,
        sectionsForProjectSelector: sections,
        projectsLoading: isLoading,
        teams,
        setTeams,
        teamMemberships: [],
        activeProject,
        setActiveProject,
        projectMembers,
        setProjectMembers,
        isShowViewModal,
        setIsShowViewModal
      }}
    >
      {children}
    </TaskProjectDataContext.Provider>
  );
};

export const useTaskProjectDataProvider = () =>
  useContext(TaskProjectDataContext);

export default TaskProjectDataProvider;
