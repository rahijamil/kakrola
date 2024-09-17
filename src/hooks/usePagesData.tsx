import { useAuthProvider } from "@/context/AuthContext";
import { PageType } from "@/types/pageTypes";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

const fetchPageData = async (profileId?: string): Promise<PageType[]> => {
  try {
    if (!profileId) throw new Error("No profile ID provided");

    const { data, error } = await supabaseBrowser
      .from("pages")
      .select("id, team_id, profile_id, title, slug, is_archived, settings")
      .eq("profile_id", profileId);

    if (error) throw error;

    return (data as PageType[]) || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const usePagesData = () => {
  const { profile } = useAuthProvider();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sidebar_page_data", profile?.id],
    queryFn: () => fetchPageData(profile?.id),
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!profile?.id,
  });

  return {
    pages: data || [],
    setPages: (newPages: PageType[]) =>
      queryClient.setQueryData(["sidebar_page_data", profile?.id], newPages),
    isLoading
  };
};

export default usePagesData;
