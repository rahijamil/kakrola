"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Spinner from "@/components/ui/Spinner";
import { Link } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import useChannelDetails from "@/hooks/useChannelDetails";
import ChannelWrapper from "./ChannelWrapper";
import { ChannelType } from "@/types/channel";

const ChannelDetails = ({
  params: { channel_slug },
}: {
  params: { channel_slug: string };
}) => {
  const [notFound, setNotFound] = useState<boolean>(false);

  const { channel, isPending, isError } =
    useChannelDetails(channel_slug);


  useEffect(() => {
    if (!isPending && !channel?.id) {
      setNotFound(true);
    }
  }, [isPending, channel]);

  useEffect(() => {
    if (channel?.id) {
      document.title = `${channel.name} - Kakrola`;
    } else {
      document.title = "Kakrola";
    }
  }, [channel]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-primary-500">
        <Spinner color="current" size="md" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p>Error loading channel details</p>
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
      <ChannelWrapper channel={channel as ChannelType}>
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
      </ChannelWrapper>
    );
  } else {
    return <div>No channel found</div>;
  }
};

export default ChannelDetails;
