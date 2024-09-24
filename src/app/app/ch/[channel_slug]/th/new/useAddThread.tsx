import { useAuthProvider } from "@/context/AuthContext";
import { ChannelType, ThreadType } from "@/types/channel";
import { generateSlug } from "@/utils/generateSlug";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { JSONContent } from "novel";
import { useState } from "react";

const useAddThread = ({ channel }: { channel: ChannelType }) => {
  const { profile } = useAuthProvider();
  const router = useRouter();

  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState<JSONContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [charsCount, setCharsCount] = useState(0);

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

      const { data, error } = await supabaseBrowser
        .from("threads")
        .insert(threadData)
        .select("slug")
        .single();

      if (error) throw error;

      if (data) {
        router.replace(`/app/ch/${channel.slug}/th/${data.slug}`);
      }
    } catch (error: any) {
      console.error(error);
      error.message && setError(error.message);

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
