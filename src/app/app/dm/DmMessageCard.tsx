"use client";

import { defaultExtensions } from "@/components/NovelEditor/extensions";
import { DmReactionType, DmType } from "@/types/channel";
import { ProfileType } from "@/types/user";
import moment from "moment";
import { Bookmark, MoreVertical, SmilePlus } from "lucide-react";
import Image from "next/image";
import { EditorContent } from "novel";
import React, { useRef, useCallback } from "react";
import useScreen from "@/hooks/useScreen";
import Dropdown from "@/components/ui/Dropdown";
import { AnimatePresence, motion } from "framer-motion";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DmMessageCardProps {
  profile: ProfileType;
  messages: DmType[];
  setShowOptions: (showOptions: string | null) => void;
  showOptions: string | null;
}

const DmMessageCard: React.FC<DmMessageCardProps> = ({
  profile,
  messages,
  setShowOptions,
  showOptions,
}) => {
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const { screenWidth } = useScreen();
  const triggerRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string | undefined, isAmPm: boolean) => {
    if (!dateString) return "Unknown date";
    return moment(dateString).format(isAmPm ? "h:mm A" : "h:mm");
  };

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

  const handleClick = useCallback(
    (messageId: string) => {
      if (screenWidth <= 768) {
        // Handle click
      }
    },
    [screenWidth]
  );

  const renderOptions = (messageId: DmType["id"]) => {
    const handleReaction = async (emoji: string) => {
      try {
        const reactionData: Omit<DmReactionType, "id"> = {
          profile_id: profile.id,
          emoji: emoji,
          type: "dm",
          dm_id: messageId,
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

  // const renderReactions = (messageId: DmType["id"]) => {
  //   const { data: reactions, error } = useQuery({
  //     queryKey: ["reactions", messageId],
  //     queryFn: async (): Promise<DmReactionType[]> => {
  //       const { data, error } = await supabaseBrowser
  //         .from("reactions")
  //         .select("*")
  //         .eq("dm_id", messageId);

  //       if (error) {
  //         console.error("Error fetching reactions:", error);
  //         return [];
  //       }

  //       return data || [];
  //     },
  //   });

  //   const messageReactions = reactions?.filter((r) => r.dm_id === messageId);
  //   const groupedReactions = messageReactions?.reduce((acc, reaction) => {
  //     acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
  //     return acc;
  //   }, {} as Record<string, number>);

  //   return (
  //     <div className="flex flex-wrap gap-1 mt-1">
  //       {groupedReactions &&
  //         Object.entries(groupedReactions).map(([emoji, count]) => (
  //           <span
  //             key={emoji}
  //             className="bg-text-100 rounded-full px-2 py-0.5 text-xs"
  //           >
  //             {emoji} {count}
  //           </span>
  //         ))}
  //     </div>
  //   );
  // };

  return (
    <AnimatePresence>
      <div>
        {messages
          .sort(
            (a, b) =>
              new Date(a.created_at || "").getTime() -
              new Date(b.created_at || "").getTime()
          )
          .map((message, index, array) => (
            <motion.div
              key={message.id}
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
                handleTouchStart(message.id.toString());
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
                        {formatDate(message.created_at, true)}
                      </p>
                    </div>
                  )}

                  <div className="flex">
                    {index > 0 && (
                      <div className="hidden group-hover:flex items-center justify-end mr-2 w-9">
                        <div className="text-xs text-text-500">
                          {formatDate(message.created_at, false)}
                        </div>
                      </div>
                    )}

                    <div
                      className={index !== 0 ? "pl-11 group-hover:pl-0" : ""}
                    >
                      <EditorContent
                        editable={false}
                        initialContent={JSON.parse(message.content)}
                        extensions={defaultExtensions}
                      />
                      {message.is_edited && (
                        <p className="text-xs text-text-500 mt-1">(edited)</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* {renderReactions(message.id)} */}

              {/* {screenWidth > 768 ? (
                <div className="absolute -top-6 right-6 hidden group-hover:block">
                  {renderOptions(message.id)}
                </div>
              ) : (
                <Dropdown
                  Label={() => <></>}
                  triggerRef={triggerRef}
                  isOpen={showOptions === message.id.toString()}
                  setIsOpen={() => setShowOptions(null)}
                  content={
                    <div className="pb-40">{renderOptions(message.id)}</div>
                  }
                />
              )} */}
            </motion.div>
          ))}
      </div>
    </AnimatePresence>
  );
};

export default DmMessageCard;
