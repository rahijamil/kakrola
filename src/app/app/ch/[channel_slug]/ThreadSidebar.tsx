"use client";

import useChannelDetails from "@/hooks/useChannelDetails";
import { ChevronLeft, Edit, Plus } from "lucide-react";
import Image from "next/image";
import React from "react";
import ThreadCard from "./ThreadCard";
import { ThreadType } from "@/types/channel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useScreen from "@/hooks/useScreen";
import { usePathname, useRouter } from "next/navigation";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileType } from "@/types/user";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ThreadWithProfile extends ThreadType {
  profiles: {
    id: ProfileType["id"];
    avatar_url: ProfileType["avatar_url"];
    full_name: ProfileType["full_name"];
    email: ProfileType["email"];
  };
}

const ThreadSidebar = ({ channel_slug }: { channel_slug: string }) => {
  const { threads, isLoading } = useChannelDetails(channel_slug);
  const { channels, teams } = useSidebarDataProvider();
  const { screenWidth } = useScreen();
  const router = useRouter();

  const channel = channels.find((c) => c.slug === channel_slug);
  if (!channel) return null;

  const team = teams.find((t) => t.id === channel.team_id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut", type: "spring" }}
        className="md:border-r border-text-100 min-w-full md:min-w-[25%] md:w-1/4 max-w-[400px] select-none md:shadow-[inset_-1rem_0_1rem_-1rem_rgba(0,0,0,0.1),inset_1rem_0_1rem_-1rem_rgba(0,0,0,0.1)]"
      >
        <div
          className={`border-b border-text-100 h-[53px] ${
            screenWidth > 768 ? "py-3 px-6" : "p-3"
          }`}
        >
          {screenWidth > 768 ? (
            <div className="flex items-center w-64 whitespace-nowrap gap-1">
              <Link
                href={`/app/projects`}
                className="hover:bg-text-100 p-1 py-0.5 rounded-lg transition-colors flex items-center gap-1"
              >
                {team ? (
                  <>
                    {team.avatar_url ? (
                      <Image
                        src={team.avatar_url}
                        alt={team.name}
                        width={20}
                        height={20}
                        className="rounded-md"
                      />
                    ) : (
                      <div className="w-5 h-5 min-w-5 min-h-5 bg-primary-500 rounded-md flex items-center justify-center">
                        <span className="text-surface text-[10px] font-bold">
                          {team.name?.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span
                      className={`font-medium transition overflow-hidden whitespace-nowrap text-ellipsis`}
                    >
                      {team.name}
                    </span>{" "}
                  </>
                ) : (
                  "Personal"
                )}
              </Link>
              <span className="text-text-400">/</span>

              <Link
                href={`/app/ch/${channel.slug}`}
                onClick={(ev) => {
                  ev.preventDefault();
                  window.history.pushState(null, "", `/app/ch/${channel_slug}`);
                }}
                className="font-medium text-text-900 hover:bg-text-100 rounded-lg p-1 py-0.5 transition cursor-pointer"
              >
                <span>#</span>
                {channel.name}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/app/ch/${channel.slug}`)}
                className="flex items-center text-text-700 transition p-1"
              >
                <ChevronLeft
                  strokeWidth={1.5}
                  size={24}
                  className="min-w-6 min-h-6"
                />
              </button>

              <div className="flex items-center w-64 whitespace-nowrap gap-1">
                <Link
                  href={`/app/projects`}
                  className="hover:bg-text-100 p-1 py-0.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  {team ? (
                    <>
                      {team.avatar_url ? (
                        <Image
                          src={team.avatar_url}
                          alt={team.name}
                          width={20}
                          height={20}
                          className="rounded-md"
                        />
                      ) : (
                        <div className="w-5 h-5 min-w-5 min-h-5 bg-primary-500 rounded-md flex items-center justify-center">
                          <span className="text-surface text-[10px] font-bold">
                            {team.name?.slice(0, 1).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span
                        className={`font-medium transition overflow-hidden whitespace-nowrap text-ellipsis`}
                      >
                        {team.name}
                      </span>{" "}
                    </>
                  ) : (
                    "Personal"
                  )}
                </Link>
                <span className="text-text-400">/</span>

                <Link
                  href={`/app/ch/${channel.slug}`}
                  className="font-medium text-text-900 hover:bg-text-100 rounded-lg p-1 py-0.5 transition cursor-pointer"
                >
                  <span>#</span>
                  {channel.name}
                </Link>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div>
            <div className="flex items-center justify-between border-b border-text-100 p-2 px-4">
              <h2 className="font-semibold">
                <Skeleton width={100} height={20} />
              </h2>

              <div className="px-2 py-1">
                <Skeleton width={100} height={20} />
              </div>
            </div>

            <div>
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex items-center p-4 gap-3">
                  <div className="w-9 h-9 min-w-9 min-h-9 rounded-lg object-cover">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="w-full h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : threads.length > 0 ? (
          <div>
            <div className="flex items-center justify-between border-b border-text-100 p-2 px-4">
              <h2 className="font-semibold">Threads</h2>

              <Link
                onClick={(ev) => {
                  ev.preventDefault();
                  window.history.pushState(
                    null,
                    "",
                    `/app/ch/${channel_slug}/th/new`
                  );
                }}
                href={`/app/ch/${channel_slug}/th/new`}
                className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 transition text-sm flex items-center gap-1 px-2 py-1 rounded-lg"
              >
                <Plus size={16} strokeWidth={2} />
                Create Thread
              </Link>
            </div>

            <div>
              {threads.map((thread) => (
                <div key={thread.id}>
                  <ThreadCard
                    channel_slug={channel_slug}
                    thread={thread as ThreadWithProfile}
                  />
                </div>
              ))}
            </div>
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
                Every discussion is a thread
              </p>
              <Link
                onClick={(ev) => {
                  ev.preventDefault();
                  window.history.pushState(
                    null,
                    "",
                    `/app/ch/${channel_slug}/th/new`
                  );
                }}
                href={`/app/ch/${channel_slug}/th/new`}
              >
                <Button>
                  <Edit size={16} strokeWidth={2} />
                  Create Thread
                </Button>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// const ThreadSidebarWrapper = ({ channel_slug }: { channel_slug: string }) => {
//   const pathname = usePathname();
//   const { screenWidth } = useScreen();

//   return screenWidth > 768 ? (
//     <ThreadSidebar channel_slug={channel_slug} />
//   ) : pathname === `/app/ch/${channel_slug}` ? (
//     <ThreadSidebar channel_slug={channel_slug} />
//   ) : null;
// };

export default ThreadSidebar;
