import FilterOptions from "@/components/LayoutWrapper/FilterOptions";
import ShareOption from "@/components/LayoutWrapper/ShareOption";
import { Button } from "@/components/ui/button";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import useScreen from "@/hooks/useScreen";
import { ChannelType, ThreadType } from "@/types/channel";
import { Check, ChevronLeft, Hash, SendHorizonal, X } from "lucide-react";
import Image from "next/image";
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
  } = useAddThread({ channel });

  return (
    <div
      className={`flex flex-col h-full w-full flex-1 transition-all duration-300 thread-wrapper`}
    >
      <div
        className={`flex items-center justify-between border-b border-text-100 ${
          screenWidth > 768 ? "py-3 px-6" : "p-3"
        }`}
      >
        <div className="flex items-center gap-3">
          <Link
            href={`/app/ch/${channel.slug}`}
            className="flex items-center gap-2 rounded-lg p-1 pr-2.5 text-text-700 hover:text-text-900 hover:bg-text-100 transition-all"
          >
            <ChevronLeft strokeWidth={1.5} size={24} />

            <h1 className="font-medium">{channel.name}</h1>
          </Link>
        </div>

        {!thread &&
          (screenWidth > 768 ? (
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
                  disabled={loading || !threadTitle.trim()}
                  type="button"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner color="white" size="sm" />

                      <span>Creating...</span>
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
                  disabled={loading || !threadTitle.trim()}
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
          ))}

        {thread && (
          <div className={`flex items-center justify-end flex-1`}>
            <ul className="flex items-center">
              {/* <li>
        <Button icon={Edit} size="xs" onClick={() => router.push(`/app/ch/${channel.slug}/th/new`)}>
          New Thread
        </Button>
      </li> */}
              <li>
                <ShareOption projectId={null} />
              </li>

              {screenWidth > 768 && (
                <li>
                  <FilterOptions
                    hideCalendarView={true}
                    // setTasks={setTasks}
                    // tasks={tasks}
                  />
                </li>
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
            </ul>
          </div>
        )}
      </div>

      <div className={`flex-1`}>
        <AddNewThread
          channel={channel}
          threadTitle={threadTitle}
          setThreadTitle={setThreadTitle}
          threadContent={threadContent}
          setThreadContent={setThreadContent}
          error={error}
        />

        {children}
      </div>
    </div>
  );
};

export default ThreadWrapper;
