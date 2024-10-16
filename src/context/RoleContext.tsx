"use client";
import {
  PermissionName,
  PersonalRoleType,
  TeamRoleType,
  hasPermission,
} from "@/types/role";
import { createContext, ReactNode, useCallback, useContext } from "react";

const RoleContext = createContext<{
  role: ({
    project,
    page,
    team_id,
  }: {
    project: ProjectType | null;
    page: PageType | null;
    team_id?: TeamType["id"];
  }) => PersonalRoleType | TeamRoleType | null;
  roleHasPermission: ({
    permissionName,
    project,
    page,
    team_id,
  }: {
    permissionName: PermissionName;
    project: ProjectType | null;
    page: PageType | null;
    team_id?: TeamType["id"];
  }) => boolean;
}>({
  role({ project, page, team_id }) {
    return null;
  },
  roleHasPermission: () => false,
});

import React from "react";
import { useSidebarDataProvider } from "./SidebarDataContext";
import { useAuthProvider } from "./AuthContext";
import { ProjectType } from "@/types/project";
import { PageType } from "@/types/pageTypes";
import { TeamType } from "@/types/team";

const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { personalMembers, teamMembers } = useSidebarDataProvider();
  const { profile } = useAuthProvider();

  const role = useCallback(
    ({
      project,
      page,
      team_id,
    }: {
      project: ProjectType | null;
      page: PageType | null;
      team_id?: TeamType["id"];
    }) => {
      if (!profile) return null;

      if (project?.team_id || page?.team_id || team_id) {
        const teamMember = teamMembers.find(
          (member) =>
            member.profile_id === profile.id &&
            member.team_id === (project?.team_id || page?.team_id || team_id)
        );
        if (teamMember) {
          return teamMember.team_role;
        }
      }

      if (project?.id) {
        const projectMember = personalMembers.find(
          (member) => member.project_id === project.id
        );
        if (projectMember) {
          return projectMember.role;
        }
      }

      if (page?.id) {
        const pageMember = personalMembers.find(
          (member) => member.page_id === page.id
        );
        if (pageMember) {
          return pageMember.role;
        }
      }

      return null;
    },
    [profile, personalMembers, teamMembers]
  );

  const roleHasPermission = useCallback(
    ({
      permissionName,
      project,
      page,
      team_id,
    }: {
      permissionName: PermissionName;
      project: ProjectType | null;
      page: PageType | null;
      team_id?: TeamType["id"];
    }) => {
      const currentRole = role({ project, page, team_id });
      return currentRole ? hasPermission(currentRole, permissionName) : false;
    },
    [role]
  );

  return (
    <RoleContext.Provider value={{ roleHasPermission, role }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);

export default RoleProvider;
