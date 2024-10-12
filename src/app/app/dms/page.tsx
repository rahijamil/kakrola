"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MessageCircleMore } from "lucide-react";
import useDms from "./useDms";
import Spinner from "@/components/ui/Spinner";
import Image from "next/image";
import ReplyEditor from "../ch/[channel_slug]/th/[thread_slug]/ReplyEditor";
import DmWrapper from "./DmWrapper";
import { Bookmark, MoreVertical, SmilePlus } from "lucide-react";
import DmSidebar from "./DmSidebar";
import { useAuthProvider } from "@/context/AuthContext";
import { DmContactType, DmType } from "@/types/channel";
import useScreen from "@/hooks/useScreen";
import { AnimatePresence, motion } from "framer-motion";
import { EditorContent, JSONContent } from "novel";
import { v4 as uuidv4 } from "uuid";
import { supabaseBrowser } from "@/utils/supabase/client";
import { defaultExtensions } from "@/components/NovelEditor/extensions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileById } from "@/lib/queries";
import moment from "moment";
import { ProfileType } from "@/types/user";
import { format, isSameDay } from "date-fns";
import DmMessageCard from "./DmMessageCard";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";

interface GroupedDm {
  date: Date;
  messages: DmType[]; // Array of messages only
  profile: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

const DmPage: React.FC = () => {
  const { profile } = useAuthProvider();
  const {
    contacts,
    isLoadingContacts,
    activeContact,
    setActiveContact,
    dmMessages,
  } = useDms();

  const [showOptions, setShowOptions] = useState<string | null>(null);

  const { screenWidth } = useScreen();

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchLastActiveContact = async () => {
      if (profile?.metadata?.last_active_contact_profile_id) {
        const contact = contacts.find(
          (contact) =>
            contact.profile_id ===
            profile.metadata?.last_active_contact_profile_id
        );
        if (contact) {
          setActiveContact(contact);
        }
      }
    };

    fetchLastActiveContact();
  }, [profile, contacts]);

  useEffect(() => {
    const updateLastActiveContact = async () => {
      if (
        profile &&
        activeContact &&
        profile.metadata?.last_active_contact_profile_id !==
          activeContact.profile_id
      ) {
        const { error } = await supabaseBrowser
          .from("profiles")
          .update({
            metadata: {
              ...profile.metadata,
              last_active_contact_profile_id: activeContact.profile_id,
            },
          })
          .eq("id", profile.id);

        if (error) {
          console.error("Error updating last active contact:", error);
        }
      }
    };

    updateLastActiveContact();
  }, [activeContact, profile]);

  const groupedDms = useMemo(() => {
    if (!activeContact) return [];

    const grouped: GroupedDm[] = [];
    let lastProfileId: ProfileType["id"] | null = null; // Track the last sender's profile ID
    let lastGroup: GroupedDm | null = null; // Track the last group for the sender

    dmMessages.forEach((dm) => {
      const dmProfile = contacts.find(
        (contact) => contact.profile_id === dm.sender_profile_id
      );

      if (!dmProfile) return; // Skip if profile not found

      const profile = {
        id: dmProfile.profile_id,
        full_name: dmProfile.name,
        avatar_url: dmProfile.avatar_url,
      };

      const dmDate = new Date(dm.created_at || "");

      // Check if we are creating a new group or adding to the existing one
      const isSameProfile = lastProfileId === profile.id;
      const isSameDate = lastGroup && isSameDay(dmDate, lastGroup.date); // Check if the date is the same

      if (isSameProfile && isSameDate && lastGroup) {
        // Same sender and same date, add to the existing group
        lastGroup.messages.push(dm); // Add to the same group
        lastGroup.date = dmDate; // Update the group's date to the latest message date
      } else {
        // Create a new group
        lastGroup = { date: dmDate, messages: [dm], profile }; // Include profile in the group
        grouped.push(lastGroup);
      }

      lastProfileId = profile.id; // Update lastProfileId to current profile
    });

    // Sort the grouped DMs in ascending order by date
    return grouped.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [activeContact, dmMessages, contacts]);

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
      if (!profile || charsCount == 0 || !replyContent || !activeContact)
        return;

      const newDm: DmType = {
        id: uuidv4(),
        content: JSON.stringify(replyContent),
        sender_profile_id: profile.id,
        recipient_profile_id: activeContact.profile_id,
        is_edited: false,
        created_at: new Date().toISOString(),
      };

      setReplyContent(null);
      // Optimistically update the contacts list with the new last message
      queryClient.setQueryData(
        ["dmContacts", profile?.id],
        (prevContacts: DmContactType[]) =>
          prevContacts
            .map((contact) =>
              contact.profile_id === activeContact.profile_id
                ? {
                    ...contact,
                    all_dms: [...contact.all_dms, newDm],
                    last_message: newDm,
                  }
                : contact
            )
            .sort((a, b) => {
              const timeA = a.last_message?.created_at ?? "0";
              const timeB = b.last_message?.created_at ?? "0";
              return timeB.localeCompare(timeA);
            })
      );

      ProseMirror.innerHTML = `<p data-placeholder="Press '/' for commands" class="is-empty is-editor-empty"><br class="ProseMirror-trailingBreak"></p>`;

      const { id, ...newDmWithoutId } = newDm;

      const { data, error } = await supabaseBrowser
        .from("dms")
        .insert(newDmWithoutId)
        .select()
        .single();

      if (error) throw error;

      queryClient.setQueryData(
        ["dmContacts", profile?.id],
        (prevContacts: DmContactType[]) =>
          prevContacts.map((contact) =>
            contact.profile_id === activeContact.profile_id
              ? {
                  ...contact,
                  all_dms: contact.all_dms.map((dm) =>
                    dm.id == newDm.id ? data : dm
                  ),
                }
              : contact
          )
      );
    } catch (error) {
      console.error(error);
      queryClient.setQueryData(
        ["dmContacts", profile?.id],
        (prevContacts: DmContactType[]) =>
          prevContacts.map((contact) =>
            contact.profile_id === activeContact?.profile_id
              ? {
                  ...contact,
                  all_dms: dmMessages,
                }
              : contact
          )
      );
    }
  };

  const closeActiveContact = async () => {
    if (profile) {
      setActiveContact(null);
      window.history.pushState(null, "", "/app/dms");

      const { error } = await supabaseBrowser
        .from("profiles")
        .update({
          metadata: {
            ...profile.metadata,
            last_active_contact_profile_id: null,
          },
        })
        .eq("id", profile.id);

      if (error) {
        console.error("Error updating last active contact:", error);
      }
    }
  };

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight + 25;
    }
  }, [activeContact, dmMessages]);

  return (
    <div className="flex h-screen bg-background">
      <DmSidebar
        activeContact={activeContact}
        setActiveContact={setActiveContact}
        dmContacts={contacts}
        isLoadingContacts={isLoadingContacts}
      />

      <AnimatePresence>
        {screenWidth > 768 ? (
          isLoadingContacts ? (
            <div className="flex-1 flex items-center justify-center h-full text-primary-500">
              <Spinner color="current" size="md" />
            </div>
          ) : activeContact ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
              className="flex-1 flex flex-col h-full bg-background"
              onContextMenu={(e) => e.preventDefault()}
            >
              <DmWrapper
                contact={activeContact}
                closeActiveContact={closeActiveContact}
              >
                <div className="flex flex-col justify-end h-full">
                  {/* Messages */}
                  <div
                    className="max-h-[calc(100vh-170px)] overflow-y-auto"
                    // onScroll={handleScroll}
                    ref={messagesContainerRef}
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

                    {groupedDms.length > 0 && (
                      <div className="pb-6">
                        {groupedDms.map((dateGroup, index) => {
                          // Check if the current group is on a different date or sent by a different profile than the last one
                          const isNewDate =
                            index === 0 ||
                            !isSameDay(
                              dateGroup.date,
                              groupedDms[index - 1].date
                            );

                          return (
                            <div
                              key={dateGroup.date.toISOString()}
                              className={`${isNewDate && "space-y-4"}`}
                            >
                              {isNewDate && (
                                <div className="flex items-center select-none pt-6">
                                  <div className="h-px w-full bg-text-100"></div>
                                  <div className="text-center text-text-500 whitespace-nowrap bg-background border border-text-100 rounded-lg text-xs font-medium px-2 py-1">
                                    {format(dateGroup.date, "MMMM d, yyyy")}
                                  </div>
                                  <div className="h-px w-full bg-text-100"></div>
                                </div>
                              )}

                              {/* Render messages grouped by profile */}
                              <DmMessageCard
                                key={dateGroup.profile.id} // Unique key for the profile
                                profile={dateGroup.profile} // Profile of the sender
                                messages={dateGroup.messages} // Array of messages for this profile on the date
                                setShowOptions={setShowOptions}
                                showOptions={showOptions}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <ReplyEditor handleReplySave={handleReplySave} />
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
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut", type: "spring" }}
              className="fixed inset-0 z-10 flex flex-col h-full bg-background"
              onContextMenu={(e) => e.preventDefault()}
            >
              <DmWrapper
                contact={activeContact}
                closeActiveContact={closeActiveContact}
              >
                <div className="flex flex-col justify-end h-full">
                  {/* Messages */}
                  <div
                    className="max-h-[calc(100vh-50px)] md:max-h-[calc(100vh-170px)] overflow-y-auto pb-20 md:pb-0"
                    // onScroll={handleScroll}
                    ref={messagesContainerRef}
                  >
                    <div className="space-y-4 p-6 md:pt-8">
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

                    {groupedDms.length > 0 && (
                      <div className="pb-6">
                        {groupedDms.map((dateGroup, index) => {
                          // Check if the current group is on a different date or sent by a different profile than the last one
                          const isNewDate =
                            index === 0 ||
                            !isSameDay(
                              dateGroup.date,
                              groupedDms[index - 1].date
                            );

                          return (
                            <div
                              key={dateGroup.date.toISOString()}
                              className={`${isNewDate && "space-y-4"}`}
                            >
                              {isNewDate && (
                                <div className="flex items-center select-none pt-6">
                                  <div className="h-px w-full bg-text-100"></div>
                                  <div className="text-center text-text-500 whitespace-nowrap bg-background border border-text-100 rounded-lg text-xs font-medium px-2 py-1">
                                    {format(dateGroup.date, "MMMM d, yyyy")}
                                  </div>
                                  <div className="h-px w-full bg-text-100"></div>
                                </div>
                              )}

                              {/* Render messages grouped by profile */}
                              <DmMessageCard
                                key={dateGroup.profile.id} // Unique key for the profile
                                profile={dateGroup.profile} // Profile of the sender
                                messages={dateGroup.messages} // Array of messages for this profile on the date
                                setShowOptions={setShowOptions}
                                showOptions={showOptions}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <ReplyEditor handleReplySave={handleReplySave} />
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
