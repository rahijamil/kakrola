import React, { Dispatch, SetStateAction } from "react";
import AddTask from "../AddTask";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ProjectType, SectionType, TaskType } from "@/types/project";

const SectionAddTask = ({
  showAddTask,
  setShowAddTask,
  section,
  showUngroupedAddTask,
  setShowUngroupedAddTask,
  isSmall,
  project,
  setTasks,
  tasks,
}: {
  showAddTask?: string | number | null;
  setShowAddTask?: Dispatch<SetStateAction<string | number | null>>;
  section?: SectionType;
  showUngroupedAddTask?: boolean;
  setShowUngroupedAddTask?: Dispatch<SetStateAction<boolean>>;
  isSmall?: boolean;
  project: ProjectType | null;
  setTasks: (updatedTasks: TaskType[]) => void;
  tasks: TaskType[];
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
          className="mx-[6px] mt-2 text-gray-500 hover:text-indigo-600 flex items-center gap-2 w-full group py-1"
          onClick={() =>
            section
              ? setShowAddTask && setShowAddTask(section.id)
              : setShowUngroupedAddTask && setShowUngroupedAddTask(true)
          }
        >
          <PlusIcon className="w-[18px] h-[18px] text-indigo-600 group-hover:text-white transition group-hover:bg-indigo-600 rounded-full" />
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
            section_id={section?.id}
            project={project}
            tasks={tasks}
            setTasks={setTasks}
          />
        </div>
      )}
    </>
  );
};

export default SectionAddTask;
