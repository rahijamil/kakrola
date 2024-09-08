import { fetchAssigneeProfiles } from "@/lib/queries";
import { ProjectType } from "@/types/project";
import { useQuery } from "@tanstack/react-query";

const useAssignee = ({
  project_id,
}: {
  project_id?: ProjectType["id"] | null;
}) => {
  const { data: assigneeProfiles = [], isLoading: isProfilesLoading } =
    useQuery({
      queryKey: ["profiles", project_id],
      queryFn: () =>
        project_id ? fetchAssigneeProfiles(project_id) : Promise.resolve([]),
      enabled: !!project_id,
      staleTime: 1000 * 60 * 10, // 10 minutes
    });

  return {
    assigneeProfiles,
    isProfilesLoading,
  };
};

export default useAssignee;
