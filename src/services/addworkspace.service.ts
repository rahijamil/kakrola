import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { TeamRoleType, WorkspaceRoleType } from "@/types/role";
import { ProfileType } from "@/types/user";
import { WorkspaceType, WorkspaceMemberType } from "@/types/workspace";
import { supabaseBrowser } from "@/utils/supabase/client";

export const createNewWorkspace = async ({
  workspaceData,
  profile,
}: {
  workspaceData: Omit<WorkspaceType, "id" | "created_at">;
  profile: ProfileType;
}) => {
  // Create the team
  const { data, error: teamError } = await supabaseBrowser
    .from("workspaces")
    .insert(workspaceData)
    .select("id, name")
    .single();

  if (teamError) {
    throw teamError;
  }

  if (data && profile) {
    const teamMemberData: Omit<WorkspaceMemberType, "id"> = {
      workspace_id: data.id,
      profile_id: profile.id,
      workspace_role: WorkspaceRoleType.Workspace_ADMIN,
      email: profile.email,
      settings: {},
    };

    const { error: memberError } = await supabaseBrowser
      .from("workspace_members")
      .insert(teamMemberData);

    if (memberError) {
      throw memberError;
    }

    createActivityLog({
      actor_id: profile.id,
      action: ActivityAction.CREATED_TEAM,
      entity: {
        type: EntityType.TEAM,
        id: data.id,
        name: data.name,
      },
      metadata: {},
    });
  }

  return data;
};
