import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChannelType } from "@/types/channel";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useAuthProvider } from "@/context/AuthContext";

const fetchPageDetails = async (channel_slug: string, profile_id: string) => {
  if (!channel_slug || !profile_id) return { channel: null };

  try {
    const { data, error } = await supabaseBrowser
      .from("channels")
      .select(
        "id, name, slug, description, team_id, profile_id, settings"
      )
      .eq("slug", channel_slug)
      .eq("profile_id", profile_id)
      .single();

    if (error) throw error;

    if (data) {
      return { channel: data };
    } else {
      return { channel: null };
    }
  } catch (error) {
    console.error(error);
    return { channel: null };
  }
};

const useChannelDetails = (channel_slug: string) => {
  const { profile } = useAuthProvider();

  const queryClient = useQueryClient();

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["channelDetails", channel_slug, profile?.id],
    queryFn: () => {
      if (channel_slug === null || !profile?.id) {
        return { channel: null };
      }

      return fetchPageDetails(channel_slug, profile?.id);
    },
    enabled: !!channel_slug || !!profile?.id, // Only run the query if projectId is not null
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false, // Optional: adjust as needed
  });

  const setChannel = (channel: ChannelType) => {
    queryClient.setQueryData(
      ["channelDetails", channel_slug, profile?.id],
      (oldData: { channel: ChannelType | null }) => ({
        ...oldData,
        channel,
      })
    );
  };

  return {
    channel: data?.channel || null,
    setChannel,
    isPending,
    error,
    isError,
  };
};

export default useChannelDetails;
