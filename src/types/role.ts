// Types and Enums
export enum PersonalRoleType {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  COMMENTER = "COMMENTER",
  VIEWER = "VIEWER",
}

export enum TeamRoleType {
  TEAM_ADMIN = "TEAM_ADMIN",
  TEAM_MEMBER = "TEAM_MEMBER",
}

export enum WorkspaceRoleType {
  WORKSPACE_ADMIN = "WORKSPACE_ADMIN",
  WORKSPACE_MEMBER = "WORKSPACE_MEMBER",
}

enum ContentType {
  PROJECT = "PROJECT",
  PAGE = "PAGE",
  CHANNEL = "CHANNEL",
}

enum PermissionScope {
  PERSONAL = "PERSONAL",
  TEAM = "TEAM",
}

export enum PermissionName {
  // Personal scope permissions
  CREATE_PERSONAL_CONTENT = "CREATE_PERSONAL_CONTENT",
  EDIT_PERSONAL_CONTENT = "EDIT_PERSONAL_CONTENT",
  DELETE_PERSONAL_CONTENT = "DELETE_PERSONAL_CONTENT",
  INVITE_TO_PERSONAL_CONTENT = "INVITE_TO_PERSONAL_CONTENT",
  VIEW_PERSONAL_CONTENT = "VIEW_PERSONAL_CONTENT",
  COMMENT_ON_PERSONAL_CONTENT = "COMMENT_ON_PERSONAL_CONTENT",

  // Team scope permissions
  CREATE_TEAM_CONTENT = "CREATE_TEAM_CONTENT",
  EDIT_TEAM_CONTENT = "EDIT_TEAM_CONTENT",
  DELETE_TEAM_CONTENT = "DELETE_TEAM_CONTENT",
  INVITE_TO_TEAM = "INVITE_TO_TEAM",
  MANAGE_TEAM_MEMBERS = "MANAGE_TEAM_MEMBERS",
  VIEW_TEAM_CONTENT = "VIEW_TEAM_CONTENT",
  COMMENT_ON_TEAM_CONTENT = "COMMENT_ON_TEAM_CONTENT",
}

// Define role permissions
const personalRolePermissions: Record<PersonalRoleType, PermissionName[]> = {
  [PersonalRoleType.ADMIN]: [
    PermissionName.CREATE_PERSONAL_CONTENT,
    PermissionName.EDIT_PERSONAL_CONTENT,
    PermissionName.DELETE_PERSONAL_CONTENT,
    PermissionName.INVITE_TO_PERSONAL_CONTENT,
    PermissionName.VIEW_PERSONAL_CONTENT,
    PermissionName.COMMENT_ON_PERSONAL_CONTENT,
  ],
  [PersonalRoleType.MEMBER]: [
    PermissionName.EDIT_PERSONAL_CONTENT,
    PermissionName.VIEW_PERSONAL_CONTENT,
    PermissionName.COMMENT_ON_PERSONAL_CONTENT,
  ],
  [PersonalRoleType.COMMENTER]: [
    PermissionName.VIEW_PERSONAL_CONTENT,
    PermissionName.COMMENT_ON_PERSONAL_CONTENT,
  ],
  [PersonalRoleType.VIEWER]: [PermissionName.VIEW_PERSONAL_CONTENT],
};

const teamRolePermissions: Record<TeamRoleType, PermissionName[]> = {
  [TeamRoleType.TEAM_ADMIN]: [
    PermissionName.CREATE_TEAM_CONTENT,
    PermissionName.EDIT_TEAM_CONTENT,
    PermissionName.DELETE_TEAM_CONTENT,
    PermissionName.INVITE_TO_TEAM,
    PermissionName.MANAGE_TEAM_MEMBERS,
    PermissionName.VIEW_TEAM_CONTENT,
  ],
  [TeamRoleType.TEAM_MEMBER]: [
    PermissionName.CREATE_TEAM_CONTENT,
    PermissionName.EDIT_TEAM_CONTENT,
    PermissionName.VIEW_TEAM_CONTENT,
  ],
};

export function hasPermission(
  role: PersonalRoleType | TeamRoleType | null,
  permissionName: PermissionName
): boolean {
  if (Object.values(PersonalRoleType).includes(role as PersonalRoleType)) {
    return personalRolePermissions[role as PersonalRoleType].includes(
      permissionName
    );
  } else if (Object.values(TeamRoleType).includes(role as TeamRoleType)) {
    return teamRolePermissions[role as TeamRoleType].includes(permissionName);
  }
  return false;
}
