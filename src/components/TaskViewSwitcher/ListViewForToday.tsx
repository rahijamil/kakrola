import { TaskType } from "@/types/project";
import React, { Fragment, useState } from "react";
import SectionAddTask from "./SectionAddTask";
import TaskItem from "./TaskItem";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { Droppable } from "@hello-pangea/dnd";

const ListViewForToday = ({
  tasks,
  setTasks,
}: {
  tasks: TaskType[];
  setTasks: (updatedTasks: TaskType[]) => void;
}) => {
  const [showUngroupedAddTask, setShowUngroupedAddTask] = useState(false);
  const [showTaskItemModal, setShowTaskItemModal] = useState<string | null>(
    null
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const { projects } = useTaskProjectDataProvider();

  return (
    <Droppable key={"today_tasks"} type="task" droppableId={"today_tasks"}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="pl-6"
        >
          <ul>
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
              .map((task, index) => (
                <Fragment key={task.id}>
                  <li
                    className={`border-b border-text-200 p-1 pl-0 flex items-center gap-3 cursor-pointer ${
                      task.parent_task_id && "ml-8"
                    }`}
                  >
                    <TaskItem
                      task={task}
                      setTasks={setTasks}
                      subTasks={tasks.filter(
                        (t) => t.parent_task_id == task.id
                      )}
                      index={index}
                      project={projects.find((p) => p.id === task.project_id)!}
                      tasks={tasks}
                      setShowModal={setShowTaskItemModal}
                      showModal={showTaskItemModal}
                      showDeleteConfirm={showDeleteConfirm}
                      setShowDeleteConfirm={setShowDeleteConfirm}
                    />
                  </li>

                  {tasks.filter((t) => t.parent_task_id == task.id).length >
                    0 && (
                    <ul>
                      {tasks
                        .filter((t) => t.parent_task_id == task.id)
                        .map((childTask, childIndex) => (
                          <li
                            key={childTask.id}
                            className={`border-b border-text-200 p-1 pl-0 flex items-center gap-3 cursor-pointer ${
                              childTask.parent_task_id && "ml-8"
                            }`}
                          >
                            <TaskItem
                              task={childTask}
                              setTasks={setTasks}
                              subTasks={tasks.filter(
                                (t) => t.parent_task_id == childTask.id
                              )}
                              index={childIndex}
                              project={
                                projects.find(
                                  (p) => p.id === childTask.project_id
                                )!
                              }
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

          <SectionAddTask
            showUngroupedAddTask={showUngroupedAddTask}
            setShowUngroupedAddTask={setShowUngroupedAddTask}
            project={null}
            setTasks={setTasks}
            tasks={tasks}
          />
        </div>
      )}
    </Droppable>
  );
};

export default ListViewForToday;
