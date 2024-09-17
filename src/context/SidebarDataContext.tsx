"use client";
import { ProjectType, SectionType } from "@/types/project";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { TeamType, TeamMemberType, ProjectMemberType } from "@/types/team";
import useTaskProjectData from "@/hooks/useTaskProjectData";
import { PageType } from "@/types/pageTypes";
import usePagesData from "@/hooks/usePagesData";

const SidebarDataContext = createContext<{
  projects: ProjectType[];
  setProjects: (projects: ProjectType[]) => void;

  pages: PageType[];
  setPages: (projects: PageType[]) => void;
  pagesLoading: boolean;

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
  setIsShowViewModal: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  projects: [],
  setProjects: () => {},
  sectionsForProjectSelector: [],
  projectsLoading: true,
  pages: [],
  setPages: () => {},
  pagesLoading: true,
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
  } = useTaskProjectData();

  const { pages, setPages, isLoading: pagesLoading } = usePagesData();

  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);
  const [isShowViewModal, setIsShowViewModal] = useState(false);

  return (
    <SidebarDataContext.Provider
      value={{
        projects,
        setProjects,
        sectionsForProjectSelector: sections,
        projectsLoading: isLoading,
        pages,
        setPages,
        pagesLoading,
        teams,
        setTeams,
        teamMemberships: [],
        activeProject,
        setActiveProject,
        projectMembers,
        setProjectMembers,
        isShowViewModal,
        setIsShowViewModal,
      }}
    >
      {children}
    </SidebarDataContext.Provider>
  );
};

export const useSidebarDataProvider = () => useContext(SidebarDataContext);

export default SidebarDataProvider;
