import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";
import SectionAddTask from "./SectionAddTask";
import { ProjectType, TaskType } from "@/types/project";

interface UngroupedTasksProps {
  tasks: TaskType[];
  showUngroupedAddTask: boolean;
  setShowUngroupedAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  project: ProjectType | null;
  setTasks: (updatedTasks: TaskType[]) => void;
  showShareOption?: boolean;
  setShowShareOption?: React.Dispatch<React.SetStateAction<boolean>>;
  showTaskItemModal: string | null;
  setShowTaskItemModal: Dispatch<SetStateAction<string | null>>;
}

const UngroupedTasks: React.FC<UngroupedTasksProps> = ({
  tasks,
  showUngroupedAddTask,
  setShowUngroupedAddTask,
  project,
  setTasks,
  showShareOption,
  setShowShareOption,
  showTaskItemModal,
  setShowTaskItemModal,
}) => {
  const [showTaskDeleteConfirm, setShowTaskDeleteConfirm] = useState<
    string | null
  >(null);

  return (
    <div className="pl-4">
      <Droppable droppableId="ungrouped" type="task">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`${tasks.length == 0 && "p-1"}`}
          >
            {tasks
              .filter((t) => !t.parent_task_id)
              .map((task, index) => (
                <Fragment key={task.id}>
                  <li className="border-b border-gray-200 p-1 pl-0 flex items-center gap-3 cursor-pointer">
                    <TaskItem
                      showDeleteConfirm={showTaskDeleteConfirm}
                      setShowDeleteConfirm={setShowTaskDeleteConfirm}
                      task={task}
                      setTasks={setTasks}
                      subTasks={tasks.filter(
                        (t) => t.parent_task_id === task.id
                      )}
                      showShareOption={showShareOption}
                      setShowShareOption={setShowShareOption}
                      index={index}
                      project={project}
                      tasks={tasks}
                      setShowModal={setShowTaskItemModal}
                      showModal={showTaskItemModal}
                    />
                  </li>

                  {tasks.filter((t) => t.parent_task_id === task.id).length >
                    0 && (
                    <ul className="ml-8">
                      {tasks
                        .filter((t) => t.parent_task_id === task.id)
                        .map((childTask, childIndex) => (
                          <li
                            key={childTask.id}
                            className="border-b border-gray-200 p-1 pl-0 flex items-center gap-3 cursor-pointer"
                          >
                            <TaskItem
                              task={childTask}
                              setTasks={setTasks}
                              subTasks={tasks.filter(
                                (t) => t.parent_task_id === childTask.id
                              )}
                              showShareOption={showShareOption}
                              setShowShareOption={setShowShareOption}
                              index={childIndex}
                              project={project}
                              tasks={tasks}
                            />
                          </li>
                        ))}
                    </ul>
                  )}
                </Fragment>
              ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>

      <SectionAddTask
        showUngroupedAddTask={showUngroupedAddTask}
        setShowUngroupedAddTask={setShowUngroupedAddTask}
        project={project}
        setTasks={setTasks}
        tasks={tasks}
      />
    </div>
  );
};

export default UngroupedTasks;