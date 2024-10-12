import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSectionsAndTasksByProjectId } from "@/utils/fetchSectionsAndTasksByProjectId";
import { SectionType, TaskType } from "@/types/project";

const useProjectDetails = (projectId: number | null) => {
  const queryClient = useQueryClient();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["projectDetails", projectId],
    queryFn: () => {
      if (projectId === null) {
        return { sections: [], tasks: [] };
      }

      return fetchSectionsAndTasksByProjectId(projectId);
    },
    enabled: !!projectId, // Only run the query if projectId is not null
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false, // Optional: adjust as needed
  });

  const setSections = (sections: SectionType[]) => {
    queryClient.setQueryData(
      ["projectDetails", projectId],
      (oldData: { sections: SectionType[]; tasks: TaskType[] }) => ({
        ...oldData,
        sections,
      })
    );
  };

  const setTasks = (newTasks: TaskType[]) => {
    queryClient.setQueryData(
      ["projectDetails", projectId],
      (oldData: { sections: SectionType[]; tasks: TaskType[] } | undefined) => {
        if (!oldData) return { sections: [], tasks: newTasks };
        return {
          ...oldData,
          tasks: newTasks,
        };
      }
    );
  };

  return {
    sections: data?.sections,
    tasks: data?.tasks,
    setSections,
    setTasks,
    isLoading,
    error,
    isError,
  };
};

export default useProjectDetails;
