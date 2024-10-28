import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { WorkspaceRoleType } from "@/types/role";
import { ProfileType } from "@/types/user";
import { WorkspaceType, WorkspaceMemberType } from "@/types/workspace";
import { supabaseBrowser } from "@/utils/supabase/client";

export const createNewWorkspace = async ({
  workspaceData,
  profile,
}: {
  workspaceData: Omit<WorkspaceType, "id" | "created_at" | "updated_at">;
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
      workspace_role: WorkspaceRoleType.WORKSPACE_ADMIN,
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

export const fetchWorkspaces = async (
  profile_id?: ProfileType["id"]
): Promise<
  | {
      workspace_member: {
        id: any;
        workspace_role: any;
        profile_id: any;
      };
      workspace: {
        id: any;
        name: any;
        avatar_url: any;
        is_archived: any;
        subscription: {
          id: any;
          product_id: any;
        } | null;
      };
    }[]
> => {
  try {
    if (!profile_id) throw new Error("No profile ID provided");
    const { data, error } = await supabaseBrowser
      .from("workspace_members")
      .select(
        "id, workspace_role, workspaces (id, name, avatar_url, is_archived, is_onboarded, subscriptions!subscriptions_workspace_id_fkey (id, product_id))"
      )
      .eq("profile_id", profile_id);

    if (error) throw error;

    const returnData = data.map((item) => {
      const { subscriptions, ...restWorkspace } = item.workspaces as any as {
        id: any;
        name: any;
        avatar_url: any;
        is_archived: any;
        subscriptions: {
          id: any;
          product_id: any;
        }[];
      };

      return {
        workspace_members: {
          id: item.id,
          workspace_role: item.workspace_role,
          profile_id,
        },
        workspace: {
          ...restWorkspace,
          subscription: subscriptions.length > 0 ? subscriptions[0] : null,
        },
      };
    });

    return returnData as any;
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return [];
  }
};
