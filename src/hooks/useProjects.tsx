"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ProjectType, SectionType } from "@/types/project";
import { useAuthProvider } from "@/context/AuthContext";
import { sortProjects } from "@/utils/sortProjects";
import { ProjectMemberType } from "@/types/team";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileType } from "@/types/user";

const fetchProjectsAndDetails = async (_profile_id?: ProfileType["id"]) => {
  try {
    if (!_profile_id) throw new Error("No profile ID provided");

    const { data, error } = await supabaseBrowser.rpc(
      "fetch_projects_for_sidebar_with_members",
      { _profile_id }
    );

    if (error) {
      console.error("RPC Fetch Error:", error.message);
      throw new Error(`Error fetching data: ${error.message}`);
    }

    if (data) {
      const projects = (data.projects as ProjectType[]) || [];

      const deduplicatedProjects = Array.from(
        new Map(projects.map((project) => [project.id, project])).values()
      );

      const projectMembers =
        (data.project_members as ProjectMemberType[]) || [];
      const sections = ((data.sections as SectionType[]) || []).filter(
        (section: any) =>
          section.id !== null &&
          section.name !== null &&
          section.project_id !== null
      );

      return {
        projectMemberData: projectMembers,
        projects: sortProjects(deduplicatedProjects, projectMembers),
        sections,
      };
    } else {
      return { projectMemberData: [], projects: [], sections: [] };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return { projectMemberData: [], projects: [], sections: [] };
  }
};

const useProjects = () => {
  const { profile } = useAuthProvider();
  const [sectionsForProjectSelector, setSectionsForProjectSelector] = useState<
    {
      id: SectionType["id"];
      name: SectionType["name"];
      project_id: SectionType["project_id"];
    }[]
  >([]);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects", profile?.id],
    queryFn: () => fetchProjectsAndDetails(profile?.id),
    staleTime: 300000, // Adjust as needed
    refetchOnWindowFocus: false,
    enabled: !!profile?.id,
  });

  useEffect(() => {
    if (isError) {
      console.error("Error fetching data:", error);
    }
    if (data) {
      setSectionsForProjectSelector(data.sections);
    }

    return () => {
      setSectionsForProjectSelector([]);
    };
  }, [data, error, isError]);

  // useEffect(() => {
  //   if (!profile?.id) return;

  //   const subscription = supabaseBrowser
  //     .channel("projects-channel")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "projects",
  //         filter: `profile_id=eq.${profile.id}`,
  //       },
  //       (payload) => {
  //         queryClient.setQueryData(
  //           ["projects", profile.id],
  //           (oldProjects: ProjectType[] = []) => {
  //             const existingProjectMap = new Map<number, ProjectType>();
  //             oldProjects.forEach((p) => existingProjectMap.set(p.id, p));

  //             if (payload.eventType === "INSERT") {
  //               if (!existingProjectMap.has(payload.new.id)) {
  //                 existingProjectMap.set(
  //                   payload.new.id,
  //                   payload.new as ProjectType
  //                 );
  //               }
  //             } else if (payload.eventType === "UPDATE") {
  //               existingProjectMap.set(
  //                 payload.new.id,
  //                 payload.new as ProjectType
  //               );
  //             } else if (payload.eventType === "DELETE") {
  //               existingProjectMap.delete(payload.old.id);
  //             }

  //             return Array.from(existingProjectMap.values());
  //           }
  //         );
  //       }
  //     )
  //     .subscribe();

  //   const membersSubscription = supabaseBrowser
  //     .channel("project-members-channel")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "project_members",
  //         filter: `profile_id=eq.${profile.id}`,
  //       },
  //       (payload) => {
  //         queryClient.setQueryData(
  //           ["project_members", profile.id],
  //           (oldMembers: ProjectMemberType[] = []) => {
  //             const existingMemberMap = new Map<number, ProjectMemberType>();
  //             oldMembers.forEach((m) => existingMemberMap.set(m.id, m));

  //             if (payload.eventType === "INSERT") {
  //               existingMemberMap.set(
  //                 payload.new.id,
  //                 payload.new as ProjectMemberType
  //               );
  //             } else if (payload.eventType === "UPDATE") {
  //               existingMemberMap.set(
  //                 payload.new.id,
  //                 payload.new as ProjectMemberType
  //               );
  //             } else if (payload.eventType === "DELETE") {
  //               existingMemberMap.delete(payload.old.id);
  //             }

  //             return Array.from(existingMemberMap.values());
  //           }
  //         );
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabaseBrowser.removeChannel(subscription);
  //     supabaseBrowser.removeChannel(membersSubscription);
  //   };
  // }, [profile?.id, queryClient]);

  return {
    projects: data?.projects || [],
    setProjects: (newProjects: ProjectType[]) =>
      queryClient.setQueryData(
        ["projects", profile?.id],
        (oldData: {
          projectMemberData: ProjectMemberType[];
          projects: ProjectType[];
          sections: SectionType[];
        }) => ({
          ...oldData,
          projects: newProjects,
        })
      ),
    projectMembers: (data?.projectMemberData as ProjectMemberType[]) || [],
    setProjectMembers: (members: ProjectMemberType[]) =>
      queryClient.setQueryData(
        ["projects", profile?.id],
        (oldData: {
          projectMemberData: ProjectMemberType[];
          projects: ProjectType[];
          sections: SectionType[];
        }) => ({
          ...oldData,
          projectMemberData: members,
        })
      ),
    loading: isLoading,
    error: isError ? error : null,
    sectionsForProjectSelector,
  };
};

export default useProjects;
