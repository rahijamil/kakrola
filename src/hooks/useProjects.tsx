import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ProjectType, SectionType } from "@/types/project";
import { useAuthProvider } from "@/context/AuthContext";
import { sortProjects } from "@/utils/sortProjects";
import { ProjectMemberType } from "@/types/team";

const useProjects = () => {
  const { profile } = useAuthProvider();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [projectMembers, setProjectMembers] = useState<ProjectMemberType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sectionsForProjectSelector, setSectionsForProjectSelector] = useState<
    {
      id: SectionType["id"];
      name: SectionType["name"];
      project_id: SectionType["project_id"];
    }[]
  >([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!profile?.id) return;
      setLoading(true);

      try {
        // Fetch projects where the user is a member
        const { data: projectMemberData, error: projectMemberError } =
          await supabaseBrowser
            .from("project_members")
            .select("*")
            .eq("profile_id", profile.id);

        if (projectMemberError) {
          console.error("Error fetching project members:", projectMemberError);
        } else {
          setProjectMembers(projectMemberData);

          const projectIds = projectMemberData.map(
            (membership) => membership.project_id
          );
          const { data: projectData, error: projectError } =
            await supabaseBrowser
              .from("projects")
              .select("*")
              .in("id", projectIds);

          if (projectError) {
            console.error("Error fetching projects:", projectError);
          } else {
            setProjects(
              sortProjects(
                projectData || [],
                projectMemberData as ProjectMemberType[]
              )
            );

            // Fetch sections for each project
            const { data: sectionData, error: sectionError } =
              await supabaseBrowser
                .from("sections")
                .select("*")
                .in("project_id", projectIds);

            if (sectionError) {
              console.error("Error fetching sections:", sectionError);
            } else {
              setSectionsForProjectSelector(sectionData || []);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [profile?.id]);

  useEffect(() => {
    if (!profile?.id) return;

    const subscription = supabaseBrowser
      .channel("projects-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `profile_id=eq.${profile.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const isExist = projects.some(
              (project) => project.id === payload.new.id
            );

            if (!isExist) {
              setProjects((prev) => [...prev, payload.new as ProjectType]);
            }
          } else if (payload.eventType === "UPDATE") {
            setProjects((prev) =>
              prev.map((project) =>
                project.id === payload.new.id
                  ? (payload.new as ProjectType)
                  : project
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProjects((prev) =>
              prev.filter((project) => project.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(subscription);
    };
  }, [profile?.id]);

  return {
    projects,
    setProjects,
    projectMembers,
    setProjectMembers,
    loading,
    sectionsForProjectSelector,
  };
};

export default useProjects;
