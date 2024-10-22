import React, { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { ProfileType } from "@/types/user";
import { TaskCommentType } from "@/types/comment";
import { MoreVertical, SmilePlus, Bookmark } from "lucide-react";
import useScreen from "@/hooks/useScreen";
import { AnimatePresence, motion } from "framer-motion";
import { EditorContent } from "novel";
import { defaultExtensions } from "../NovelEditor/extensions";
import Dropdown from "../ui/Dropdown";
import { supabaseBrowser } from "@/utils/supabase/client";
import { TaskCommentReactionType } from "@/types/channel";
import { useAuthProvider } from "@/context/AuthContext";
import { formatDate } from "@/utils/utility_functions";

interface CommentCardProps {
  profile: ProfileType;
  comment: TaskCommentType;
}

const renderOptions = (
  task_comment_id: TaskCommentType["id"],
  reactor_profile_id?: ProfileType["id"]
) => {
  const handleReaction = async (emoji: string) => {
    try {
      if (!reactor_profile_id) return;

      const reactionData: Omit<TaskCommentReactionType, "id"> = {
        profile_id: reactor_profile_id,
        emoji: emoji,
        type: "task_comment",
        task_comment_id,
      };
      const { data, error } = await supabaseBrowser
        .from("reactions")
        .insert(reactionData);

      if (error) throw error;
      // You might want to update the local state or refetch reactions here
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  return (
    <ul className="flex items-center gap-1 bg-background shadow-sm border border-text-200 rounded-lg p-0.5 mt-2 select-none">
      <li>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-text-100 text-base transition"
          aria-label="React with checkmark"
          onClick={() => handleReaction("✅")}
        >
          ✅
        </button>
      </li>
      <li>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-text-100 text-base transition"
          aria-label="React with eyes"
          onClick={() => handleReaction("👀")}
        >
          👀
        </button>
      </li>
      <li>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-text-100 text-base transition"
          aria-label="React with raised hands"
          onClick={() => handleReaction("🙌")}
        >
          🙌
        </button>
      </li>
      <li>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-text-100 transition"
          aria-label="Bookmark"
        >
          <Bookmark strokeWidth={2} className="w-4 h-4" />
        </button>
      </li>
      <li>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-text-100 transition"
          aria-label="Add reaction"
        >
          <SmilePlus strokeWidth={2} className="w-4 h-4" />
        </button>
      </li>
      <li>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-text-100 transition"
          aria-label="More options"
        >
          <MoreVertical strokeWidth={2} className="w-4 h-4" />
        </button>
      </li>
    </ul>
  );
};

const CommentCard: React.FC<CommentCardProps> = ({ profile, comment }) => {
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const { profile: authProfile } = useAuthProvider();

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const { screenWidth } = useScreen();
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((messageId: string) => {
    longPressTimer.current = setTimeout(() => {
      // Handle long press
    }, 500);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key={comment.id}
        // initial={index === array.length - 1 ? { opacity: 0, y: 20 } : {}}
        // animate={index === array.length - 1 ? { opacity: 1, y: 0 } : {}}
        // exit={index === array.length - 1 ? { opacity: 0, y: -20 } : {}}
        // transition={
        //   index === array.length - 1
        //     ? {
        //         type: "tween",
        //         duration: 0.2,
        //       }
        //     : {}
        // }
        className={`relative group md:hover:bg-text-10dark:md:hover:bg-background transition px-4 md:px-[calc(6rem-4px)] select-none md:select-auto py-1`}
        onTouchStart={(ev) => {
          ev.currentTarget.classList.add("bg-text-100");
          handleTouchStart(comment.id.toString());
        }}
        onTouchEnd={(ev) => {
          ev.currentTarget.classList.remove("bg-text-100");
          handleTouchEnd();
        }}
        // onClick={() => handleClick(reply.id.toString())}
      >
        <div className="flex gap-2">
          <div className="w-9 h-9 flex items-center justify-center">
            <Image
              src={profile?.avatar_url || "/default_avatar.png"}
              alt={profile?.full_name || "User"}
              width={28}
              height={28}
              className="rounded-lg w-7 h-7 min-w-7 min-h-7 object-cover"
            />
          </div>

          <div className={`flex-1`}>
            <div className="flex gap-2 items-center">
              <h3 className="font-semibold">
                {profile?.full_name || "Unknown User"}
              </h3>
              <p className="text-xs text-text-500">
                {formatDate(comment.created_at, true)}
              </p>
            </div>

            <div className="flex">
              <div>
                <EditorContent
                  editable={false}
                  initialContent={JSON.parse(comment.content)}
                  extensions={defaultExtensions}
                />
                {comment.is_edited && (
                  <p className="text-xs text-text-500 mt-1">(edited)</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* {renderReactions(comment.id)} */}

        {/* {screenWidth > 768 ? (
          <div className="absolute -top-6 right-6 hidden group-hover:block">
            {renderOptions(comment.id, authProfile?.id)}
          </div>
        ) : (
          <Dropdown
            Label={() => <></>}
            triggerRef={triggerRef}
            isOpen={showOptions === comment.id.toString()}
            setIsOpen={() => setShowOptions(null)}
            content={
              <div className="pb-40">
                {renderOptions(comment.id, authProfile?.id)}
              </div>
            }
          />
        )} */}
      </motion.div>
    </AnimatePresence>
  );
};

export default CommentCard;
