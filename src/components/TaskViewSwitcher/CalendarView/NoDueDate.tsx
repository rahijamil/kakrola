import React from "react";
import TaskItem from "../../TaskViewSwitcher/TaskItem";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ProjectType, TaskType } from "@/types/project";

const NoDueDate = ({
  showNoDateTasks,
  tasks,
  setTasks,
  project,
}: {
  showNoDateTasks?: boolean;
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  project: ProjectType;
}) => {
  return (
    <div
      className={`h-screen overflow-y-auto bg-surface transition-all duration-300 sticky top-0 flex flex-col ${
        showNoDateTasks ? "w-80" : "w-0"
      }`}
    >
      <div className="p-4 flex items-center gap-2">
        <h3 className="font-bold">No date</h3>
        <p>{tasks?.filter((t) => !t.due_date).length}</p>
      </div>

      <Droppable droppableId="no_date_tasks" type="calendarview_task">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1"
          >
            <ul className="h-full">
              {project &&
                setTasks &&
                tasks
                  ?.filter((t) => !t.due_date)
                  .map((task: TaskType, index) => (
                    <li
                    key={task.id}
                      className={`border-b border-text-200 p-1 pl-0 flex items-center gap-3 cursor-pointer`}
                    >
                      <TaskItem
                        key={task.id}
                        task={task}
                        index={index}
                        tasks={tasks}
                        setTasks={setTasks}
                        subTasks={[]}
                        project={project}
                      />
                    </li>
                  ))}

              {provided.placeholder}
            </ul>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default NoDueDate;
