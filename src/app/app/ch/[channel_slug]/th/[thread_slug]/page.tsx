"use client";

import React from "react";
import ThreadWrapper from "../ThreadWrapper";
import { ChannelType } from "@/types/channel";
import useThread from "./useThread";
import Spinner from "@/components/ui/Spinner";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Thread from "../../Thread";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

const ThreadDetailsPage = ({
  params: { channel_slug },
}: {
  params: { channel_slug: string; thread_slug: string };
}) => {
  const { channels, sidebarLoading } = useSidebarDataProvider();
  const findChannel = channels.find(
    (channel: ChannelType) => channel.slug === channel_slug
  );

  const pathname = usePathname();
  const threadSlug =
    pathname === `/app/ch/${channel_slug}/th/new`
      ? null
      : pathname.split("/").pop();

  const {
    thread,
    replies,
    setReplies,
    error,
    isLoading,
    threadProfile,
    groupedReplies,
    showOptions,
    setShowOptions,
  } = useThread(findChannel?.id, threadSlug);

  if (threadSlug !== null && (isLoading || sidebarLoading)) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-primary-500">
        <Spinner color="current" size="md" />
      </div>
    );
  }

  if (!findChannel || (threadSlug !== null && (!thread || error))) {
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
          <h3 className="font-bold text-base">Thread not found</h3>
          <p className="text-sm text-text-600 pb-4">
            The thread doesn&apos;t seem to exist or you don&apos;t have
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
    <ThreadWrapper
      channel={findChannel}
      thread={threadSlug == thread?.slug ? thread : null}
    >
      <AnimatePresence>
        {thread && threadSlug === thread.slug ? (
          <Thread
            channel={findChannel}
            thread={thread}
            replies={replies}
            setReplies={setReplies}
            showOptions={showOptions}
            setShowOptions={setShowOptions}
            threadProfile={threadProfile}
            groupedReplies={groupedReplies}
            channel_slug={channel_slug}
          />
        ) : null}
      </AnimatePresence>
    </ThreadWrapper>
  );
};

export default ThreadDetailsPage;
