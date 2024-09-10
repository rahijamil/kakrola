// Role and Permission structures
export enum RoleType {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  COMMENTER = "COMMENTER",
  VIEWER = "VIEWER",
}

export enum Permission {
  // Team Permissions
  CREATE_TEAM = "CREATE_TEAM", // Create new teams.
  EDIT_TEAM = "EDIT_TEAM", // Edit existing teams.
  DELETE_TEAM = "DELETE_TEAM", // Delete teams.
  INVITE_TEAM_MEMBER = "INVITE_TEAM_MEMBER", // Invite new members to a team.
  REMOVE_TEAM_MEMBER = "REMOVE_TEAM_MEMBER", // Remove members from a team.
  MANAGE_TEAM_ROLES = "MANAGE_TEAM_ROLES", // Manage roles within a team.
  VIEW_TEAM_DETAILS = "VIEW_TEAM_DETAILS", // View team details and information.

  // Project Permissions
  CREATE_PROJECT = "CREATE_PROJECT", // Create new projects.
  EDIT_PROJECT = "EDIT_PROJECT", // Edit existing projects.
  DELETE_PROJECT = "DELETE_PROJECT", // Delete projects.
  ARCHIVE_PROJECT = "ARCHIVE_PROJECT", // Archive projects.
  INVITE_PROJECT_MEMBER = "INVITE_PROJECT_MEMBER", // Invite new members to a project.
  REMOVE_PROJECT_MEMBER = "REMOVE_PROJECT_MEMBER", // Remove members from a project.
  MANAGE_PROJECT_ROLES = "MANAGE_PROJECT_ROLES", // Manage roles within a project.
  VIEW_PROJECT_DETAILS = "VIEW_PROJECT_DETAILS", // View project details and information.

  // Section Permissions
  CREATE_SECTION = "CREATE_SECTION", // Create new sections within a project.
  EDIT_SECTION = "EDIT_SECTION", // Edit existing sections.
  DELETE_SECTION = "DELETE_SECTION", // Delete sections.
  COLLAPSE_SECTION = "COLLAPSE_SECTION", // Collapse or expand sections.
  VIEW_SECTION_DETAILS = "VIEW_SECTION_DETAILS", // View section details and information.

  // Task Permissions
  CREATE_TASK = "CREATE_TASK", // Create new tasks.
  EDIT_TASK = "EDIT_TASK", // Edit existing tasks.
  DELETE_TASK = "DELETE_TASK", // Delete tasks.
  VIEW_TASK_DETAILS = "VIEW_TASK_DETAILS", // View task details and information.

  // Label Permissions
  CREATE_LABEL = "CREATE_LABEL", // Create new labels for categorizing tasks.
  EDIT_LABEL = "EDIT_LABEL", // Edit existing labels.
  DELETE_LABEL = "DELETE_LABEL", // Delete labels.
  ASSIGN_LABEL = "ASSIGN_LABEL", // Assign labels to tasks.
  VIEW_LABEL_DETAILS = "VIEW_LABEL_DETAILS", // View label details and information.

  // Comment Permissions (New)
  CREATE_COMMENT = "CREATE_COMMENT", // Create new comments on tasks.
  EDIT_COMMENT = "EDIT_COMMENT", // Edit existing comments.
  DELETE_COMMENT = "DELETE_COMMENT", // Delete comments.
  VIEW_COMMENTS = "VIEW_COMMENTS", // View all comments within the project.

  // Invite Management
  MANAGE_INVITES = "MANAGE_INVITES", // Manage invites for team or project membership.

  // Settings Management
  MANAGE_SETTINGS = "MANAGE_SETTINGS", // Manage application or project-specific settings.
}

export const rolePermissions: Record<RoleType, Permission[]> = {
  [RoleType.ADMIN]: [
    // Team Permissions
    Permission.CREATE_TEAM,
    Permission.EDIT_TEAM,
    Permission.DELETE_TEAM,
    Permission.INVITE_TEAM_MEMBER,
    Permission.REMOVE_TEAM_MEMBER,
    Permission.MANAGE_TEAM_ROLES,
    Permission.VIEW_TEAM_DETAILS,

    // Project Permissions
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.ARCHIVE_PROJECT,
    Permission.INVITE_PROJECT_MEMBER,
    Permission.REMOVE_PROJECT_MEMBER,
    Permission.MANAGE_PROJECT_ROLES,
    Permission.VIEW_PROJECT_DETAILS,

    // Section Permissions
    Permission.CREATE_SECTION,
    Permission.EDIT_SECTION,
    Permission.DELETE_SECTION,
    Permission.COLLAPSE_SECTION,
    Permission.VIEW_SECTION_DETAILS,

    // Task Permissions
    Permission.CREATE_TASK,
    Permission.EDIT_TASK,
    Permission.DELETE_TASK,
    Permission.VIEW_TASK_DETAILS,

    // Label Permissions
    Permission.CREATE_LABEL,
    Permission.EDIT_LABEL,
    Permission.DELETE_LABEL,
    Permission.ASSIGN_LABEL,
    Permission.VIEW_LABEL_DETAILS,

    // Comment Permissions
    Permission.CREATE_COMMENT,
    Permission.EDIT_COMMENT,
    Permission.DELETE_COMMENT,
    Permission.VIEW_COMMENTS,

    // General Permissions
    Permission.MANAGE_INVITES,
    Permission.MANAGE_SETTINGS,
  ],

  [RoleType.MEMBER]: [
    // Project Permissions
    Permission.VIEW_PROJECT_DETAILS,

    // Section Permissions
    Permission.VIEW_SECTION_DETAILS,

    // Task Permissions
    Permission.CREATE_TASK,
    Permission.EDIT_TASK,
    Permission.VIEW_TASK_DETAILS,

    // Label Permissions
    Permission.VIEW_LABEL_DETAILS,

    // Comment Permissions
    Permission.CREATE_COMMENT,
    Permission.EDIT_COMMENT,
    Permission.VIEW_COMMENTS,
  ],

  [RoleType.COMMENTER]: [
    // Comment Permissions
    Permission.CREATE_COMMENT,
    Permission.EDIT_COMMENT,
    Permission.VIEW_COMMENTS,
  ],

  [RoleType.VIEWER]: [
    // View Permissions
    Permission.VIEW_TEAM_DETAILS,
    Permission.VIEW_PROJECT_DETAILS,
    Permission.VIEW_SECTION_DETAILS,
    Permission.VIEW_TASK_DETAILS,
    Permission.VIEW_LABEL_DETAILS,
    Permission.VIEW_COMMENTS,
  ],
};
