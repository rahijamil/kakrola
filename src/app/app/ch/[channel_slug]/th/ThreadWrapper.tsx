import ShareOption from "@/components/LayoutWrapper/ShareOption";
import { Button } from "@/components/ui/button";
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
import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import AddNewThread from "./new/AddNewThread";
import useAddThread from "./new/useAddThread";
import Spinner from "@/components/ui/Spinner";
import { motion } from "framer-motion";
import ActiveChannelMoreOptions from "./ActiveChannelMoreOptions";
import DeleteConfirm from "@/components/SidebarWrapper/Sidebar/DeleteConfirm";
import ArchiveConfirm from "@/components/SidebarWrapper/Sidebar/ArchiveConfirm";
import CommentOrActivityModal from "@/components/LayoutWrapper/CommentOrActivityModal";

const ThreadWrapper = ({
  channel,
  children,
  thread,
}: {
  channel: ChannelType;
  children: React.ReactNode;
  thread?: ThreadType | null;
}) => {
  const { screenWidth } = useScreen();

  const pathname = usePathname();

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

  const motionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  };

  const motionPropsForMobile = {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { duration: 0.3, ease: "easeInOut", type: "spring" },
  };

  const triggerRef = useRef(null);

  const [modalState, setModalState] = useState({
    projectEdit: false,
    saveTemplate: false,
    showImportFromCSV: false,
    showExportAsCSV: false,
    showCommentOrActivity: null as "comment" | "activity" | null,
    showArchiveConfirm: false,
    showDeleteConfirm: false,
    editTitle: false,
    leaveConfirm: false,
  });

  const toggleModal = (key: keyof typeof modalState, value: boolean | null) =>
    setModalState((prev) => ({ ...prev, [key]: value }));

  if (
    !thread &&
    screenWidth <= 768 &&
    pathname !== `/app/ch/${channel.slug}/th/new`
  ) {
    return null;
  }

  return (
    <>
      <motion.div
        {...(screenWidth > 768 ? motionProps : motionPropsForMobile)}
        className={`flex flex-col h-full w-full flex-1 fixed inset-0 bg-background z-10 md:z-auto md:inset-auto md:static ${
          !thread ? "thread-wrapper" : ""
        }`}
        onContextMenu={(e) => e.preventDefault()}
      >
        {pathname !== `/app/ch/${channel.slug}` && (
          <div
            className={`flex items-center justify-between gap-3 md:gap-4 border-b border-text-100 bg-background z-10 select-none h-[53px] ${
              screenWidth > 768 ? "py-3 px-6" : thread ? "px-3 py-1" : "p-3"
            }`}
          >
            {!thread && pathname === `/app/ch/${channel.slug}/th/new` ? (
              screenWidth > 768 ? (
                <>
                  <div className="flex items-center justify-center">
                    <p className="font-semibold text-lg">New Thread</p>
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <Button
                      onClick={() =>
                        window.history.pushState(
                          null,
                          "",
                          `/app/ch/${channel.slug}`
                        )
                      }
                      disabled={loading}
                      type="button"
                      variant="outline"
                      color="gray"
                    >
                      Discard
                    </Button>

                    <Button
                      onClick={handleAddThread}
                      disabled={
                        loading || !threadTitle.trim() || charsCount === 0
                      }
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
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() =>
                        window.history.pushState(
                          null,
                          "",
                          `/app/ch/${channel.slug}`
                        )
                      }
                      disabled={loading}
                      type="button"
                      className="w-6 h-6"
                    >
                      <ChevronLeft strokeWidth={1.5} size={24} />
                    </button>

                    <p className="font-semibold">New Thread</p>
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    {/* <button
                      onClick={() =>
                        window.history.pushState(
                          null,
                          "",
                          `/app/ch/${channel.slug}`
                        )
                      }
                      disabled={loading}
                      type="button"
                      className="flex items-center gap-2 bg-text-100 text-text-700 hover:text-text-900 p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                    >
                      <X size={20} />
                    </button> */}

                    <button
                      onClick={handleAddThread}
                      disabled={
                        loading || !threadTitle.trim() || charsCount === 0
                      }
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
            ) : screenWidth > 768 ? (
              thread && (
                <div className="flex items-center justify-center">
                  <h2 className="font-semibold text-lg">{thread.title}</h2>
                </div>
              )
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    window.history.pushState(
                      null,
                      "",
                      `/app/ch/${channel.slug}`
                    );
                  }}
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

            {thread && (
              <div className={`flex items-center justify-end  h-full`}>
                <div className="flex items-center h-full" ref={triggerRef}>
                  {screenWidth > 768 && (
                    <ShareOption
                      triggerRef={triggerRef}
                      teamId={channel.team_id}
                    />
                  )}

                  {/* <button className="text-text-500 md:hover:bg-text-100 md:px-2 p-1 justify-center md:rounded-lg transition flex items-center gap-1">
                  <Headphones
                    strokeWidth={1.5}
                    size={screenWidth > 768 ? 16 : 20}
                  />
                  <span className="hidden md:inline-block">Huddle</span>
                </button> */}

                  {screenWidth > 768 && (
                    <ActiveChannelMoreOptions
                      triggerRef={triggerRef}
                      channel={channel}
                      thread={thread}
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
                        setShowLeaveConfirm: (value) =>
                          toggleModal("leaveConfirm", value as boolean),
                      }}
                    />
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
        )}

        <div className={`flex-1`}>
          {!thread && pathname === `/app/ch/${channel.slug}/th/new` && (
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
      </motion.div>

      {modalState.showDeleteConfirm && (
        <DeleteConfirm
          setShowDeleteConfirm={() =>
            setModalState((prev) => ({ ...prev, showDeleteConfirm: false }))
          }
          thread={thread}
        />
      )}

      {modalState.showArchiveConfirm && (
        <ArchiveConfirm
          setShowArchiveConfirm={() =>
            setModalState((prev) => ({ ...prev, showArchiveConfirm: false }))
          }
          thread={thread}
        />
      )}

      {modalState.showCommentOrActivity && (
        <CommentOrActivityModal
          onClose={() =>
            setModalState((prev) => ({ ...prev, showCommentOrActivity: null }))
          }
          showCommentOrActivity={modalState.showCommentOrActivity}
          setShowCommentOrActivity={() =>
            setModalState((prev) => ({ ...prev, showCommentOrActivity: null }))
          }
          thread={thread}
        />
      )}
    </>
  );
};

export default ThreadWrapper;
