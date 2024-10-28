import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";
import SectionAddTask from "./SectionAddTask";
import { ProjectType, TaskType } from "@/types/project";
import TaskItemForListView from "./ListView/TaskItemForListView";
import useScreen from "@/hooks/useScreen";

interface UngroupedTasksProps {
  tasks: TaskType[];
  showUngroupedAddTask: boolean;
  setShowUngroupedAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  project: ProjectType | null;
  setTasks: (tasks: TaskType[]) => void;
  showTaskItemModal: string | null;
  setShowTaskItemModal: Dispatch<SetStateAction<string | null>>;
}

const UngroupedTasks: React.FC<UngroupedTasksProps> = ({
  tasks,
  showUngroupedAddTask,
  setShowUngroupedAddTask,
  project,
  setTasks,
  showTaskItemModal,
  setShowTaskItemModal,
}) => {
  const [showTaskDeleteConfirm, setShowTaskDeleteConfirm] = useState<
    string | null
  >(null);

  const { screenWidth } = useScreen();

  return (
    <>
      <Droppable droppableId="ungrouped" type="task" key={tasks.length}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`${tasks.length == 0 && "p-1"}`}
          >
            {tasks
              .filter((t) => !t.parent_task_id)
              .map((task, index) => (
                <>
                  <TaskItemForListView
                    key={task.id}
                    showDeleteConfirm={showTaskDeleteConfirm}
                    setShowDeleteConfirm={setShowTaskDeleteConfirm}
                    task={task}
                    setTasks={setTasks}
                    subTasks={tasks.filter((t) => t.parent_task_id === task.id)}
                    index={index}
                    project={project}
                    tasks={tasks}
                    setShowModal={setShowTaskItemModal}
                    showModal={showTaskItemModal}
                  />

                  {/* {tasks.filter((t) => t.parent_task_id === task.id).length >
                    0 && (
                    <ul>
                      {tasks
                        .filter((t) => t.parent_task_id === task.id)
                        .map((childTask, childIndex) => (
                          <li key={childTask.id}>
                            <TaskItemForListView
                              task={childTask}
                              setTasks={setTasks}
                              subTasks={tasks.filter(
                                (t) => t.parent_task_id === childTask.id
                              )}
                              index={childIndex}
                              project={project}
                              tasks={tasks}
                            />
                          </li>
                        ))}
                    </ul>
                  )} */}
                </>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {screenWidth > 768 && (
        <SectionAddTask
          showUngroupedAddTask={showUngroupedAddTask}
          setShowUngroupedAddTask={setShowUngroupedAddTask}
          project={project}
          setTasks={setTasks}
          tasks={tasks}
          view={project?.settings.view || "List"}
        />
      )}
    </>
  );
};

export default UngroupedTasks;
