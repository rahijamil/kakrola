import Link from "next/link";
import React from "react";
import ReplyCard from "./th/[thread_slug]/ReplyCard";
import ReplyEditor from "./th/[thread_slug]/ReplyEditor";
import { ChannelType, ThreadReplyType, ThreadType } from "@/types/channel";
import { ProfileType } from "@/types/user";
import { format } from "date-fns";
import { JSONContent } from "novel";
import { useAuthProvider } from "@/context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { supabaseBrowser } from "@/utils/supabase/client";

interface GroupedRepliesType {
  date: Date;
  replies: {
    profile: ProfileType;
    replies: ThreadReplyType[];
  }[];
}

const Thread = ({
  channel_slug,
  channel,
  thread,
  threadProfile,
  groupedReplies,
  setShowOptions,
  showOptions,
  replies,
  setReplies,
}: {
  channel_slug: string;
  channel: ChannelType;
  thread: ThreadType;
  threadProfile: ProfileType | null;
  groupedReplies: GroupedRepliesType[];
  setShowOptions: (showOptions: string | null) => void;
  showOptions: string | null;
  replies: ThreadReplyType[];
  setReplies: (replies: ThreadReplyType[]) => void;
}) => {
  const { profile } = useAuthProvider();

  const handleReplySave = async ({
    ev,
    replyContent,
    setReplyContent,
    charsCount,
    ProseMirror,
  }: {
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent> | KeyboardEvent;
    replyContent: JSONContent;
    setReplyContent: (content: JSONContent | null) => void;
    charsCount: number;
    ProseMirror: HTMLDivElement;
  }) => {
    ev.stopPropagation();
    try {
      if (!profile || charsCount == 0 || !replyContent || !thread?.id) return;

      const tempId = uuidv4();
      const replyData: Omit<ThreadReplyType, "id"> = {
        content: JSON.stringify(replyContent),
        profile_id: profile.id,
        is_edited: false,
        thread_id: thread.id,
      };

      const tempReplies = [...replies, { ...replyData, id: tempId }];
      //   optimistic update
      setReplies(tempReplies);
      setReplyContent(null);
      ProseMirror.innerHTML = `<p data-placeholder="Press '/' for commands" class="is-empty is-editor-empty"><br class="ProseMirror-trailingBreak"></p>`;

      const { data, error } = await supabaseBrowser
        .from("thread_replies")
        .insert(replyData)
        .select("id")
        .single();

      if (error) throw error;

      setReplies(
        tempReplies.map((reply) =>
          reply.id == tempId ? { ...reply, id: data.id } : reply
        )
      );
    } catch (error) {
      console.error(error);
      setReplies(replies);
    }
  };

  return (
    <div
      className="flex flex-col justify-end h-full"
    >
      <div className="max-h-[calc(100vh-170px)] overflow-y-auto">
        <div className="p-4 md:p-6 pt-8">
          <h1 className="text-2xl md:text-3xl font-bold">{thread.title}</h1>
          <div className="flex items-center gap-1 text-xs">
            <p className="text-text-500">1 participant</p>
            <p>•</p>
            <Link
              href={`/app/ch/${channel_slug}`}
              className="text-primary-500 hover:underline"
            >
              #{channel.name}
            </Link>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6 pb-10 md:pb-6">
          {threadProfile && thread.created_at && thread.content && (
            <ReplyCard
              profile={threadProfile}
              replies={[
                {
                  id: thread.id,
                  profile_id: thread.profile_id,
                  thread_id: thread.id,
                  created_at: thread.created_at,
                  is_edited: thread.is_edited,
                  content: thread.content,
                },
              ]}
              isThreadReply
              setShowOptions={setShowOptions}
              showOptions={showOptions}
            />
          )}

          {groupedReplies.length > 0 && (
            <div className="space-y-6">
              {groupedReplies.map((dateGroup) => (
                <div key={dateGroup.date.toISOString()} className="space-y-4">
                  <div className="flex items-center select-none">
                    <div className="h-px w-full bg-text-100"></div>
                    <div className="text-center text-text-500 whitespace-nowrap bg-background border border-text-100 rounded-lg text-xs font-medium px-2 py-1">
                      {format(dateGroup.date, "MMMM d, yyyy")}
                    </div>
                    <div className="h-px w-full bg-text-100"></div>
                  </div>
                  {dateGroup.replies.map((authorGroup, index) => (
                    <ReplyCard
                      key={`${authorGroup.profile.id}-${index}`}
                      profile={authorGroup.profile}
                      replies={authorGroup.replies}
                      setShowOptions={setShowOptions}
                      showOptions={showOptions}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReplyEditor handleReplySave={handleReplySave} />
    </div>
  );
};

export default Thread;
