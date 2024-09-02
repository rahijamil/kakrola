import React, { Dispatch, SetStateAction, useEffect } from "react";
import AddTask from "../AddTask";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import AddTaskFormForProject from "../AddTask/AddTaskFormForProject";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";

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

  const { activeProject } = useTaskProjectDataProvider();

  return (
    <>
      {isAddTaskVisible && (
        <button
          className={`px-2 text-text-500 hover:text-primary-600 hover:bg-text-50d flex items-center gap-2 w-full group py-2.5 ${
            activeProject?.settings.view == "List" && "pl-16"
          }`}
          onClick={() => {
            section
              ? setShowAddTask && setShowAddTask(section.id)
              : setShowUngroupedAddTask && setShowUngroupedAddTask(true);
          }}
        >
          <PlusIcon className="w-[18px] h-[18px] text-primary-600 group-hover:text-surface transition group-hover:bg-primary-600 rounded-full" />
          <span>Add task</span>
        </button>
      )}
      {isAddTaskFormVisible &&
        (activeProject?.settings.view == "Board" ? (
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
        ) : (
          <div
            className={`flex items-center gap-3 cursor-pointer w-full h-10 ring-1 ring-primary-300 mt-[1px]`}
          >
            <AddTaskFormForProject
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
        ))}
    </>
  );
};

export default SectionAddTask;
