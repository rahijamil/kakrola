"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Spinner from "@/components/ui/Spinner";
import { Link } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import { ChannelType } from "@/types/channel";
import ThreadWrapper from "./th/ThreadWrapper";
import { usePathname } from "next/navigation";
import useThread from "./th/[thread_slug]/useThread";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { AnimatePresence } from "framer-motion";
import Thread from "./Thread";

const ChannelDetails = ({
  params: { channel_slug },
}: {
  params: { channel_slug: string };
}) => {
  const [notFound, setNotFound] = useState<boolean>(false);
  const { channels, sidebarLoading } = useSidebarDataProvider();
  const channel = channels.find(
    (channel: ChannelType) => channel.slug === channel_slug
  );

  const pathname = usePathname();
  const threadSlug =
    pathname === `/app/ch/${channel_slug}/th/new`
      ? null
      : pathname.split("/").pop();

  // const { channel, isPending, isError } = useChannelDetails(channel_slug);
  const {
    thread,
    replies,
    setReplies,
    showOptions,
    setShowOptions,
    threadProfile,
    groupedReplies,
  } = useThread(channel?.id, threadSlug);

  useEffect(() => {
    if (!sidebarLoading && !channel?.id) {
      setNotFound(true);
    }
  }, [sidebarLoading, channel]);

  useEffect(() => {
    if (channel?.id) {
      document.title = `${channel.name} - Kakrola`;
    } else {
      document.title = "Kakrola";
    }
  }, [channel]);

  if (sidebarLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-primary-500">
        <Spinner color="current" size="md" />
      </div>
    );
  }

  if (notFound) {
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
          <p className="text-text-600 pb-4">
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

  if (channel?.id) {
    return (
      <ThreadWrapper channel={channel} thread={thread}>
        {pathname === `/app/ch/${channel.slug}` ? (
          <div className="flex flex-col items-center justify-center gap-4 h-full">
            <Image
              src="/images/thread.png"
              width={180}
              height={100}
              alt="Channel not found"
              className="rounded-md object-cover"
              draggable={false}
            />

            <div className="space-y-2 text-center">
              <h2 className="font-semibold mb-2 text-lg">Select a thread</h2>
              <p className="text-text-600 text-center">
                Threads keep discussions on-topic.
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {thread && threadSlug === thread.slug ? (
              <Thread
                channel={channel}
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
        )}
      </ThreadWrapper>
    );
  } else {
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
          <p className="text-text-600 pb-4">
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
};

export default ChannelDetails;
