import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageType } from "@/types/pageTypes";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useAuthProvider } from "@/context/AuthContext";

const fetchPageDetails = async (page_slug: string, profile_id: string) => {
  if (!page_slug || !profile_id) return { page: null };

  try {
    const { data, error } = await supabaseBrowser
      .from("pages")
      .select(
        "id, title, slug, content, team_id, profile_id, settings, is_archived"
      )
      .eq("slug", page_slug)
      .eq("profile_id", profile_id)
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

const usePageDetails = (page_slug: string) => {
  const { profile } = useAuthProvider();

  const queryClient = useQueryClient();

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["pageDetails", page_slug, profile?.id],
    queryFn: () => {
      if (page_slug === null || !profile?.id) {
        return { page: null };
      }

      return fetchPageDetails(page_slug, profile?.id);
    },
    enabled: !!page_slug || !!profile?.id, // Only run the query if projectId is not null
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false, // Optional: adjust as needed
  });

  const setPage = (page: PageType) => {
    queryClient.setQueryData(
      ["pageDetails", page_slug, profile?.id],
      (oldData: { page: PageType | null }) => ({
        ...oldData,
        page,
      })
    );
  };

  return {
    page: data?.page || null,
    setPage,
    isPending,
    error,
    isError,
  };
};

export default usePageDetails;
