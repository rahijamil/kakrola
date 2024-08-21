"use client";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthProvider } from "./AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { TeamType, TeamMemberType } from "@/types/team";

const TaskProjectDataContext = createContext<{
  projects: ProjectType[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  projectsLoading: boolean;
  teams: TeamType[];
  setTeams: React.Dispatch<React.SetStateAction<TeamType[]>>;
  sections: SectionType[];
  setSections: React.Dispatch<React.SetStateAction<SectionType[]>>;
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  teamMemberships: TeamMemberType[];
  activeProject: ProjectType | null;
  setActiveProject: React.Dispatch<React.SetStateAction<ProjectType | null>>;
}>({
  projects: [],
  setProjects: () => {},
  projectsLoading: true,
  teams: [],
  setTeams: () => {},
  sections: [],
  setSections: () => {},
  tasks: [],
  setTasks: () => {},
  teamMemberships: [],
  activeProject: null,
  setActiveProject: () => {},
});

const sortProjects = (projects: ProjectType[]): ProjectType[] => {
  return [...projects].sort((a, b) => a.order - b.order);
};

const TaskProjectDataProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useAuthProvider();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(true);
  const [teams, setTeams] = useState<TeamType[]>([]);
  const [teamMemberships, setTeamMemberships] = useState<TeamMemberType[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return;

      try {
        // Fetch projects
        const { data: projectData, error: projectError } = await supabaseBrowser
          .from("projects")
          .select("*")
          .eq("profile_id", profile.id);

        if (projectError) {
          console.error("Error fetching projects:", projectError);
        } else {
          setProjects(sortProjects(projectData || []));
          setProjectsLoading(false);
        }

        // Fetch sections
        const { data: sectionData, error: sectionError } = await supabaseBrowser
          .from("sections")
          .select("*")
          .eq("profile_id", profile.id);

        if (sectionError) {
          console.error("Error fetching sections:", sectionError);
        } else {
          setSections(sectionData || []);
        }

        // Fetch tasks
        const { data: taskData, error: taskError } = await supabaseBrowser
          .from("tasks")
          .select("*")
          .eq("profile_id", profile.id);

        if (taskError) {
          console.error("Error fetching tasks:", taskError);
        } else {
          setTasks(taskData || []);
        }

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

    // Subscribe to real-time changes for projects, sections, and tasks
    const projectsSubscription = supabaseBrowser
      .channel("projects-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `profile_id=eq.${profile.id}`,
        },
        handleProjectChanges
      )
      .subscribe();

    const sectionsSubscription = supabaseBrowser
      .channel("sections-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sections",
          filter: `profile_id=eq.${profile.id}`,
        },
        handleSectionChanges
      )
      .subscribe();

    const tasksSubscription = supabaseBrowser
      .channel("tasks-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `profile_id=eq.${profile.id}`,
        },
        handleTaskChanges
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
      supabaseBrowser.removeChannel(sectionsSubscription);
      supabaseBrowser.removeChannel(tasksSubscription);

      supabaseBrowser.removeChannel(teamMembershipsSubscription);
      supabaseBrowser.removeChannel(teamsSubscription);
    };
  }, [profile?.id]);

  const handleProjectChanges = (payload: any) => {
    if (
      payload.eventType === "INSERT" &&
      payload.new.profile_id === profile?.id
    ) {
      setProjects((prev) =>
        sortProjects(
          prev.map((project) =>
            project.id == payload.new.id
              ? project
              : (payload.new as ProjectType)
          )
        )
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
        sortProjects(prev.filter((project) => project.id !== payload.old.id))
      );
    }
  };

  const handleSectionChanges = (payload: any) => {
    if (payload.eventType === "INSERT") {
      setSections((prev) => [...prev, payload.new as SectionType]);
    } else if (payload.eventType === "UPDATE") {
      setSections((prev) =>
        prev.map((section) =>
          section.id === payload.new.id ? (payload.new as SectionType) : section
        )
      );
    } else if (payload.eventType === "DELETE") {
      setSections((prev) =>
        prev.filter((section) => section.id !== payload.old.id)
      );
    }
  };

  const handleTaskChanges = (payload: any) => {
    if (payload.eventType === "INSERT") {
      setTasks((prev) => [...prev, payload.new as TaskType]);
    } else if (payload.eventType === "UPDATE") {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === payload.new.id ? (payload.new as TaskType) : task
        )
      );
    } else if (payload.eventType === "DELETE") {
      setTasks((prev) => prev.filter((task) => task.id !== payload.old.id));
    }
  };

  return (
    <TaskProjectDataContext.Provider
      value={{
        projects,
        setProjects,
        projectsLoading,
        teams,
        setTeams,
        sections,
        setSections,
        tasks,
        setTasks,
        teamMemberships,
        activeProject,
        setActiveProject,
      }}
    >
      {children}
    </TaskProjectDataContext.Provider>
  );
};

export const useTaskProjectDataProvider = () =>
  useContext(TaskProjectDataContext);

export default TaskProjectDataProvider;
