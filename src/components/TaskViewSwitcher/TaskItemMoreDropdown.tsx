import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ViewTypes } from "@/types/viewTypes";
import { LinkIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CopyPlusIcon, AlarmClockIcon } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import { Task } from "@/types/project";

const TaskItemMoreDropdown = ({
  onClose,
  view = "Board",
  setShowDeleteConfirm,
}: {
  onClose: () => void;
  view?: ViewTypes["view"];
  setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>
}) => {


  return (
    <>
      <div
        className={`absolute bg-white drop-shadow-md rounded-md border border-gray-200 top-full z-20 w-64 py-1 ${
          view == "Board" ? "left-1/2 -translate-x-1/2" : "right-0"
        }`}
      >
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <PencilIcon className="w-4 h-4 mr-4" /> Add task above
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <PencilIcon className="w-4 h-4 mr-4" /> Add task bellow
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <PencilIcon className="w-4 h-4 mr-4" /> Edit
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <PencilIcon className="w-4 h-4 mr-4" /> Due date
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <PencilIcon className="w-4 h-4 mr-4" /> Priority
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <AlarmClockIcon className="w-4 h-4 mr-4" /> Reminders
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <CopyPlusIcon className="w-4 h-4 mr-4" /> Duplicate
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <LinkIcon className="w-4 h-4 mr-4" /> Copy link to task
          </button>
        </div>

        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button
            onClick={() => {
              setShowDeleteConfirm(true);
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition flex items-center"
          >
            <TrashIcon className="w-4 h-4 mr-4" /> Delete
          </button>
        </div>
      </div>

      <div
        className="fixed top-0 left-0 bottom-0 right-0 z-10"
        onClick={onClose}
      ></div>
    </>
  );
};

export default TaskItemMoreDropdown;
