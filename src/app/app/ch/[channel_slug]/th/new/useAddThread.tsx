import { useAuthProvider } from "@/context/AuthContext";
import { ChannelType, ThreadType } from "@/types/channel";
import { generateSlug } from "@/utils/generateSlug";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { JSONContent } from "novel";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useAddThread = ({ channel }: { channel: ChannelType }) => {
  const { profile } = useAuthProvider();
  const router = useRouter();

  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState<JSONContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [charsCount, setCharsCount] = useState(0);
  const queryClient = useQueryClient();

  const handleAddThread = async () => {
    if (!profile?.id || !channel) return;

    if (!threadTitle) {
      setError("Thread title is required.");
      return;
    }

    if (charsCount === 0 || !threadContent) {
      setError("Thread content is required.");
      return;
    }

    const tempId = uuidv4();
    try {
      setLoading(true);
      setError(null);

      const threadData: Omit<ThreadType, "id"> = {
        title: threadTitle,
        slug: generateSlug(threadTitle),
        content: JSON.stringify(threadContent),
        profile_id: profile.id,
        channel_id: channel.id,
        is_edited: false,
      };

      // optimistic update
      queryClient.setQueryData(
        ["channelDetails", channel.id, profile.id],
        (oldData: {
          channel: ChannelType | null;
          threads: ThreadType[] | null;
        }) => ({
          ...oldData,
          threads: [...(oldData.threads || []), { ...threadData, id: tempId }],
        })
      );

      const { data, error } = await supabaseBrowser
        .from("threads")
        .insert(threadData)
        .select("id, slug")
        .single();

      if (error) throw error;

      if (data) {
        queryClient.setQueryData(
          ["channelDetails", channel.id, profile.id],
          (oldData: {
            channel: ChannelType | null;
            threads: ThreadType[] | null;
          }) => ({
            ...oldData,
            threads: (oldData.threads || []).map((item) =>
              item.id.toString() == tempId ? { ...item, ...data } : item
            ),
          })
        );
        router.replace(`/app/ch/${channel.slug}/th/${data.slug}`);
      }
    } catch (error: any) {
      console.error(error);
      error.message && setError(error.message);

      queryClient.setQueryData(
        ["channelDetails", channel.id, profile.id],
        (oldData: {
          channel: ChannelType | null;
          threads: ThreadType[] | null;
        }) => ({
          ...oldData,
          threads: (oldData.threads || []).filter(
            (item) => item.id.toString() != tempId
          ),
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    threadTitle,
    setThreadTitle,
    threadContent,
    setThreadContent,
    error,
    handleAddThread,
    setCharsCount,
    charsCount,
  };
};

export default useAddThread;
