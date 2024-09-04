import { TaskType } from "@/types/project";
import { Droppable } from "@hello-pangea/dnd";
import { format } from "date-fns";
import React, { Dispatch, SetStateAction, useState } from "react";
import TaskItem from "./TaskItem";
import SectionAddTask from "./SectionAddTask";

const BoardViewForToday = ({
  tasks,
  setTasks,
}: {
  tasks: TaskType[];
  setTasks: Dispatch<SetStateAction<TaskType[]>>;
}) => {
  const [showUngroupedAddTask, setShowUngroupedAddTask] = useState(false);
  const [showTaskItemModal, setShowTaskItemModal] = useState<string | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  return (
    <div className="flex space-x-2 p-8 pt-0 h-full">
      <div
        className={`bg-text-50 rounded-2xl min-w-72 md:min-w-80 w-80 h-fit max-h-[calc(100vh-150px)] overflow-y-auto transition-colors cursor-default `}
      >
        <div
          className={`flex justify-between sticky top-0 z-10 bg-text-200 p-2 pb-1`}
        >
          <div className={`flex items-center gap-2 w-full`}>
            <h3 className="font-bold pl-[6px]">
              {format(new Date(), "MMM dd")}
            </h3>
            <p className="text-sm text-text-600">{tasks.length}</p>
          </div>
        </div>

        <Droppable droppableId={"today"} type="task">
          {(provided, snapshot) => (
            <div
              key={"today"}
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2 min-h-1 p-2 pt-1"
            >
              {tasks
                .filter((t) => !t.parent_task_id)
                .sort((a, b) => {
                  // Sort by is_completed: false (incomplete) comes before true (completed)
                  if (a.is_completed !== b.is_completed) {
                    return a.is_completed ? 1 : -1;
                  }
                  // Then sort by order within each completion status
                  return a.order - b.order;
                })
                .map((task, taskIndex) => (
                  <>
                    <div
                      key={task.id}
                      className={`rounded shadow-sm hover:ring-2 hover:ring-primary-300 transition ring-1 ring-text-200`}
                    >
                      <TaskItem
                        key={task.id}
                        task={task}
                        setTasks={setTasks}
                        tasks={tasks}
                        subTasks={tasks.filter(
                          (t) => t.parent_task_id == task.id
                        )}
                        index={taskIndex}
                        project={null}
                        setShowDeleteConfirm={setShowDeleteConfirm}
                        setShowModal={setShowTaskItemModal}
                        showModal={showTaskItemModal}
                        showDeleteConfirm={showDeleteConfirm}
                        smallAddTask
                      />
                    </div>
                  </>
                ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className={`sticky bottom-0 bg-text-200 p-2 pt-0`}>
          <SectionAddTask
            isSmall
            project={null}
            setTasks={setTasks}
            tasks={tasks}
            showUngroupedAddTask={showUngroupedAddTask}
            setShowUngroupedAddTask={setShowUngroupedAddTask}
          />
        </div>
      </div>
    </div>
  );
};

export default BoardViewForToday;
