import { WorkspaceRoleType } from "./role";
import { Subscription } from "./subscription";
import { ProfileType } from "./user";

export interface WorkspaceType {
  id: number;
  name: string;
  description: string;
  avatar_url: string | null;
  profile_id: ProfileType["id"];
  is_archived: boolean;
  updated_at: string;
  created_at?: string;
  subscription_id: Subscription["id"] | null;
}

// Team member type
export interface WorkspaceMemberType {
  id: number;
  workspace_id: WorkspaceType["id"];
  profile_id: ProfileType["id"]; // UUID
  email: string;
  workspace_role: WorkspaceRoleType;
  created_at?: string;
  settings: {};
}
