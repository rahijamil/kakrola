import { useEffect } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import useProjects from "./useProjects";
import { sortProjects } from "@/utils/sortProjects";
import { useAuthProvider } from "@/context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TeamType } from "@/types/team";

const emptyData = {
  teams: [],
  projectMembers: [],
  projects: [],
  teamMemberships: [],
};

// Fetch function for teams and project members
const fetchTeams = async (profile_id: string) => {
  if (!profile_id) return emptyData;

  try {
    // Fetch team memberships
    const { data: membershipData, error: membershipError } =
      await supabaseBrowser
        .from("team_members")
        .select("*")
        .eq("profile_id", profile_id);

    if (membershipError) {
      console.error("Error fetching team memberships:", membershipError);
      return emptyData;
    }

    // Fetch teams and projects if memberships exist
    if (membershipData.length > 0) {
      const teamIds = membershipData.map((membership) => membership.team_id);

      // Fetch teams
      const { data: teamData, error: teamError } = await supabaseBrowser
        .from("teams")
        .select("id, name, avatar_url")
        .in("id", teamIds);

      if (teamError) {
        console.error("Error fetching teams:", teamError);
        return emptyData;
      }

      // Fetch projects
      const { data: teamProjectData, error: teamProjectError } =
        await supabaseBrowser
          .from("projects")
          .select("*")
          .in("team_id", teamIds);

      if (teamProjectError) {
        console.error("Error fetching team projects:", teamProjectError);
        return emptyData;
      }

      const projectIds = teamProjectData.map((project) => project.id);

      // Fetch project members
      const { data: projectMembersData, error: settingsError } =
        await supabaseBrowser
          .from("project_members")
          .select("id, project_id, profile_id, project_settings")
          .in("project_id", projectIds);

      if (settingsError) {
        console.error("Error fetching project members:", settingsError);
        return emptyData;
      }

      return {
        teams: teamData || [],
        projectMembers: projectMembersData || [],
        projects: teamProjectData || [],
        teamMemberships: membershipData,
      };
    } else {
      return emptyData;
    }
  } catch (error) {
    console.error("Error fetching teams and projects:", error);
    return emptyData;
  }
};

const useTeams = () => {
  const { profile } = useAuthProvider();
  const queryClient = useQueryClient();
  const { setProjects, projects, projectMembers, setProjectMembers } =
    useProjects();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teams"],
    queryFn: () => (profile?.id ? fetchTeams(profile.id) : emptyData),
    staleTime: 60000, // Cache data for 1 minute
    refetchOnWindowFocus: false, // Disable refetching on window focus
  });

  useEffect(() => {
    if (data) {
      // Update projects and projectMembers
      setProjectMembers([...projectMembers, ...(data.projectMembers as any)]);
      setProjects(
        sortProjects(
          [...projects, ...data.projects],
          [...projectMembers, ...(data.projectMembers as any)]
        )
      );
    }
  }, [data, setProjects, setProjectMembers, projects]);

  return {
    teams: data?.teams as TeamType[] || [],
    setTeams: (teams: TeamType[]) =>
      queryClient.setQueryData(["teams", profile?.id], teams),
    teamMemberships: data?.teamMemberships || [],
    loading: isLoading,
    error: isError ? error : null,
  };
};

export default useTeams;
