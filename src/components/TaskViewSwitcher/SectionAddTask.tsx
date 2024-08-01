import React, { Dispatch, SetStateAction } from "react";
import AddTask from "../AddTask";
import { PlusIcon } from "@heroicons/react/24/outline";
import { SectionType } from "@/types/project";

const SectionAddTask = ({
  showAddTask,
  setShowAddTask,
  section,
  showUngroupedAddTask,
  setShowUngroupedAddTask,
  isSmall,
}: {
  showAddTask?: number | null;
  setShowAddTask?: Dispatch<SetStateAction<number | null>>;
  section?: SectionType;
  showUngroupedAddTask?: boolean;
  setShowUngroupedAddTask?: Dispatch<SetStateAction<boolean>>;
  isSmall?: boolean;
}) => {
  const isAddTaskVisible = section
    ? showAddTask !== section.id
    : !showUngroupedAddTask;

  const isAddTaskFormVisible = section
    ? showAddTask === section.id
    : showUngroupedAddTask;

  return (
    <>
      {isAddTaskVisible && (
        <button
          className="mt-4 text-gray-500 hover:text-gray-700 flex items-center gap-2 w-full group py-1"
          onClick={() =>
            section
              ? setShowAddTask && setShowAddTask(section.id)
              : setShowUngroupedAddTask && setShowUngroupedAddTask(true)
          }
        >
          <PlusIcon className="w-4 h-4 text-gray-700 group-hover:text-white transition group-hover:bg-gray-600 rounded-full" />
          <span>Add task</span>
        </button>
      )}
      {isAddTaskFormVisible && (
        <div className="mt-4">
          <AddTask
            onClose={() =>
              section
                ? setShowAddTask && setShowAddTask(null)
                : setShowUngroupedAddTask && setShowUngroupedAddTask(false)
            }
            isSmall={isSmall}
            section={section}
          />
        </div>
      )}
    </>
  );
};

export default SectionAddTask;