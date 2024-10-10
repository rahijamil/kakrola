"use client";

import { defaultExtensions } from "@/components/NovelEditor/extensions";
import { ThreadReplyType } from "@/types/channel";
import { ProfileType } from "@/types/user";
import moment from "moment";
import { Bookmark, MoreVertical, SmilePlus } from "lucide-react";
import Image from "next/image";
import { EditorContent } from "novel";
import React, { useRef, useCallback } from "react";
import useScreen from "@/hooks/useScreen";
import Dropdown from "@/components/ui/Dropdown";
import { AnimatePresence, motion } from "framer-motion";

interface ReplyCardProps {
  profile: ProfileType;
  replies: ThreadReplyType[];
  isThreadReply?: boolean;
  setShowOptions: (showOptions: string | null) => void;
  showOptions: string | null;
}

const ReplyCard: React.FC<ReplyCardProps> = ({
  profile,
  replies,
  isThreadReply,
  setShowOptions,
  showOptions,
}) => {
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const { screenWidth } = useScreen();
  const triggerRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string | undefined, isAmPm: boolean) => {
    if (!dateString) return "Unknown date";
    return isThreadReply
      ? moment(dateString).format("MMM D, YYYY - h:mm A")
      : moment(dateString).format(isAmPm ? "h:mm A" : "h:mm");
  };

  const handleTouchStart = useCallback((replyId: string) => {
    longPressTimer.current = setTimeout(() => {
      setShowOptions(replyId);
    }, 500);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }, []);

  const handleClick = useCallback(
    (replyId: string) => {
      if (screenWidth <= 768) {
        setShowOptions(showOptions === replyId ? null : replyId);
      }
    },
    [screenWidth, showOptions]
  );

  const renderOptions = (replyId: string) => (
    <ul className="flex items-center gap-1 bg-background shadow-sm border border-text-200 rounded-lg p-0.5 mt-2 select-none">
      <li>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-text-100 text-base transition"
          aria-label="React with checkmark"
        >
          ✅
        </button>
      </li>
      <li>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-text-100 text-base transition"
          aria-label="React with eyes"
        >
          👀
        </button>
      </li>
      <li>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-text-100 text-base transition"
          aria-label="React with raised hands"
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

  return (
    <AnimatePresence>
      <div>
        {replies
          .sort(
            (a, b) =>
              new Date(a.created_at || "").getTime() -
              new Date(b.created_at || "").getTime()
          )
          .map((reply, index, array) => (
            <motion.div
              key={reply.id}
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
              className={`relative group md:hover:bg-text-10 transition px-4 md:px-6 select-none md:select-auto ${
                index == 0 ? "py-2" : "py-1"
              }`}
              onTouchStart={(ev) => {
                ev.currentTarget.classList.add("bg-text-100");
                handleTouchStart(reply.id.toString());
              }}
              onTouchEnd={(ev) => {
                ev.currentTarget.classList.remove("bg-text-100");
                handleTouchEnd();
              }}
              // onClick={() => handleClick(reply.id.toString())}
            >
              <div className="flex gap-2">
                {index === 0 && (
                  <div className="w-9 h-9 flex items-center justify-center">
                    <Image
                      src={profile?.avatar_url || "/default_avatar.png"}
                      alt={profile?.full_name || "User"}
                      width={36}
                      height={36}
                      className="rounded-lg w-9 h-9 min-w-9 min-h-9 object-cover"
                    />
                  </div>
                )}

                <div className={`flex-1`}>
                  {index === 0 && (
                    <div className="flex gap-2 items-center">
                      <h3 className="font-bold">
                        {profile?.full_name || "Unknown User"}
                      </h3>
                      <p className="text-xs text-text-500">
                        {formatDate(reply.created_at, true)}
                      </p>
                    </div>
                  )}

                  <div className="flex">
                    {index > 0 && (
                      <div className="hidden group-hover:flex items-center justify-end mr-2 w-9">
                        <div className="text-xs text-text-500">
                          {formatDate(reply.created_at, false)}
                        </div>
                      </div>
                    )}

                    <div
                      className={index !== 0 ? "pl-11 group-hover:pl-0" : ""}
                    >
                      <EditorContent
                        editable={false}
                        initialContent={JSON.parse(reply.content)}
                        extensions={defaultExtensions}
                      />
                      {reply.is_edited && (
                        <p className="text-xs text-text-500 mt-1">(edited)</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* {screenWidth > 768 ? (
                <div className="absolute -top-6 right-6 hidden group-hover:block">
                  {renderOptions(reply.id.toString())}
                </div>
              ) : (
                <Dropdown
                  Label={() => <></>}
                  triggerRef={triggerRef}
                  isOpen={showOptions === reply.id.toString()}
                  setIsOpen={() => setShowOptions(null)}
                  content={
                    <div className="pb-40">
                      {renderOptions(reply.id.toString())}
                    </div>
                  }
                />
              )} */}
            </motion.div>
          ))}
      </div>
    </AnimatePresence>
  );
};

export default ReplyCard;
