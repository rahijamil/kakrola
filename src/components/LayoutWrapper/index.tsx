"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import CommentOrActivityModal from "./CommentOrActivityModal";
import ActiveProjectMoreOptions from "./ActiveProjectMoreOptions";
import ViewOptions from "./ViewOptions";
import ShareOption from "./ShareOption";
import DocsSidebar from "../DocsSidebar";
import { ViewTypes } from "@/types/viewTypes";
import {
  Ellipsis,
  MessageSquare,
  SlidersHorizontal,
  UserPlus,
} from "lucide-react";
import { ProjectType } from "@/types/project";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";

const LayoutWrapper = ({
  children,
  headline,
  project,
  showShareOption,
  setShowShareOption,
  hideCalendarView,
  view,
  setView,
}: {
  children: React.ReactNode;
  headline: string;
  project?: ProjectType;
  view?: ViewTypes["view"];
  setView?: (value: ViewTypes["view"]) => void;
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
  hideCalendarView?: boolean;
}) => {
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [showViewOptions, setShowViewOptions] = useState<boolean>(false);
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const [showCommentOrActivity, setShowCommentOrActivity] = useState<
    "comment" | "activity" | null
  >(null);

  const [projectTitle, setProjectTitle] = useState<string>(
    project?.name || headline
  );

  const { setProjects } = useTaskProjectDataProvider();

  return (
    <>
      {headline == "Docs" && <DocsSidebar />}

      <main className="flex-1 overflow-auto flex flex-col">
        {view && setView && (
          <div className="flex items-center justify-between p-4">
            {!["Today", "Inbox"].includes(headline) && <div>My Projects /</div>}

            <div className="flex-1 flex items-center justify-end">
              <ul className="flex items-center relative">
                {typeof setShowShareOption === "function" &&
                  headline !== "Today" && (
                    <li>
                      <button
                        className={`${
                          showShareOption ? "bg-gray-100" : "hover:bg-gray-100"
                        }  transition p-1 pr-3 rounded-md cursor-pointer flex items-center gap-1`}
                        onClick={() => setShowShareOption(true)}
                      >
                        <UserPlus
                          strokeWidth={1.5}
                          className="w-5 h-5 text-gray-500"
                        />
                        Share
                      </button>

                      {showShareOption && (
                        <ShareOption
                          onClose={() => setShowShareOption(false)}
                        />
                      )}
                    </li>
                  )}
                <li>
                  <button
                    className={`${
                      showViewOptions ? "bg-gray-100" : "hover:bg-gray-100"
                    }  transition p-1 pr-3 rounded-md cursor-pointer flex items-center gap-1`}
                    onClick={() => setShowViewOptions(true)}
                  >
                    <SlidersHorizontal
                      strokeWidth={1.5}
                      className="w-5 h-5 text-gray-500"
                    />
                    View
                  </button>

                  {showViewOptions && (
                    <ViewOptions
                      onClose={() => setShowViewOptions(false)}
                      hideCalendarView={hideCalendarView}
                      view={view}
                      setView={setView}
                    />
                  )}
                </li>

                {headline !== "Today" && (
                  <>
                    <li>
                      <button
                        className={`${
                          showCommentOrActivity
                            ? "bg-gray-100"
                            : "hover:bg-gray-100"
                        } transition p-1 rounded-md cursor-pointer`}
                        onClick={() => setShowCommentOrActivity("comment")}
                      >
                        <MessageSquare
                          strokeWidth={1.5}
                          className="w-5 h-5 text-gray-500"
                        />
                      </button>

                      {showCommentOrActivity && project && (
                        <CommentOrActivityModal
                          onClose={() => setShowCommentOrActivity(null)}
                          showCommentOrActivity={showCommentOrActivity}
                          setShowCommentOrActivity={setShowCommentOrActivity}
                          project={project}
                        />
                      )}
                    </li>
                    <li>
                      <button
                        className={`${
                          showMoreOptions ? "bg-gray-100" : "hover:bg-gray-100"
                        } transition p-1 rounded-md cursor-pointer`}
                        onClick={() => setShowMoreOptions(true)}
                      >
                        <Ellipsis
                          strokeWidth={1.5}
                          className="w-5 h-5 text-gray-500"
                        />
                      </button>

                      {showMoreOptions && project && (
                        <ActiveProjectMoreOptions
                          onClose={() => setShowMoreOptions(false)}
                          project={project}
                        />
                      )}
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

        <div
          className={`flex-1 ${
            view !== "Board" && "max-w-4xl w-full mx-auto p-8 pt-0"
          }`}
        >
          <div className="flex flex-col h-full">
            <div
              className={`mb-6 ${view == "Board" && "mx-8"} ${
                !setView && "pt-8"
              }`}
            >
              {project ? (
                <>
                  {editTitle ? (
                    <input
                      type="text"
                      className={`text-2xl font-bold border border-gray-400 outline-none capitalize w-full rounded-md p-1`}
                      value={projectTitle}
                      onBlur={() => setEditTitle(false)}
                      autoFocus
                      onChange={(ev) => setProjectTitle(ev.target.value)}
                      onKeyDown={(ev) => {
                        if (ev.key == "Enter" && project) {
                          setProjects((prevProjects) =>
                            prevProjects.map((p) =>
                              p.id == project.id
                                ? { ...p, name: projectTitle }
                                : p
                            )
                          );

                          setEditTitle(false);
                        }
                      }}
                    />
                  ) : (
                    <h1
                      className={`text-2xl font-bold border border-transparent w-fit hover:w-full hover:border-gray-200 capitalize rounded-md p-1 ${
                        !setView && "pt-8"
                      }`}
                      onClick={() => setEditTitle(true)}
                    >
                      {project.name}
                    </h1>
                  )}
                </>
              ) : (
                <h1
                  className={`text-2xl font-bold capitalize ${
                    !setView && "pt-8"
                  }`}
                >
                  {headline}
                </h1>
              )}
            </div>

            <div className="flex-1">{children}</div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LayoutWrapper;
