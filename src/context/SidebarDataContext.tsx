"use client";
import { ProjectType, SectionType } from "@/types/project";
import React, { createContext, ReactNode, useContext, useState } from "react";
import {
  TeamType,
  TeamMemberType,
  PersonalMemberForProjectType,
  PersonalMemberForPageType,
} from "@/types/team";
import { PageType } from "@/types/pageTypes";
import useSidebarData from "@/hooks/useSidebarData";
import { ChannelType } from "@/types/channel";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

const SidebarDataContext = createContext<{
  projects: ProjectType[];
  setProjects: (projects: ProjectType[]) => void;

  pages: PageType[];
  setPages: (pages: PageType[]) => void;

  sectionsForProjectSelector: {
    id: SectionType["id"];
    name: SectionType["name"];
    project_id: SectionType["project_id"];
  }[];
  sidebarLoading: boolean;
  teams: TeamType[];
  setTeams: (teams: TeamType[]) => void;
  teamMembers: TeamMemberType[];
  setTeamMembers: (teamMembers: TeamMemberType[]) => void;
  activeProject: ProjectType | null;
  setActiveProject: React.Dispatch<React.SetStateAction<ProjectType | null>>;
  personalMembers: (PersonalMemberForProjectType | PersonalMemberForPageType)[];
  setPersonalMembers: (
    members: (PersonalMemberForProjectType | PersonalMemberForPageType)[]
  ) => void;
  isShowViewModal: boolean;
  setIsShowViewModal: React.Dispatch<React.SetStateAction<boolean>>;

  isError: boolean;
  channels: ChannelType[];
  setChannels: (channels: ChannelType[]) => void;
  refetchSidebarData: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>> | void;
}>({
  projects: [],
  setProjects: () => {},
  sectionsForProjectSelector: [],
  sidebarLoading: true,
  pages: [],
  setPages: () => {},
  teams: [],
  setTeams: () => {},
  teamMembers: [],
  setTeamMembers: () => {},
  activeProject: null,
  setActiveProject: () => {},
  personalMembers: [],
  setPersonalMembers: () => {},
  isShowViewModal: false,
  setIsShowViewModal: () => {},
  isError: false,
  channels: [],
  setChannels: () => {},
  refetchSidebarData: () => {},
});

const SidebarDataProvider = ({ children }: { children: ReactNode }) => {
  const {
    projects,
    setProjects,
    sections,
    teams,
    setTeams,
    personalMembers,
    setPersonalMembers,
    teamMembers,
    setTeamMembers,
    isLoading,
    isError,
    error,
    pages,
    setPages,
    channels,
    setChannels,
    refetchSidebarData,
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
        teamMembers,
        setTeamMembers,
        activeProject,
        setActiveProject,
        personalMembers,
        setPersonalMembers,
        isShowViewModal,
        setIsShowViewModal,
        isError,
        channels,
        setChannels,
        refetchSidebarData,
      }}
    >
      {children}
    </SidebarDataContext.Provider>
  );
};

export const useSidebarDataProvider = () => useContext(SidebarDataContext);

export default SidebarDataProvider;
