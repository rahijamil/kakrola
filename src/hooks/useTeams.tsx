import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useAuthProvider } from "@/context/AuthContext";
import { TeamMemberType, TeamType } from "@/types/team";
import useProjects from "./useProjects";
import { sortProjects } from "@/utils/sortProjects";

const useTeams = () => {
  const { profile } = useAuthProvider();
  const [teams, setTeams] = useState<TeamType[]>([]);
  const [teamMemberships, setTeamMemberships] = useState<TeamMemberType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { setProjects, setProjectMembers } = useProjects();

  useEffect(() => {
    const fetchTeamsAndProjects = async () => {
      if (!profile?.id) return;

      setLoading(true);

      try {
        const { data: membershipData, error: membershipError } =
          await supabaseBrowser
            .from("team_members")
            .select("*")
            .eq("profile_id", profile.id);

        if (membershipError) {
          console.error("Error fetching team memberships:", membershipError);
          return;
        }

        setTeamMemberships(membershipData || []);

        if (membershipData.length > 0) {
          const teamIds = membershipData.map(
            (membership) => membership.team_id
          );

          const { data: teamData, error: teamError } = await supabaseBrowser
            .from("teams")
            .select("*")
            .in("id", teamIds);

          if (teamError) {
            console.error("Error fetching teams:", teamError);
            return;
          }

          setTeams(teamData || []);

          const { data: teamProjectData, error: teamProjectError } =
            await supabaseBrowser
              .from("projects")
              .select("*")
              .in("team_id", teamIds);

          if (teamProjectError) {
            console.error("Error fetching team projects:", teamProjectError);
            return;
          }

          const projectIds = teamProjectData.map((project) => project.id);

          const { data: ProjectMembersData, error: settingsError } =
            await supabaseBrowser
              .from("project_members")
              .select("*")
              .in("project_id", projectIds);

          if (settingsError) {
            console.error(
              "Error fetching user project settings:",
              settingsError
            );
            return;
          }

          setProjectMembers((prev) => [...prev, ...(ProjectMembersData || [])]);
          setProjects((prev) =>
            sortProjects(
              [...prev, ...teamProjectData],
              ProjectMembersData || []
            )
          );
        }
      } catch (error) {
        console.error("Error fetching teams and projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndProjects();
  }, [profile?.id]);

  useEffect(() => {
    if (!profile?.id) return;

    // Subscribe to real-time changes for team memberships
    const teamMembershipsSubscription = supabaseBrowser
      .channel("team-memberships-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_members",
          filter: `profile_id=eq.${profile.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTeamMemberships((prev) => [
              ...prev,
              payload.new as TeamMemberType,
            ]);
            // Fetch and add the new team
            supabaseBrowser
              .from("teams")
              .select("*")
              .eq("id", payload.new.team_id)
              .single()
              .then(({ data, error }) => {
                if (!error && data) {
                  setTeams((prev) => [...prev, data]);
                }
              });
          } else if (payload.eventType === "UPDATE") {
            setTeamMemberships((prev) =>
              prev.map((membership) =>
                membership.id === payload.new.id
                  ? (payload.new as TeamMemberType)
                  : membership
              )
            );
          } else if (payload.eventType === "DELETE") {
            setTeamMemberships((prev) =>
              prev.filter((membership) => membership.id !== payload.old.id)
            );
            // Remove the team if it's no longer associated
            setTeams((prev) =>
              prev.filter((team) => team.id !== payload.old.team_id)
            );
          }
        }
      )
      .subscribe();

    // Subscribe to real-time changes for teams
    const teamsSubscription = supabaseBrowser
      .channel("teams-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setTeams((prev) =>
              prev.map((team) =>
                team.id === payload.new.id ? (payload.new as TeamType) : team
              )
            );
          }
          // Note: INSERT and DELETE are handled by team_members subscription
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(teamMembershipsSubscription);
      supabaseBrowser.removeChannel(teamsSubscription);
    };
  }, [profile?.id]);

  return { teams, setTeams, teamMemberships, loading };
};

export default useTeams;
