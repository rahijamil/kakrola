import { TaskType } from "@/types/project";
import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import SectionAddTask from "./SectionAddTask";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { Droppable } from "@hello-pangea/dnd";
import TaskItemForListView from "./ListView/TaskItemForListView";
import {
  AlignLeft,
  CalendarRange,
  CircleChevronUp,
  MapPin,
  Tag,
  UserPlus,
} from "lucide-react";
import useScreen from "@/hooks/useScreen";

const ListViewForToday = ({
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

  const { projects } = useSidebarDataProvider();
  const { screenWidth } = useScreen();

  return (
    <Droppable
      key={"today_tasks"}
      type="task"
      droppableId={"today_tasks"}
      direction="vertical"
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="overflow-auto w-full h-[calc(100vh-110px)] md:px-6 md:mt-4"
        >
          <table className="w-full min-w-[1000px] border-collapse">
            <tr className="border-y border-text-100 text-xs divide-x divide-text-200 whitespace-nowrap flex sticky top-0 z-10 bg-background">
              <th className="p-2 text-left w-[30%] md:w-[40%] font-medium flex items-center gap-2 pl-4 md:pl-8">
                <AlignLeft strokeWidth={2} className="w-4 h-4" />
                <span>Task name</span>
              </th>
              <th className="p-2 text-left w-[15%] font-medium flex items-center gap-2">
                <UserPlus strokeWidth={2} className="w-4 h-4" />
                <span>Assignee</span>
              </th>
              <th className="p-2 text-left w-[15%] font-medium flex items-center gap-2">
                <CalendarRange strokeWidth={2} className="w-4 h-4" />
                <span>Dates</span>
              </th>
              <th className="p-2 text-left w-[15%] font-medium flex items-center gap-2">
                <CircleChevronUp strokeWidth={2} className="w-4 h-4" />
                <span>Priority</span>
              </th>
              <th className="p-2 text-left w-[15%] font-medium flex items-center gap-2">
                <Tag strokeWidth={2} className="w-4 h-4" />
                <span>Labels</span>
              </th>
              <th className="p-2 text-left w-[15%] font-medium flex items-center gap-2">
                <MapPin strokeWidth={2} className="w-4 h-4" />
                <span>Location</span>
              </th>
            </tr>

            <tbody>
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
                    <TaskItemForListView
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
                  </Fragment>
                ))}

              {provided.placeholder}

              {screenWidth > 768 && (
                <SectionAddTask
                  showUngroupedAddTask={showUngroupedAddTask}
                  setShowUngroupedAddTask={setShowUngroupedAddTask}
                  project={null}
                  setTasks={setTasks}
                  tasks={tasks}
                  view={"List"}
                />
              )}
            </tbody>
          </table>
        </div>
      )}
    </Droppable>
  );
};

export default ListViewForToday;
