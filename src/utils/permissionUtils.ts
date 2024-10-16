import {
  hasPermission,
  PermissionName,
  PersonalRoleType,
  TeamRoleType,
} from "@/types/role";

// Helper functions for common permission checks
export function canCreateContent(
  role: PersonalRoleType | TeamRoleType | null,
  isTeamContent: boolean
): boolean {
  return hasPermission(
    role,
    isTeamContent
      ? PermissionName.CREATE_TEAM_CONTENT
      : PermissionName.CREATE_PERSONAL_CONTENT
  );
}

export function canEditContent(
  role: PersonalRoleType | TeamRoleType | null,
  isTeamContent: boolean
): boolean {
  return hasPermission(
    role,
    isTeamContent
      ? PermissionName.EDIT_TEAM_CONTENT
      : PermissionName.EDIT_PERSONAL_CONTENT
  );
}

export function canDeleteContent(
  role: PersonalRoleType | TeamRoleType | null,
  isTeamContent: boolean
): boolean {
  return hasPermission(
    role,
    isTeamContent
      ? PermissionName.DELETE_TEAM_CONTENT
      : PermissionName.DELETE_PERSONAL_CONTENT
  );
}

export function canInviteContent(
  role: PersonalRoleType | TeamRoleType | null,
  isTeamContent: boolean
): boolean {
  return hasPermission(
    role,
    isTeamContent
      ? PermissionName.INVITE_TO_TEAM
      : PermissionName.INVITE_TO_PERSONAL_CONTENT
  );
}

export function canViewContent(
  role: PersonalRoleType | TeamRoleType | null,
  isTeamContent: boolean
): boolean {
  return hasPermission(
    role,
    isTeamContent
      ? PermissionName.VIEW_TEAM_CONTENT
      : PermissionName.VIEW_PERSONAL_CONTENT
  );
}

export function canCommentOnContent(
  role: PersonalRoleType | TeamRoleType | null,
  isTeamContent: boolean
): boolean {
  return hasPermission(
    role,
    isTeamContent
      ? PermissionName.COMMENT_ON_TEAM_CONTENT
      : PermissionName.COMMENT_ON_PERSONAL_CONTENT
  );
}

export function canManageTeamMembers(role: TeamRoleType | null): boolean {
  return hasPermission(role, PermissionName.MANAGE_TEAM_MEMBERS);
}
