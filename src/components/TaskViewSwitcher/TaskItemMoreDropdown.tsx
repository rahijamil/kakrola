import { TaskType } from "@/types/project";
import { ArrowUp, ArrowDown, Pencil, Trash2, Ellipsis } from "lucide-react";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import Dropdown from "../ui/Dropdown";

const TaskItemMoreDropdown = ({
  setShowDeleteConfirm,
  setAddTaskAboveBellow,
  task,
  column,
  setEditTaskId,
}: {
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
  setEditTaskId: Dispatch<SetStateAction<TaskType["id"] | null>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const triggerRef = useRef(null);

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <button
          ref={triggerRef}
          className={`p-1 transition rounded-lg ${
            isOpen ? "bg-gray-100" : "hover:bg-gray-100"
          }`}
          onClick={onClick}
        >
          <Ellipsis strokeWidth={1.5} className="w-5 h-5" />
        </button>
      )}
      content={
        <div>
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
                  <ArrowUp strokeWidth={1.5} className="w-4 h-4 mr-4" /> Add
                  task above
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
      }
      contentWidthClass="w-64 py-1"
    />
  );
};

export default TaskItemMoreDropdown;
