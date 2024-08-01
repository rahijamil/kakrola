"use client";
import Sidebar from "@/components/Sidebar";
import {
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import React, { Dispatch, SetStateAction, useState } from "react";
import CommentOrActivityModal from "./CommentOrActivityModal";
import ActiveProjectMoreOptions from "./ActiveProjectMoreOptions";
import ViewOptions from "./ViewOptions";
import ShareOption from "./ShareOption";
import { ViewTypes } from "@/types/viewTypes";

const LayoutWrapper = ({
  children,
  headline,
  view,
  setView,
  isProject,
  showShareOption,
  setShowShareOption,
  hideCalendarView
}: {
  children: React.ReactNode;
  headline: string;
  view?: ViewTypes["view"];
  setView?: Dispatch<SetStateAction<ViewTypes["view"]>>;
  isProject?: boolean;
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
  hideCalendarView?: boolean
}) => {
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [showViewOptions, setShowViewOptions] = useState<boolean>(false);
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const [showCommentOrActivity, setShowCommentOrActivity] = useState<
    "comment" | "activity" | null
  >(null);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <main className="flex-1 overflow-auto flex flex-col">
        {setView && (
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
                        <UserPlusIcon className="w-6 h-6 text-gray-500" />
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
                    <AdjustmentsHorizontalIcon className="w-6 h-6 text-gray-500" />
                    View
                  </button>

                  {showViewOptions && (
                    <ViewOptions
                      onClose={() => setShowViewOptions(false)}
                      view={view}
                      setView={setView}
                      hideCalendarView={hideCalendarView}
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
                        <ChatBubbleLeftIcon className="w-6 h-6 text-gray-500" />
                      </button>

                      {showCommentOrActivity && (
                        <CommentOrActivityModal
                          onClose={() => setShowCommentOrActivity(null)}
                          showCommentOrActivity={showCommentOrActivity}
                          setShowCommentOrActivity={setShowCommentOrActivity}
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
                        <EllipsisHorizontalIcon className="w-6 h-6 text-gray-500" />
                      </button>

                      {showMoreOptions && (
                        <ActiveProjectMoreOptions
                          onClose={() => setShowMoreOptions(false)}
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
              {isProject ? (
                <>
                  {editTitle ? (
                    <input
                      type="text"
                      className={`text-2xl font-bold border border-gray-400 outline-none capitalize w-full rounded-md p-1`}
                      value={headline}
                      onBlur={() => setEditTitle(false)}
                      autoFocus
                    />
                  ) : (
                    <h1
                      className={`text-2xl font-bold border border-transparent w-fit hover:w-full hover:border-gray-200 capitalize rounded-md p-1 ${
                        !setView && "pt-8"
                      }`}
                      onClick={() => setEditTitle(true)}
                    >
                      {headline}
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
    </div>
  );
};

export default LayoutWrapper;
