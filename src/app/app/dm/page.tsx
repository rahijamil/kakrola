"use client";

import React, { useEffect, useState } from "react";
import { MessageCircleMore } from "lucide-react";
import useDms from "./useDms";
import Spinner from "@/components/ui/Spinner";
import Image from "next/image";
import ReplyEditor from "../ch/[channel_slug]/th/[thread_slug]/ReplyEditor";
import DmWrapper from "./DmWrapper";
import { Bookmark, MoreVertical, SmilePlus } from "lucide-react";
import DmSidebar from "./DmSidebar";
import { useAuthProvider } from "@/context/AuthContext";
import { DmType } from "@/types/channel";
import useScreen from "@/hooks/useScreen";
import { AnimatePresence, motion } from "framer-motion";

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

const DmPage: React.FC = () => {
  const [activeContact, setActiveContact] = useState<{
    id: number;
    profile_id: string;
    name: string;
    avatar_url: string;
  } | null>(null);
  const { getDmsForContact, isLoading, loadMore, limit, setLimit } = useDms();
  const [dmMessages, setDmMessages] = useState<DmType[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { profile } = useAuthProvider();

  const { screenWidth } = useScreen();

  useEffect(() => {
    if (activeContact) {
      const dmMessages = getDmsForContact(activeContact.id);
      setDmMessages(dmMessages);
    }
  }, [activeContact]);

  const handleScroll = async () => {
    if (hasMore && dmMessages.length >= limit && activeContact) {
      const newLimit = limit + 20;
      setLimit(newLimit);
      const newDms = await loadMore(activeContact.id);
      setDmMessages([...dmMessages, ...newDms]);
      if (newDms.length < limit) {
        setHasMore(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {screenWidth > 768 ? (
        <DmSidebar
          setActiveContact={setActiveContact}
          activeContact={activeContact}
        />
      ) : (
        <DmSidebar
          setActiveContact={setActiveContact}
          activeContact={activeContact}
        />
      )}

      <AnimatePresence>
        {screenWidth > 768 ? (
          isLoading ? (
            <div className="flex-1 flex items-center justify-center h-full text-primary-500">
              <Spinner color="current" size="md" />
            </div>
          ) : activeContact ? (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col h-full"
            >
              <DmWrapper
                contact={activeContact}
                setActiveContact={setActiveContact}
              >
                <div className="flex flex-col h-full">
                  {/* Messages */}
                  <div className="flex-1 flex flex-col justify-end h-full">
                    <div
                      className="max-h-[calc(100vh-170px)] overflow-y-auto"
                      onScroll={handleScroll}
                    >
                      <div className="space-y-4 p-6 pt-8">
                        <div className="flex items-center gap-3">
                          <Image
                            src={activeContact.avatar_url}
                            alt={activeContact.name}
                            className="w-20 h-20 min-w-20 min-h-20 rounded-lg object-cover"
                            width={80}
                            height={80}
                          />

                          <h2 className="font-semibold text-base">
                            {activeContact.name}
                          </h2>
                        </div>

                        {profile?.id == activeContact.profile_id ? (
                          <p className="font-base">
                            <span className="font-medium">
                              This is your space.
                            </span>{" "}
                            Draft messages, list your to-dos, or keep links and
                            files handy. You can also talk to yourself here, but
                            please bear in mind you&apos;ll have to supply both
                            sides of the conversation.
                          </p>
                        ) : (
                          <p className="font-base">
                            This conversation is just between{" "}
                            <span className="bg-primary-50 hover:bg-primary-100 transition cursor-pointer text-primary-500 rounded-lg px-1 py-0.5">
                              @{activeContact.name}
                            </span>{" "}
                            and you. Check out their profile to learn more about
                            them.
                          </p>
                        )}
                      </div>

                      {getDmsForContact(activeContact.id).map((dm, index) => (
                        <div
                          key={dm.id}
                          className={`relative group md:hover:bg-text-10 transition px-4 md:px-6 select-none md:select-auto py-2`}
                          // onTouchStart={(ev) => {
                          //   ev.currentTarget.classList.add("bg-text-100");
                          //   handleTouchStart(reply.id.toString());
                          // }}
                          // onTouchEnd={(ev) => {
                          //   ev.currentTarget.classList.remove("bg-text-100");
                          //   handleTouchEnd();
                          // }}
                          // onClick={() => handleClick(reply.id.toString())}
                        >
                          <div className="flex gap-2">
                            <div className="w-9 h-9 flex items-center justify-center">
                              <Image
                                src={
                                  index % 2 === 0
                                    ? "/today.png"
                                    : "/default_avatar.png"
                                }
                                alt={"User"}
                                width={36}
                                height={36}
                                className="rounded-lg w-9 h-9 min-w-9 min-h-9 object-cover"
                              />
                            </div>

                            <div className={`flex-1`}>
                              <div className="flex gap-2 items-center">
                                <h3 className="font-bold">
                                  {dm.sender_profile_id}
                                </h3>
                                <p className="text-xs text-text-500">
                                  {new Date().toLocaleString()}
                                </p>
                              </div>

                              <div className="flex">
                                <div>
                                  {/* <EditorContent
                      editable={false}
                      initialContent={JSON.parse(reply.content)}
                      extensions={defaultExtensions}
                    /> */}
                                  {dm.content}
                                  {dm.is_edited && (
                                    <p className="text-xs text-text-500 mt-1">
                                      (edited)
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="absolute -top-6 right-6 hidden group-hover:block">
                            {renderOptions(dm.id.toString())}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <ReplyEditor
                    thread_id={0}
                    setReplies={() => {}}
                    replies={[]}
                  />
                </div>
              </DmWrapper>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircleMore className="h-32 w-32 mx-auto mb-4 text-primary-500" />
              </div>
            </div>
          )
        ) : (
          activeContact && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-10 flex flex-col h-full"
            >
              <DmWrapper
                contact={activeContact}
                setActiveContact={setActiveContact}
              >
                <div className="flex flex-col h-full pb-20 md:pb-0">
                  {/* Messages */}
                  <div className="flex-1 flex flex-col justify-end h-full">
                    <div
                      className="max-h-[calc(100vh-170px)] overflow-y-auto"
                      onScroll={handleScroll}
                    >
                      <div className="space-y-4 p-6 pt-8">
                        <div className="flex items-center gap-3">
                          <Image
                            src={activeContact.avatar_url}
                            alt={activeContact.name}
                            className="w-20 h-20 min-w-20 min-h-20 rounded-lg object-cover"
                            width={80}
                            height={80}
                          />

                          <h2 className="font-semibold text-base">
                            {activeContact.name}
                          </h2>
                        </div>

                        {profile?.id == activeContact.profile_id ? (
                          <p className="font-base">
                            <span className="font-medium">
                              This is your space.
                            </span>{" "}
                            Draft messages, list your to-dos, or keep links and
                            files handy. You can also talk to yourself here, but
                            please bear in mind you&apos;ll have to supply both
                            sides of the conversation.
                          </p>
                        ) : (
                          <p className="font-base">
                            This conversation is just between{" "}
                            <span className="bg-primary-50 hover:bg-primary-100 transition cursor-pointer text-primary-500 rounded-lg px-1 py-0.5">
                              @{activeContact.name}
                            </span>{" "}
                            and you. Check out their profile to learn more about
                            them.
                          </p>
                        )}
                      </div>

                      {getDmsForContact(activeContact.id).map((dm, index) => (
                        <div
                          key={dm.id}
                          className={`relative group md:hover:bg-text-10 transition px-4 md:px-6 select-none md:select-auto py-2`}
                          // onTouchStart={(ev) => {
                          //   ev.currentTarget.classList.add("bg-text-100");
                          //   handleTouchStart(reply.id.toString());
                          // }}
                          // onTouchEnd={(ev) => {
                          //   ev.currentTarget.classList.remove("bg-text-100");
                          //   handleTouchEnd();
                          // }}
                          // onClick={() => handleClick(reply.id.toString())}
                        >
                          <div className="flex gap-2">
                            <div className="w-9 h-9 flex items-center justify-center">
                              <Image
                                src={
                                  index % 2 === 0
                                    ? "/today.png"
                                    : "/default_avatar.png"
                                }
                                alt={"User"}
                                width={36}
                                height={36}
                                className="rounded-lg w-9 h-9 min-w-9 min-h-9 object-cover"
                              />
                            </div>

                            <div className={`flex-1`}>
                              <div className="flex gap-2 items-center">
                                <h3 className="font-bold">
                                  {dm.sender_profile_id}
                                </h3>
                                <p className="text-xs text-text-500">
                                  {new Date().toLocaleString()}
                                </p>
                              </div>

                              <div className="flex">
                                <div>
                                  {/* <EditorContent
                      editable={false}
                      initialContent={JSON.parse(reply.content)}
                      extensions={defaultExtensions}
                    /> */}
                                  {dm.content}
                                  {dm.is_edited && (
                                    <p className="text-xs text-text-500 mt-1">
                                      (edited)
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="absolute -top-6 right-6 hidden group-hover:block">
                            {renderOptions(dm.id.toString())}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <ReplyEditor
                    thread_id={0}
                    setReplies={() => {}}
                    replies={[]}
                  />
                </div>
              </DmWrapper>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default DmPage;
