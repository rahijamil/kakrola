import { TaskType } from "@/types/project";
import { Droppable } from "@hello-pangea/dnd";
import { format } from "date-fns";
import React, { Dispatch, SetStateAction, useState } from "react";
import TaskItem from "./TaskItem";
import SectionAddTask from "./SectionAddTask";
import useFoundFixedDropdown from "@/hooks/useFoundFixedDropdown";

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

  const { foundFixedDropdown } = useFoundFixedDropdown();

  return (
    <div className="flex gap-1 h-full overflow-x-auto px-4 md:px-6 md:pt-4 scroll-smooth">
      <div
        className={`rounded-lg w-[calc(100vw-50px)] min-w-[calc(100vw-50px)] md:w-[300px] md:min-w-[300px] h-fit max-h-[calc(100vh-150px)] md:max-h-[calc(100vh-150px)] overflow-y-auto cursor-default bg-text-25 dark:bg-surface`}
      >
        <div
          className={`flex justify-between ${
            !foundFixedDropdown && "sticky"
          } top-0 z-10 p-2 pb-1`}
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
              className={`space-y-2 min-h-1 p-2 pt-1`}
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
                      className={`rounded-lg hover:ring-2 hover:ring-primary-300 hover:transition ring-1 ring-text-200`}
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

        <div className={`${!foundFixedDropdown && "sticky"} bottom-0 p-2 pt-0`}>
          <SectionAddTask
            isSmall
            project={null}
            setTasks={setTasks}
            tasks={tasks}
            showUngroupedAddTask={showUngroupedAddTask}
            setShowUngroupedAddTask={setShowUngroupedAddTask}
            view={"Board"}
          />
        </div>
      </div>
    </div>
  );
};

export default BoardViewForToday;
