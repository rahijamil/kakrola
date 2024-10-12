import { useAuthProvider } from "@/context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectType, SectionType } from "@/types/project";
import {
  PersonalMemberForPageType,
  PersonalMemberForProjectType,
  TeamMemberType,
  TeamType,
} from "@/types/team";
import { PageType } from "@/types/pageTypes";
import { ChannelType } from "@/types/channel";
import { fetchSidebarData } from "@/lib/queries";

export interface SidebarData {
  personal_members: PersonalMemberForProjectType[];
  projects: ProjectType[];
  sections: SectionType[];
  team_members: TeamMemberType[];
  teams: TeamType[];
  pages: PageType[];
  channels: ChannelType[];
}

const useSidebarData = () => {
  const { profile } = useAuthProvider();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["sidebar_data", profile?.id],
    queryFn: () => fetchSidebarData(profile?.id),
    staleTime: 1800000, // 30 minutes
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
            personal_members: [],
            projects: [],
            sections: [],
            team_members: [],
            teams: [],
            pages: [],
            channels: [],
          }
        ) => ({
          ...oldData,
          projects: newProjects,
        })
      ),
    personalMembers: data?.personal_members || [],
    setPersonalMembers: (
      members: (PersonalMemberForProjectType | PersonalMemberForPageType)[]
    ) =>
      queryClient.setQueryData(
        ["sidebar_data", profile?.id],
        (
          oldData: SidebarData = {
            personal_members: [],
            projects: [],
            sections: [],
            team_members: [],
            teams: [],
            pages: [],
            channels: [],
          }
        ) => ({
          ...oldData,
          personal_members: members,
        })
      ),
    sections: data?.sections || [],
    teams: data?.teams || [],
    setTeams: (teams: TeamType[]) =>
      queryClient.setQueryData(
        ["sidebar_data", profile?.id],
        (
          oldData: SidebarData = {
            personal_members: [],
            projects: [],
            sections: [],
            team_members: [],
            teams: [],
            pages: [],
            channels: [],
          }
        ) => ({
          ...oldData,
          teams,
        })
      ),
    teamMembers: data?.team_members || [],
    setTeamMembers: (members: TeamMemberType[]) =>
      queryClient.setQueryData(
        ["sidebar_data", profile?.id],
        (
          oldData: SidebarData = {
            personal_members: [],
            projects: [],
            sections: [],
            team_members: [],
            teams: [],
            pages: [],
            channels: [],
          }
        ) => ({
          ...oldData,
          team_members: members,
        })
      ),
    pages: data?.pages || [],
    setPages: (newPages: PageType[]) =>
      queryClient.setQueryData(
        ["sidebar_data", profile?.id],
        (
          oldData: SidebarData = {
            personal_members: [],
            projects: [],
            sections: [],
            team_members: [],
            teams: [],
            pages: [],
            channels: [],
          }
        ) => ({
          ...oldData,
          pages: newPages,
        })
      ),
    channels: data?.channels || [],
    isLoading,
    isError,
    error,
    refetchSidebarData: refetch,
  };
};

export default useSidebarData;
