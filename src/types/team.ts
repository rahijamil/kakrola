// Role and Permission structures
export enum RoleType {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum Permission {
  CREATE_TASK = "CREATE_TASK",
  EDIT_TASK = "EDIT_TASK",
  DELETE_TASK = "DELETE_TASK",
  ASSIGN_TASK = "ASSIGN_TASK",
  CREATE_PROJECT = "CREATE_PROJECT",
  EDIT_PROJECT = "EDIT_PROJECT",
  DELETE_PROJECT = "DELETE_PROJECT",
  INVITE_MEMBER = "INVITE_MEMBER",
  REMOVE_MEMBER = "REMOVE_MEMBER",
  MANAGE_ROLES = "MANAGE_ROLES",
}

export interface TeamRole {
  name: RoleType;
  permissions: Permission[];
}

export interface BaseTeamType {
  name: string;
  avatar_url: string | null;
  profile_id: string;
  updated_at: string;
  created_at: string;
}

// Team type
export interface TeamType extends BaseTeamType {
  id: number;
  industry: string;
  work_type: string;
  work_role: string;
  organization_size: string;
}

// Team member type
export interface TeamMemberType {
  id: number;
  team_id: number;
  profile_id: string; // UUID
  team_role: TeamRole;
  joined_at: string;
}
