import { Permission, rolePermissions, RoleType } from "./role";

function hasPermission(role: RoleType, action: Permission): boolean {
  return rolePermissions[role].includes(action);
}

// Team Permissions
export function canCreateTeam(role: RoleType): boolean {
  return hasPermission(role, Permission.CREATE_TEAM);
}

export function canEditTeam(role: RoleType): boolean {
  return hasPermission(role, Permission.EDIT_TEAM);
}

export function canDeleteTeam(role: RoleType): boolean {
  return hasPermission(role, Permission.DELETE_TEAM);
}

export function canInviteTeamMember(role: RoleType): boolean {
  return hasPermission(role, Permission.INVITE_TEAM_MEMBER);
}

export function canRemoveTeamMember(role: RoleType): boolean {
  return hasPermission(role, Permission.REMOVE_TEAM_MEMBER);
}

export function canManageTeamRoles(role: RoleType): boolean {
  return hasPermission(role, Permission.MANAGE_TEAM_ROLES);
}

export function canViewTeamDetails(role: RoleType): boolean {
  return hasPermission(role, Permission.VIEW_TEAM_DETAILS);
}

// Project Permissions
export function canCreateProject(role: RoleType): boolean {
  return hasPermission(role, Permission.CREATE_PROJECT);
}

export function canEditProject(role: RoleType): boolean {
  return hasPermission(role, Permission.EDIT_PROJECT);
}

export function canDeleteProject(role: RoleType): boolean {
  return hasPermission(role, Permission.DELETE_PROJECT);
}

export function canArchiveProject(role: RoleType): boolean {
  return hasPermission(role, Permission.ARCHIVE_PROJECT);
}

export function canInviteProjectMember(role: RoleType): boolean {
  return hasPermission(role, Permission.INVITE_PROJECT_MEMBER);
}

export function canRemoveProjectMember(role: RoleType): boolean {
  return hasPermission(role, Permission.REMOVE_PROJECT_MEMBER);
}

export function canManageProjectRoles(role: RoleType): boolean {
  return hasPermission(role, Permission.MANAGE_PROJECT_ROLES);
}

export function canViewProjectDetails(role: RoleType): boolean {
  return hasPermission(role, Permission.VIEW_PROJECT_DETAILS);
}

// Section Permissions
export function canCreateSection(role: RoleType): boolean {
  return hasPermission(role, Permission.CREATE_SECTION);
}

export function canEditSection(role: RoleType): boolean {
  return hasPermission(role, Permission.EDIT_SECTION);
}

export function canDeleteSection(role: RoleType): boolean {
  return hasPermission(role, Permission.DELETE_SECTION);
}

export function canCollapseSection(role: RoleType): boolean {
  return hasPermission(role, Permission.COLLAPSE_SECTION);
}

export function canViewSectionDetails(role: RoleType): boolean {
  return hasPermission(role, Permission.VIEW_SECTION_DETAILS);
}

// Task Permissions
export function canCreateTask(role: RoleType): boolean {
  return hasPermission(role, Permission.CREATE_TASK);
}

export function canEditTask(role: RoleType): boolean {
  return hasPermission(role, Permission.EDIT_TASK);
}

export function canDeleteTask(role: RoleType): boolean {
  return hasPermission(role, Permission.DELETE_TASK);
}

export function canAssignTask(role: RoleType): boolean {
  return hasPermission(role, Permission.ASSIGN_TASK);
}

export function canCompleteTask(role: RoleType): boolean {
  return hasPermission(role, Permission.COMPLETE_TASK);
}

export function canViewTaskDetails(role: RoleType): boolean {
  return hasPermission(role, Permission.VIEW_TASK_DETAILS);
}

// Label Permissions
export function canCreateLabel(role: RoleType): boolean {
  return hasPermission(role, Permission.CREATE_LABEL);
}

export function canEditLabel(role: RoleType): boolean {
  return hasPermission(role, Permission.EDIT_LABEL);
}

export function canDeleteLabel(role: RoleType): boolean {
  return hasPermission(role, Permission.DELETE_LABEL);
}

export function canAssignLabel(role: RoleType): boolean {
  return hasPermission(role, Permission.ASSIGN_LABEL);
}

export function canViewLabelDetails(role: RoleType): boolean {
  return hasPermission(role, Permission.VIEW_LABEL_DETAILS);
}

// Invite Management
export function canManageInvites(role: RoleType): boolean {
  return hasPermission(role, Permission.MANAGE_INVITES);
}

// Settings Management
export function canManageSettings(role: RoleType): boolean {
  return hasPermission(role, Permission.MANAGE_SETTINGS);
}
