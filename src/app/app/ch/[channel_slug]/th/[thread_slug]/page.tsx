"use client";

import React, { useEffect, useState } from "react";
import ThreadWrapper from "../ThreadWrapper";
import { ChannelType, ThreadReplyType, ThreadType } from "@/types/channel";
import useThread from "./useThread";
import Spinner from "@/components/ui/Spinner";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import Link from "next/link";
import Image from "next/image";
import { ProfileType } from "@/types/user";
import { getProfileById } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import ReplyCard from "./ReplyCard";
import ReplyEditor from "./ReplyEditor";
import { format, isSameDay } from "date-fns";
import useSidebarCollapse from "@/components/SidebarWrapper/useSidebarCollapse";
import ThreadCard from "../../ThreadCard";
import useChannelDetails from "@/hooks/useChannelDetails";
import { Edit, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/ScrollArea";
import useScreen from "@/hooks/useScreen";

interface GroupedReply {
  date: Date;
  replies: {
    profile: ProfileType;
    replies: ThreadReplyType[];
  }[];
}

const ThreadDetailsPage = ({
  params: { channel_slug, thread_slug },
}: {
  params: { channel_slug: string; thread_slug: string };
}) => {
  const { channels, sidebarLoading } = useSidebarDataProvider();
  const findChannel = channels.find(
    (channel: ChannelType) => channel.slug === channel_slug
  );
  const [threadProfile, setThreadProfile] = useState<ProfileType | null>(null);
  const [groupedReplies, setGroupedReplies] = useState<GroupedReply[]>([]);
  const [showOptions, setShowOptions] = useState<string | null>(null);

  const { channel, threads, setChannel, isPending, isError } =
    useChannelDetails(channel_slug);

  const { thread, replies, setReplies, error, isLoading } = useThread(
    findChannel?.id,
    thread_slug
  );

  const { screenWidth } = useScreen();

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

  if (isLoading || sidebarLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-primary-500">
        <Spinner color="primary" size="md" />
      </div>
    );
  }

  if (!findChannel || !thread || error) {
    return (
      <div className="flex items-center justify-center flex-col gap-1 h-[70vh] select-none w-full">
        <Image
          src="/not_found.png"
          width={220}
          height={200}
          alt="Channel not found"
          className="rounded-md object-cover"
          draggable={false}
        />
        <div className="text-center space-y-2 w-72">
          <h3 className="font-bold text-base">Channel not found</h3>
          <p className="text-sm text-text-600 pb-4">
            The channel doesn&apos;t seem to exist or you don&apos;t have
            permission to access it.
          </p>
          <Link href="/app">
            <Button>Go back to home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ThreadWrapper channel={findChannel} thread={thread}>
      <div className="flex h-full">
        {screenWidth > 768 && (
          <div className="border-r border-text-100 w-[25%]">
            {threads.length > 0 ? (
              <div>
                <div className="flex items-center justify-between border-b border-text-100 p-2 px-4">
                  <h2 className="font-semibold">Threads</h2>

                  <Link
                    href={`/app/ch/${findChannel.slug}/th/new`}
                    className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 transition text-sm flex items-center gap-1 px-2 py-1 rounded-lg"
                  >
                    <Plus size={16} strokeWidth={2} />
                    Create Thread
                  </Link>
                </div>

                <ScrollArea className="h-[calc(100vh-110px)] pb-2">
                  {threads.map((thread) => (
                    <div key={thread.id}>
                      <ThreadCard
                        channel_slug={channel_slug}
                        thread={thread as ThreadType}
                      />
                    </div>
                  ))}
                </ScrollArea>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-col gap-1 h-[70vh] select-none w-full">
                <Image
                  src="/not_found.png"
                  width={220}
                  height={200}
                  alt="Channel not found"
                  className="rounded-md object-cover"
                  draggable={false}
                />
                <div className="text-center space-y-2 w-72">
                  <h3 className="font-bold text-base">No threads found</h3>
                  <p className="text-sm text-text-600 pb-4">
                    Click the button below to <br /> create your first thread.
                  </p>
                  <Link href={`/app/ch/${findChannel.slug}/th/new`}>
                    <Button>
                      <Edit size={16} strokeWidth={2} />
                      Create Thread
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="w-full md:w-[75%] flex flex-col">
          <div className="h-[calc(100vh-170px)] overflow-y-auto flex flex-col justify-end">
            <div className="p-4 md:p-6 pt-8">
              <h1 className="text-2xl md:text-3xl font-bold">{thread.title}</h1>
              <div className="flex items-center gap-1 text-xs">
                <p className="text-text-500">1 participant</p>
                <p>•</p>
                <Link
                  href={`/app/ch/${channel_slug}`}
                  className="text-primary-500 hover:underline"
                >
                  #{findChannel.name}
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
                    <div
                      key={dateGroup.date.toISOString()}
                      className="space-y-4"
                    >
                      <div className="flex items-center">
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

          <ReplyEditor
            thread_id={thread.id}
            setReplies={setReplies}
            replies={replies}
          />
        </div>
      </div>
    </ThreadWrapper>
  );
};

export default ThreadDetailsPage;
