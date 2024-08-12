// Role and Permission structures
enum RoleType {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

enum Permission {
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

interface Role {
  id: number;
  name: RoleType;
  permissions: Permission[];
}

// Team type
export interface TeamType {
  id: number;
  name: string;
  industry: string;
  workType: string;
  role: string;
  organizationSize: string;
  avatar_url: string | null;
  profile_id: string;
  updated_at: string;
  created_at: string;
}

// Team member type
export interface TeamMemberType {
  id: number;
  team_id: number;
  profileId: string; // UUID
  role: Role;
  joinedAt: Date;
}
