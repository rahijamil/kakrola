import FilterOptions from "@/components/LayoutWrapper/FilterOptions";
import ShareOption from "@/components/LayoutWrapper/ShareOption";
import { Button } from "@/components/ui/button";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import useScreen from "@/hooks/useScreen";
import { ChannelType, ThreadType } from "@/types/channel";
import { ChevronLeft, Headphones, SendHorizonal, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import AddNewThread from "./new/AddNewThread";
import useAddThread from "./new/useAddThread";
import Spinner from "@/components/ui/Spinner";

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
        className={`flex items-center justify-between gap-4 border-b border-text-100 ${
          screenWidth > 768 ? "py-3 px-6" : thread ? "px-3 py-1" : "p-3"
        }`}
      >
        <div className="flex items-center gap-3">
          <Link
            href={`/app/ch/${channel.slug}`}
            className="flex items-center gap-2 rounded-lg p-1 pr-2.5 text-text-700 hover:text-text-900 hover:bg-text-100 transition-all"
          >
            <ChevronLeft strokeWidth={1.5} size={24} />

            <div>
              {screenWidth <= 768 && thread && (
                <h2 className="font-semibold md:text-lg">{thread.title}</h2>
              )}
              <h3 className="font-normal md:font-medium text-text-500 md:text-text-900">
                <span>#</span>
                {channel.name}
              </h3>
            </div>
          </Link>
        </div>

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
          <div className={`flex items-center justify-end`}>
            <ul className="flex items-center">
              <li>
                <button className="text-text-500 hover:bg-text-100 px-2 p-1 rounded-lg transition flex items-center gap-1">
                  <Headphones strokeWidth={1.5} size={20} />

                  <span className="hidden md:inline-block">Huddle</span>
                </button>
              </li>

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
            </ul>
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
