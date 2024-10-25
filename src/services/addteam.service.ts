import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { TeamRoleType } from "@/types/role";
import { TeamMemberType, TeamType } from "@/types/team";
import { ProfileType } from "@/types/user";
import { supabaseBrowser } from "@/utils/supabase/client";

export const createTeam = async ({
  teamData,
  profile,
}: {
  teamData: Omit<TeamType, "id" | "created_at">;
  profile: ProfileType;
}) => {
  // Create the team
  const { data: createdTeamData, error: teamError } = await supabaseBrowser
    .from("teams")
    .insert(teamData)
    .select('id, name')
    .single();

  if (teamError) {
    throw teamError;
  }

  if (createdTeamData && profile) {
    const teamMemberData: Omit<TeamMemberType, "id"> = {
      team_id: createdTeamData.id,
      profile_id: profile.id,
      team_role: TeamRoleType.TEAM_ADMIN,
      email: profile.email,
      joined_at: new Date().toISOString(),
      settings: {
        projects: [],
        pages: [],
        channels: [],
      },
    };

    const { error: memberError } = await supabaseBrowser
      .from("team_members")
      .insert(teamMemberData);

    if (memberError) {
      throw memberError;
    }

    createActivityLog({
      actor_id: profile.id,
      action: ActivityAction.CREATED_TEAM,
      entity: {
        type: EntityType.TEAM,
        id: createdTeamData.id,
        name: createdTeamData.name,
      },
      metadata: {},
    });
  }

  return createdTeamData;
};
