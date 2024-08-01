import React, { Dispatch, SetStateAction } from "react";
import { Dialog } from "../ui";
import { HashtagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import AddComentForm from "../TaskViewSwitcher/AddComentForm";
import Image from "next/image";

const CommentOrActivityModal = ({
  onClose,
  showCommentOrActivity,
  setShowCommentOrActivity,
}: {
  onClose: () => void;
  showCommentOrActivity: "comment" | "activity" | null;
  setShowCommentOrActivity: Dispatch<
    SetStateAction<"comment" | "activity" | null>
  >;
}) => {
  const { activeProject } = useTaskProjectDataProvider();

  return (
    <Dialog onClose={onClose} size="md">
      <div className="p-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HashtagIcon className="w-4 h-4" />
          {activeProject?.name}
        </div>

        <button
          className="p-1 hover:bg-gray-100 transition rounded-md"
          onClick={onClose}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4">
        <ul className="flex items-center p-1 rounded-full bg-gray-100 w-fit">
          <li
            className={`p-1 px-4 rounded-full font-medium cursor-pointer transition ${
              showCommentOrActivity === "comment" ? "bg-white" : ""
            }`}
            onClick={() => setShowCommentOrActivity("comment")}
          >
            Comments
          </li>
          <li
            className={`p-1 px-4 rounded-full font-medium cursor-pointer transition ${
              showCommentOrActivity === "activity" ? "bg-white" : ""
            }`}
            onClick={() => setShowCommentOrActivity("activity")}
          >
            Activity
          </li>
        </ul>
      </div>

      <div className="p-4 flex flex-col h-full">
        <div className="flex-grow">
          {showCommentOrActivity === "comment" ? (
            <div className="select-none flex items-center justify-center">
              <div className="flex items-center justify-center flex-col gap-1 h-[65vh] w-72">
                <Image
                  src="/commentGraphics.png"
                  width={220}
                  height={200}
                  alt="Today"
                  className="rounded-full object-cover"
                  draggable={false}
                />
                <p className="text-sm text-gray-500 font-normal text-center">
                  Centralize your project&apos;s high-level discussions in
                  project comments.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">Activity</p>
          )}
        </div>

        {showCommentOrActivity === "comment" && <AddComentForm />}
      </div>
    </Dialog>
  );
};

export default CommentOrActivityModal;
