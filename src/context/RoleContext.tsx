"use client";
import { RoleType } from "@/types/role";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const RoleContext = createContext<{
  role: (_project_id: ProjectType["id"]) => RoleType | null;
}>({
  role: (_project_id) => null,
});

import React from "react";
import { useSidebarDataProvider } from "./SidebarDataContext";
import { useAuthProvider } from "./AuthContext";
import { ProjectType } from "@/types/project";

const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { personalMembers, teamMembers } = useSidebarDataProvider();
  const { profile } = useAuthProvider();

  const role = useCallback(
    (_project_id: ProjectType["id"]) => {
      if (!profile) return null;

      const projectMember = personalMembers.find(
        (member) => member.project_id === _project_id
      );

      if (projectMember) {
        return projectMember.role;
      }

      const teamMember = teamMembers.find(
        (member) => member.profile_id === profile.id
      );

      if (teamMember) {
        return teamMember.team_role;
      }

      return null;
    },
    [profile, personalMembers, teamMembers]
  );

  return (
    <RoleContext.Provider value={{ role }}>{children}</RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);

export default RoleProvider;
