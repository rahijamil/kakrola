import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageType } from "@/types/pageTypes";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useAuthProvider } from "@/context/AuthContext";

const fetchPageDetails = async (
  pageId: string | number | null,
) => {
  if (!pageId) return { page: null };

  try {
    const { data, error } = await supabaseBrowser
      .from("pages")
      .select(
        "id, title, slug, content, team_id, profile_id, settings, is_archived"
      )
      .eq("id", pageId)
      .single();

    if (error) throw error;

    if (data) {
      return { page: data };
    } else {
      return { page: null };
    }
  } catch (error) {
    console.error(error);
    return { page: null };
  }
};

const usePageDetails = (pageId: string | number | null) => {
  const queryClient = useQueryClient();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["pageDetails", pageId],
    queryFn: () => {
      if (pageId === null) {
        return { page: null };
      }

      return fetchPageDetails(pageId);
    },
    enabled: !!pageId, // Only run the query if projectId is not null
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false, // Optional: adjust as needed
  });

  const setPage = (page: PageType) => {
    queryClient.setQueryData(
      ["pageDetails", pageId],
      (oldData: { page: PageType | null }) => ({
        ...oldData,
        page,
      })
    );
  };

  return {
    page: data?.page || null,
    setPage,
    isLoading,
    error,
    isError,
  };
};

export default usePageDetails;
