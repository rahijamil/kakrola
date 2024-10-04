"use client";
import { RoleType } from "@/types/role";
import { createContext, ReactNode, useCallback, useContext } from "react";

const RoleContext = createContext<{
  role: ({
    _project_id,
    _page_id,
  }: {
    _project_id?: ProjectType["id"];
    _page_id?: PageType["id"];
  }) => RoleType | null;
}>({
  role: (_project_id) => null,
});

import React from "react";
import { useSidebarDataProvider } from "./SidebarDataContext";
import { useAuthProvider } from "./AuthContext";
import { ProjectType } from "@/types/project";
import { PageType } from "@/types/pageTypes";

const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { personalMembers, teamMembers } = useSidebarDataProvider();
  const { profile } = useAuthProvider();

  const role = useCallback(
    ({
      _project_id,
      _page_id,
    }: {
      _project_id?: ProjectType["id"];
      _page_id?: PageType["id"];
    }) => {
      if (!profile) return null;

      if (_project_id) {
        const projectMember = personalMembers.find(
          (member) => member.project_id === _project_id
        );

        if (projectMember) {
          return projectMember.role;
        }
      }

      if (_page_id) {
        const pageMember = personalMembers.find(
          (member) => member.page_id === _page_id
        );

        if (pageMember) {
          return pageMember.role;
        }
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
