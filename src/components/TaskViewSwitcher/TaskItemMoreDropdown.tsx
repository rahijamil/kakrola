import { TaskType } from "@/types/project";
import { ViewTypes } from "@/types/viewTypes";
import {
  CopyPlusIcon,
  AlarmClockIcon,
  ArrowUp,
  ArrowDown,
  Pencil,
  Link,
  Trash2,
  Calendar,
  Flag,
} from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

const TaskItemMoreDropdown = ({
  onClose,
  view = "Board",
  setShowDeleteConfirm,
  setAddTaskAboveBellow,
  task,
  column,
  setEditTaskId
}: {
  onClose: () => void;
  view?: ViewTypes["view"];
  setShowDeleteConfirm: Dispatch<SetStateAction<string | null>>;
  setAddTaskAboveBellow: Dispatch<
    SetStateAction<{
      position: "above" | "below";
      task: TaskType;
    } | null>
  >;
  task: TaskType;
  column?: {
    id: string;
    title: string;
    tasks: TaskType[];
    is_archived?: boolean;
  };
  setEditTaskId: Dispatch<SetStateAction<TaskType['id'] | null>>;
}) => {
  return (
    <>
      <div
        className={`absolute bg-white drop-shadow-md rounded-md border border-gray-200 top-full z-20 w-64 py-1 ${
          view == "Board" ? "left-1/2 -translate-x-1/2" : "right-0"
        }`}
      >
        {!column?.is_archived && (
          <>
            <div>
              <button
                onClick={() => {
                  setAddTaskAboveBellow({ position: "above", task });
                  onClose();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
              >
                <ArrowUp strokeWidth={1.5} className="w-4 h-4 mr-4" /> Add task
                above
              </button>
              <button
                onClick={() => {
                  setAddTaskAboveBellow({ position: "below", task });
                  onClose();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
              >
                <ArrowDown strokeWidth={1.5} className="w-4 h-4 mr-4" /> Add
                task below
              </button>
            </div>
            <div className="h-[1px] bg-gray-100 my-1"></div>
            <div>
              <button
                onClick={() => {
                  setEditTaskId(task.id);
                  onClose();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
              >
                <Pencil strokeWidth={1.5} className="w-4 h-4 mr-4" /> Edit
              </button>
            </div>
            {/* <div className="h-[1px] bg-gray-100 my-1"></div>
            <div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <Calendar strokeWidth={1.5} className="w-4 h-4 mr-4" /> Due date
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <Flag strokeWidth={1.5} className="w-4 h-4 mr-4" /> Priority
              </button>
            </div>
            <div className="h-[1px] bg-gray-100 my-1"></div>
            <div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <AlarmClockIcon strokeWidth={1.5} className="w-4 h-4 mr-4" />{" "}
                Reminders
              </button>
            </div>
            <div className="h-[1px] bg-gray-100 my-1"></div> */}
          </>
        )}

        {/* <div>
          {!column?.is_archived && (
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
              <CopyPlusIcon strokeWidth={1.5} className="w-4 h-4 mr-4" />{" "}
              Duplicate
            </button>
          )}
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <Link strokeWidth={1.5} className="w-4 h-4 mr-4" /> Copy link to
            task
          </button>
        </div> */}

        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button
            onClick={() => {
              setShowDeleteConfirm(task.id.toString());
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition flex items-center"
          >
            <Trash2 strokeWidth={1.5} className="w-4 h-4 mr-4" /> Delete
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
