const NovelEditor = dynamic(() => import("@/components/NovelEditor"), {
  ssr: false,
});
import { defaultExtensions } from "@/components/NovelEditor/extensions";
import { slashCommand } from "@/components/NovelEditor/slash-command";
import { Button } from "@/components/ui/button";
import { useAuthProvider } from "@/context/AuthContext";
import useScreen from "@/hooks/useScreen";
import { ThreadReplyType } from "@/types/channel";
import { supabaseBrowser } from "@/utils/supabase/client";
import { SendHorizonal, Slash, SquareSlash } from "lucide-react";
import dynamic from "next/dynamic";
import { JSONContent, useEditor } from "novel";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ReplyEditor = ({
  thread_id,
  setReplies,
  replies,
}: {
  thread_id: number;
  setReplies: (replies: ThreadReplyType[]) => void;
  replies: ThreadReplyType[];
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [replyContent, setReplyContent] = useState<JSONContent | null>(null);
  const [charsCount, setCharsCount] = useState(0);
  const ProseMirror = (editorRef.current as any)?.querySelector(".ProseMirror");
  const { profile } = useAuthProvider();

  const { screenWidth } = useScreen();

  const handleReplySave = async (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    ev.stopPropagation();
    try {
      if (!profile || charsCount == 0 || !replyContent) return;

      const tempId = uuidv4();
      const replyData: Omit<ThreadReplyType, "id"> = {
        content: JSON.stringify(replyContent),
        profile_id: profile.id,
        is_edited: false,
        thread_id,
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
      className={`transition flex flex-col cursor-text border border-text-200 focus-within:border-text-300 focus-within:shadow bg-background ${
        screenWidth > 768
          ? "mx-6 mb-8 rounded-lg"
          : "fixed bottom-0 left-0 right-0 pb-1 rounded-t-lg z-10"
      }`}
      onClick={() => ProseMirror?.focus()}
    >
      <div className="flex-1 reply-editor relative">
        <NovelEditor
          editorRef={editorRef}
          content={replyContent}
          handleSave={(content) => setReplyContent(content)}
          setCharsCount={setCharsCount}
          hideContentItemMenu
          autofocus={screenWidth > 768 ? true : false}
        />
      </div>

      <div className="flex items-center justify-between gap-4 p-1 pt-0">
        <div className="flex items-center gap-1">
          <button
            disabled={charsCount > 0}
            className="p-1 rounded-md hover:bg-text-100 text-text-500 disabled:hover:bg-transparent transition disabled:cursor-default disabled:opacity-50"
            onClick={(ev) => {
              ev.stopPropagation();

              if (ProseMirror) {
                ProseMirror.innerHTML = `<p><span class="suggestion">/</span></p>`;
                // focus range after the slash
                const range = document.createRange();
                const selection = window.getSelection();
                range.setStart(ProseMirror.firstChild, 1);
                range.collapse(true);
                selection?.removeAllRanges();
                selection?.addRange(range);
              }
            }}
          >
            <SquareSlash size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div>
          <Button
            size="sm"
            onClick={handleReplySave}
            disabled={charsCount == 0}
            variant={charsCount == 0 ? "ghost" : "default"}
            className="disabled:cursor-text disabled:pointer-events-none"
          >
            <SendHorizonal strokeWidth={1.5} className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReplyEditor;
