import { useAuthProvider } from "@/context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ProjectType, SectionType } from "@/types/project";
import { ProjectMemberType, TeamMemberType, TeamType } from "@/types/team";

interface SidebarData {
  project_members: ProjectMemberType[];
  projects: ProjectType[];
  sections: SectionType[];
  team_members: TeamMemberType[];
  teams: TeamType[];
}

// Fetching merged data for projects, teams, and sections
const fetchProjectsAndTeams = async (profileId?: string) => {
  try {
    if (!profileId) throw new Error("No profile ID provided");

    const { data, error } = await supabaseBrowser.rpc(
      "fetch_projects_and_teams_for_sidebar",
      { _profile_id: profileId }
    );

    if (error) {
      console.error("RPC Fetch Error:", error.message);
      throw new Error(`Error fetching data: ${error.message}`);
    }

    return data || {};
  } catch (error) {
    console.error("Error fetching data:", error);
    return {};
  }
};

const useTaskProjectData = () => {
  const { profile } = useAuthProvider();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sidebar_data", profile?.id],
    queryFn: () => fetchProjectsAndTeams(profile?.id),
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!profile?.id,
  });

  return {
    projects: data?.projects || [],
    setProjects: (newProjects: ProjectType[]) =>
      queryClient.setQueryData(
        ["sidebar_data", profile?.id],
        (
          oldData: SidebarData = {
            project_members: [],
            projects: [],
            sections: [],
            team_members: [],
            teams: [],
          }
        ) => ({
          ...oldData,
          projects: newProjects,
        })
      ),
    projectMembers: data?.project_members || [],
    setProjectMembers: (members: ProjectMemberType[]) =>
      queryClient.setQueryData(
        ["sidebar_data", profile?.id],
        (
          oldData: SidebarData = {
            project_members: [],
            projects: [],
            sections: [],
            team_members: [],
            teams: [],
          }
        ) => ({
          ...oldData,
          project_members: members,
        })
      ),
    sections: data?.sections || [],
    teams: data?.teams || [],
    setTeams: (teams: TeamType[]) =>
      queryClient.setQueryData(["sidebar_data", profile?.id], teams),
    teamMembers: data?.team_members || [],
    isLoading,
    isError,
    error,
  };
};

export default useTaskProjectData;
