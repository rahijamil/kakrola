import { getProfileById } from "@/lib/queries";
import { ThreadReplyType, ThreadType } from "@/types/channel";
import { ProfileType } from "@/types/user";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSameDay } from "date-fns";
import React, { useEffect, useState } from "react";

const getThread = async (
  channel_id?: number,
  thread_slug?: string | null
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

interface GroupedReply {
  date: Date;
  replies: {
    profile: ProfileType;
    replies: ThreadReplyType[];
  }[];
}

const useThread = (channel_id?: number, thread_slug?: string | null) => {
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

  const [threadProfile, setThreadProfile] = useState<ProfileType | null>(null);
  const [groupedReplies, setGroupedReplies] = useState<GroupedReply[]>([]);
  const [showOptions, setShowOptions] = useState<string | null>(null);

  const thread = data?.thread;
  const replies = data?.replies;

  useEffect(() => {
    if (thread?.profile_id) {
      const fetchProfile = async () => {
        try {
          const profile = await getProfileById(thread.profile_id);
          setThreadProfile(profile);
        } catch (error) {
          console.error(error);
        }
      };
      fetchProfile();
    }
  }, [thread?.profile_id]);

  useEffect(() => {
    if (replies && replies.length > 0) {
      const fetchReplyProfiles = async () => {
        const profiles = await Promise.all(
          replies.map((reply) => getProfileById(reply.profile_id))
        );

        // Group replies by date and then by author
        const grouped = replies.reduce<GroupedReply[]>((acc, reply) => {
          const profile = profiles.find((p) => p.id === reply.profile_id);
          if (!profile) return acc;

          const replyDate = new Date(reply.created_at || "");
          let dateGroup = acc.find((group) => isSameDay(group.date, replyDate));

          if (!dateGroup) {
            dateGroup = { date: replyDate, replies: [] };
            acc.push(dateGroup);
          }

          let authorGroup = dateGroup.replies.find(
            (group) => group.profile.id === profile.id
          );

          if (!authorGroup) {
            authorGroup = { profile, replies: [] };
            dateGroup.replies.push(authorGroup);
          }

          authorGroup.replies.push(reply);
          return acc;
        }, []);

        setGroupedReplies(
          grouped.sort((a, b) => a.date.getTime() - b.date.getTime())
        );
      };
      fetchReplyProfiles();
    }
  }, [replies]);

  return {
    thread: data?.thread,
    replies: data?.replies || [],
    setReplies,
    isLoading,
    error,
    threadProfile,
    groupedReplies,
    showOptions,
    setShowOptions,
  };
};

export default useThread;
