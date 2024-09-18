"use client";
import { ProjectType, SectionType } from "@/types/project";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { TeamType, TeamMemberType, ProjectMemberType } from "@/types/team";
import { PageType } from "@/types/pageTypes";
import useSidebarData from "@/hooks/useSidebarData";

const SidebarDataContext = createContext<{
  projects: ProjectType[];
  setProjects: (projects: ProjectType[]) => void;

  pages: PageType[];
  setPages: (projects: PageType[]) => void;

  sectionsForProjectSelector: {
    id: SectionType["id"];
    name: SectionType["name"];
    project_id: SectionType["project_id"];
  }[];
  sidebarLoading: boolean;
  teams: TeamType[];
  setTeams: (teams: TeamType[]) => void;
  teamMemberships: TeamMemberType[];
  activeProject: ProjectType | null;
  setActiveProject: React.Dispatch<React.SetStateAction<ProjectType | null>>;
  projectMembers: ProjectMemberType[];
  setProjectMembers: (members: ProjectMemberType[]) => void;
  isShowViewModal: boolean;
  setIsShowViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  isError: boolean
}>({
  projects: [],
  setProjects: () => {},
  sectionsForProjectSelector: [],
  sidebarLoading: true,
  pages: [],
  setPages: () => {},
  teams: [],
  setTeams: () => {},
  teamMemberships: [],
  activeProject: null,
  setActiveProject: () => {},
  projectMembers: [],
  setProjectMembers: () => {},
  isShowViewModal: false,
  setIsShowViewModal: () => {},
  isError: false
});

const SidebarDataProvider = ({ children }: { children: ReactNode }) => {
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
    pages,
    setPages
  } = useSidebarData();

  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);
  const [isShowViewModal, setIsShowViewModal] = useState(false);

  return (
    <SidebarDataContext.Provider
      value={{
        projects,
        setProjects,
        sectionsForProjectSelector: sections,
        sidebarLoading: isLoading,
        pages,
        setPages,
        teams,
        setTeams,
        teamMemberships: [],
        activeProject,
        setActiveProject,
        projectMembers,
        setProjectMembers,
        isShowViewModal,
        setIsShowViewModal,
        isError,
      }}
    >
      {children}
    </SidebarDataContext.Provider>
  );
};

export const useSidebarDataProvider = () => useContext(SidebarDataContext);

export default SidebarDataProvider;
