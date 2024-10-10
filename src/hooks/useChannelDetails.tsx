import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChannelType, ThreadType } from "@/types/channel";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useAuthProvider } from "@/context/AuthContext";
import { ProfileType } from "@/types/user";

interface ThreadWithProfile extends ThreadType {
  profiles: {
    id: ProfileType["id"];
    avatar_url: ProfileType["avatar_url"];
    full_name: ProfileType["full_name"];
    email: ProfileType["email"];
  };
}

const fetchChannelDetails = async (
  channel_slug: string,
  profile_id: string
) => {
  if (!channel_slug || !profile_id) return { channel: null };

  try {
    const { data, error } = await supabaseBrowser
      .from("channels")
      .select(
        `id, name, slug, description, team_id, settings,
        threads (
          id, title, slug, content, created_at, is_edited, 
            profiles (
              id, avatar_url, full_name, email
            )
        )`
      )
      .eq("slug", channel_slug)
      .eq("profile_id", profile_id)
      .single();

    if (error) throw error;

    if (data) {
      const { threads, ...dataWithoutThreads } = data;

      return {
        channel: { ...dataWithoutThreads, profile_id },
        threads,
      } as unknown as {
        channel: ChannelType;
        threads: ThreadWithProfile[];
      };
    } else {
      return { channel: null, threads: [] };
    }
  } catch (error) {
    console.error(error);
    return { channel: null };
  }
};

const useChannelDetails = (channel_slug: string) => {
  const { profile } = useAuthProvider();

  const queryClient = useQueryClient();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["channelDetails", channel_slug, profile?.id],
    queryFn: () => {
      if (channel_slug === null || !profile?.id) {
        return { channel: null, threads: [] };
      }

      return fetchChannelDetails(channel_slug, profile?.id);
    },
    enabled: !!channel_slug || !!profile?.id, // Only run the query if projectId is not null
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false, // Optional: adjust as needed
  });

  const setChannel = (channel: ChannelType) => {
    queryClient.setQueryData(
      ["channelDetails", channel_slug, profile?.id],
      (oldData: {
        channel: ChannelType | null;
        threads: ThreadType[] | null;
      }) => ({
        ...oldData,
        channel,
      })
    );
  };

  const setThreads = (threads: ThreadType[]) => {
    queryClient.setQueryData(
      ["channelDetails", channel_slug, profile?.id],
      (oldData: {
        channel: ChannelType | null;
        threads: ThreadType[] | null;
      }) => ({
        ...oldData,
        threads,
      })
    );
  };

  return {
    channel: data?.channel || null,
    setChannel,
    threads: data?.threads || [],
    setThreads,
    isLoading,
    error,
    isError,
  };
};

export default useChannelDetails;
