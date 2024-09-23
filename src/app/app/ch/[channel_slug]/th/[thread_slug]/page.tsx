"use client";

import React, { useEffect, useState } from "react";
import ThreadWrapper from "../ThreadWrapper";
import { ChannelType } from "@/types/channel";
import useThread from "./useThread";
import { notFound } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import Link from "next/link";
import Image from "next/image";
import { ProfileType } from "@/types/user";
import { getProfileById } from "@/lib/queries";
import NovelEditor from "@/components/NovelEditor";
import { EditorContent, EditorRoot } from "novel";
import { defaultExtensions } from "@/components/NovelEditor/extensions";
import { formatDistanceToNow } from "date-fns";
import { defaultEditorContent } from "@/components/NovelEditor/content";
import { MoreVertical, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthProvider } from "@/context/AuthContext";
import ReplyCard from "./ReplyCard";

const ThreadDetailsPage = ({
  params: { channel_slug, thread_slug },
}: {
  params: { channel_slug: string; thread_slug: string };
}) => {
  const { channels } = useSidebarDataProvider();
  const findChannel = channels.find(
    (channel: ChannelType) => channel.slug === channel_slug
  );
  const [threadProfile, setThreadProfile] = useState<ProfileType | null>(null);
  const [replyProfiles, setReplyProfiles] = useState<ProfileType[]>([]);

  const { thread, replies, error, isLoading } = useThread(
    findChannel?.id,
    thread_slug
  );

  const { profile } = useAuthProvider();

  useEffect(() => {
    if (thread?.profile_id) {
      const fetchProfile = async () => {
        try {
          const profile = await getProfileById(thread.profile_id);
          setThreadProfile(profile);
        } catch (error) {
          console.log(error);
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
        setReplyProfiles(profiles);
      };
      fetchReplyProfiles();
    }
  }, [replies]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-primary-500">
        <Spinner color="primary" size="md" />
      </div>
    );
  }

  if (!findChannel || !thread) {
    return null;
  }

  if (error) {
    notFound();
  }

  return (
    <ThreadWrapper channel={findChannel} thread={thread}>
      <div className="p-6 pb-8 flex flex-col justify-end h-full">
        <div className="space-y-10">
          <div>
            <h1 className="text-3xl font-bold">{thread.title}</h1>
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

          <div className="space-y-6">
            {threadProfile && thread.created_at && thread.content && (
              <ReplyCard
                profile={threadProfile}
                created_at={thread.created_at}
                is_edited={thread.is_edited}
                content={thread.content}
              />
            )}

            {replies && replies.length > 0 && (
              <div className="h-px w-full bg-text-100"></div>
            )}
          </div>

          <div className="space-y-6">
            {replies?.map((reply) => {
              const replyProfile = replyProfiles.find(
                (profile) => profile.id === reply.profile_id
              );

              if (replyProfile && reply.created_at && reply.content) {
                return (
                  <ReplyCard
                    key={reply.id}
                    profile={replyProfile}
                    created_at={reply.created_at}
                    is_edited={reply.is_edited}
                    content={reply.content}
                  />
                );
              }
            })}
          </div>
        </div>

        <div className="border border-primary-50 bg-primary-10 rounded-lg p-4 overflow-hidden flex flex-col">
          <div className="flex-1 reply-editor">
            <NovelEditor content={null} handleSave={() => {}} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1">
              {/* <SmilePlus size={16} /> */}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" color="gray" size="sm">
                Discard
              </Button>
              <Button size="sm">Post</Button>
            </div>
          </div>
        </div>
      </div>
    </ThreadWrapper>
  );
};

export default ThreadDetailsPage;
