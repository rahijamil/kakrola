import FilterOptions from "@/components/LayoutWrapper/FilterOptions";
import ShareOption from "@/components/LayoutWrapper/ShareOption";
import { Button } from "@/components/ui/button";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import useScreen from "@/hooks/useScreen";
import { ChannelType, ThreadType } from "@/types/channel";
import {
  ChevronLeft,
  Hash,
  Headphones,
  MoreHorizontal,
  MoreVertical,
  SendHorizonal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import AddNewThread from "./new/AddNewThread";
import useAddThread from "./new/useAddThread";
import Spinner from "@/components/ui/Spinner";
import Image from "next/image";

const ThreadWrapper = ({
  channel,
  children,
  thread,
}: {
  channel: ChannelType;
  children: React.ReactNode;
  thread?: ThreadType;
}) => {
  const { screenWidth } = useScreen();
  const { teams } = useSidebarDataProvider();
  const team = teams.find((t) => t.id === channel.team_id);

  const router = useRouter();

  const {
    threadTitle,
    setThreadTitle,
    threadContent,
    setThreadContent,
    error,
    handleAddThread,
    loading,
    setCharsCount,
    charsCount,
  } = useAddThread({ channel });

  return (
    <div
      className={`flex flex-col h-full w-full flex-1 transition-all duration-300 ${
        !thread ? "thread-wrapper" : ""
      }`}
    >
      <div
        className={`flex items-center justify-between gap-3 md:gap-4 border-b border-text-100 bg-background z-10 ${
          screenWidth > 768 ? "py-3 px-6" : thread ? "px-3 py-1" : "p-3"
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

            <button className="text-left bg-text-10 p-1 px-2 rounded-lg">
              {screenWidth <= 768 && thread && (
                <h2 className="font-semibold md:text-lg text-text-900 line-clamp-1">
                  {thread.title}
                </h2>
              )}
              <h3 className="font-normal md:font-medium text-text-500 md:text-text-900 text-xs flex items-center gap-1">
                <div>
                  <span>#</span>
                  {channel.name}
                </div>
                <span>•</span>
                <span>More</span>
              </h3>
            </button>
          </div>
        )}

        {!thread ? (
          screenWidth > 768 ? (
            <>
              <div className="flex items-center justify-center">
                <p className="font-semibold text-lg">New Thread</p>
              </div>

              <div className="flex items-center justify-end gap-4">
                <Button
                  onClick={() => router.push(`/app/ch/${channel.slug}`)}
                  disabled={loading}
                  type="button"
                  variant="outline"
                  color="gray"
                >
                  Discard
                </Button>

                <Button
                  onClick={handleAddThread}
                  disabled={loading || !threadTitle.trim() || charsCount === 0}
                  type="button"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner color="white" size="sm" />

                      <span>Posting...</span>
                    </div>
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={() => router.push(`/app/ch/${channel.slug}`)}
                  disabled={loading}
                  type="button"
                  className="flex items-center gap-2 bg-text-100 text-text-700 hover:text-text-900 p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  <X size={20} />
                </button>

                <button
                  onClick={handleAddThread}
                  disabled={loading || !threadTitle.trim() || charsCount === 0}
                  type="button"
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-surface p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner color="white" size="sm" />
                    </div>
                  ) : (
                    <SendHorizonal size={20} />
                  )}
                </button>
              </div>
            </>
          )
        ) : (
          <div className="hidden md:flex items-center justify-center">
            <h2 className="font-semibold text-lg">{thread.title}</h2>
          </div>
        )}

        {thread && (
          <div className={`flex items-center justify-end  h-full`}>
            <div className="flex items-center h-full">
              {screenWidth > 768 && <ShareOption projectId={null} />}

              <button className="text-text-500 md:hover:bg-text-100 md:px-2 p-1 justify-center md:rounded-lg transition flex items-center gap-1">
                <Headphones
                  strokeWidth={1.5}
                  size={screenWidth > 768 ? 16 : 24}
                />
                <span className="hidden md:inline-block">Huddle</span>
              </button>

              {screenWidth > 768 && (
                <button className="text-text-500 hover:bg-text-100 px-2 p-1 md:rounded-lg transition flex items-center gap-1">
                  <MoreVertical strokeWidth={1.5} size={16} />
                </button>
              )}

              {/* <li>
              {project && (
                <ActiveProjectMoreOptions
                  project={project}
                  stateActions={{
                    setProjectEdit: (value) =>
                      toggleModal("projectEdit", value as boolean),
                    setSaveTemplate: (value) =>
                      toggleModal("saveTemplate", value as boolean),
                    setImportFromCSV: (value) =>
                      toggleModal("showImportFromCSV", value as boolean),
                    setExportAsCSV: (value) =>
                      toggleModal("showExportAsCSV", value as boolean),
                    setShowArchiveConfirm: (value) =>
                      toggleModal("showArchiveConfirm", value as boolean),
                    setShowDeleteConfirm: (value) =>
                      toggleModal("showDeleteConfirm", value as boolean),
                    setShowCommentOrActivity: (value) =>
                      toggleModal("showCommentOrActivity", value as null),
                  }}
                />
              )}
            </li> */}
            </div>
          </div>
        )}
      </div>

      <div className={`flex-1`}>
        {!thread && (
          <AddNewThread
            channel={channel}
            threadTitle={threadTitle}
            setThreadTitle={setThreadTitle}
            threadContent={threadContent}
            setThreadContent={setThreadContent}
            error={error}
            setCharsCount={setCharsCount}
          />
        )}

        {children}
      </div>
    </div>
  );
};

export default ThreadWrapper;
