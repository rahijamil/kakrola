"use client";
import { ProjectType } from "@/types/project";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthProvider } from "./AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { TeamType, TeamMemberType } from "@/types/team";

const TaskProjectDataContext = createContext<{
  projects: ProjectType[];
  setProjects: Dispatch<SetStateAction<ProjectType[]>>;
  teams: TeamType[];
  setTeams: Dispatch<SetStateAction<TeamType[]>>;
  teamMemberships: TeamMemberType[];
}>({
  projects: [],
  setProjects: (value) => value,
  teams: [],
  setTeams: (value) => value,
  teamMemberships: [],
});

const sortProjects = (projects: ProjectType[]): ProjectType[] => {
  return [...projects].sort((a, b) => a.order - b.order);
};

const TaskProjectDataProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useAuthProvider();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [teams, setTeams] = useState<TeamType[]>([]);
  const [teamMemberships, setTeamMemberships] = useState<TeamMemberType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return;

      try {
        // Fetch projects
        const { data: projectData, error: projectError } = await supabaseBrowser
          .from("projects")
          .select("*")
          .eq("profile_id", profile.id);

        if (!projectError) {
          setProjects(sortProjects(projectData || []));
        }
        
        console.log(projectData, projectError)

        // Fetch team memberships
        const { data: membershipData, error: membershipError } =
          await supabaseBrowser
            .from("team_members")
            .select("*")
            .eq("profile_id", profile.id);

        if (!membershipError) {
          setTeamMemberships(membershipData || []);

          // Fetch teams based on memberships
          if (membershipData && membershipData.length > 0) {
            const teamIds = membershipData.map(
              (membership) => membership.team_id
            );
            const { data: teamData, error: teamError } = await supabaseBrowser
              .from("teams")
              .select("*")
              .in("id", teamIds);

            if (!teamError) {
              setTeams(teamData || []);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [profile?.id]);

  useEffect(() => {
    if (!profile?.id) return;

    // Subscribe to real-time changes for projects
    const projectsSubscription = supabaseBrowser
      .channel("projects-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `profile_id=eq.${profile.id}`,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" &&
            payload.new.profile_id === profile.id
          ) {
            setProjects((prev) =>
              prev.map((project) => project.id !== payload.new.id)
                ? sortProjects([...prev, payload.new as ProjectType])
                : prev
            );
          } else if (payload.eventType === "UPDATE") {
            setProjects((prev) =>
              sortProjects(
                prev.map((project) =>
                  project.id === payload.new.id
                    ? (payload.new as ProjectType)
                    : project
                )
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProjects((prev) =>
              sortProjects(
                prev.filter((project) => project.id !== payload.old.id)
              )
            );
          }
        }
      )
      .subscribe();

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
      supabaseBrowser.removeChannel(projectsSubscription);
      supabaseBrowser.removeChannel(teamMembershipsSubscription);
      supabaseBrowser.removeChannel(teamsSubscription);
    };
  }, [profile?.id]);

  return (
    <TaskProjectDataContext.Provider
      value={{
        projects,
        setProjects,
        teams,
        setTeams,
        teamMemberships,
      }}
    >
      {children}
    </TaskProjectDataContext.Provider>
  );
};

export const useTaskProjectDataProvider = () =>
  useContext(TaskProjectDataContext);

export default TaskProjectDataProvider;
