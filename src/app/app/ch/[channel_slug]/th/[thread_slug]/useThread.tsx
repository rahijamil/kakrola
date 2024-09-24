import { ThreadReplyType, ThreadType } from "@/types/channel";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

const getThread = async (
  channel_id?: number,
  thread_slug?: string
): Promise<{
  thread: ThreadType | null;
  replies: ThreadReplyType[];
} | null> => {
  try {
    if (!channel_id || !thread_slug) {
      return { thread: null, replies: [] };
    }

    const { data, error } = await supabaseBrowser
      .from("threads")
      .select("*")
      .eq("channel_id", channel_id)
      .eq("slug", thread_slug)
      .single();

    if (error) throw error;

    if (data) {
      const { data: replies, error: repliesError } = await supabaseBrowser
        .from("thread_replies")
        .select("*")
        .eq("thread_id", data.id);

      if (repliesError) throw repliesError;

      return { thread: data, replies };
    } else {
      return { thread: null, replies: [] };
    }
  } catch (error) {
    throw error;
  }
};

const useThread = (channel_id?: number, thread_slug?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["thread", channel_id, thread_slug],
    queryFn: () => getThread(channel_id, thread_slug),
    enabled: !!channel_id && !!thread_slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false, // Optional: adjust as needed
  });

  const setReplies = (replies: ThreadReplyType[]) => {
    queryClient.setQueryData(
      ["thread", channel_id, thread_slug],
      (
        oldData: { thread: ThreadType | null; replies: ThreadReplyType[] } = {
          thread: null,
          replies: [],
        }
      ) => {
        return {
          ...oldData,
          replies,
        };
      }
    );
  };

  return {
    thread: data?.thread,
    replies: data?.replies || [],
    setReplies,
    isLoading,
    error,
  };
};

export default useThread;
