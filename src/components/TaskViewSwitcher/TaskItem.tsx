import { ProjectType, TaskType } from "@/types/project";
import TaskItemModal from "./TaskItemModal";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import TaskItemMoreDropdown from "./TaskItemMoreDropdown";
import { Draggable } from "@hello-pangea/dnd";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import {
  Circle,
  CircleCheck,
  Ellipsis,
  User,
  Workflow,
} from "lucide-react";
import { supabaseBrowser } from "@/utils/supabase/client";
import AddTask from "../AddTask";
const TaskItem = ({
  task,
  subTasks,
  showShareOption,
  setShowShareOption,
  index,
  project,
  setTasks,
  tasks,
  setShowModal,
  showModal,
  showDeleteConfirm,
  setShowDeleteConfirm,
  column,
}: {
  task: TaskType;
  subTasks: TaskType[];
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
  index: number;
  project: ProjectType | null;
  setTasks: (updatedTasks: TaskType[]) => void;
  tasks: TaskType[];
  showModal?: string | null;
  setShowModal?: Dispatch<SetStateAction<string | null>>;
  showDeleteConfirm?: string | null;
  setShowDeleteConfirm?: Dispatch<SetStateAction<string | null>>;
  column?: {
    id: string;
    title: string;
    tasks: TaskType[];
    is_archived?: boolean;
  };
}) => {
  const [showMoreDropdown, setShowMoreDropdown] = useState<boolean>(false);
  const [addTaskAboveBellow, setAddTaskAboveBellow] = useState<{
    position: "above" | "below";
    task: TaskType;
  } | null>(null);

  const handleTaskDelete = async () => {
    const updatedTasks = tasks.filter((t) => t.id !== task.id);

    setTasks(updatedTasks);

    const { error } = await supabaseBrowser
      .from("tasks")
      .delete()
      .eq("id", task.id);

    if (error) {
      console.log(error);
    }
  };

  const handleCheckClick = async (
    ev: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    ev.stopPropagation();

    // update local tasks
    setTasks(
      tasks.map((t) =>
        t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
      )
    );

    const { error } = await supabaseBrowser
      .from("tasks")
      .update({
        is_completed: !task.is_completed,
      })
      .eq("id", task.id);

    if (error) {
      console.log(error);
    }
  };

  const [editTaskId, setEditTaskId] = useState<TaskType["id"] | null>(null);

  return (
    <>
      {addTaskAboveBellow?.position == "above" && (
        <AddTask
          onClose={() => setAddTaskAboveBellow(null)}
          isSmall={true}
          section_id={task.section_id}
          project={project}
          tasks={tasks}
          setTasks={setTasks}
          addTaskAboveBellow={addTaskAboveBellow}
        />
      )}

      {editTaskId == task.id ? (
        <AddTask
          onClose={() => setEditTaskId(null)}
          isSmall={true}
          section_id={task.section_id}
          project={project}
          tasks={tasks}
          setTasks={setTasks}
          addTaskAboveBellow={addTaskAboveBellow}
          taskForEdit={task}
        />
      ) : (
        <Draggable draggableId={task.id?.toString()} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="transition w-full"
            >
              <div
                className="flex items-start justify-between gap-2 taskitem_group bg-white p-1 w-full rounded-md cursor-pointer"
                onClick={() => setShowModal && setShowModal(task.id.toString())}
              >
                <div className="flex items-center gap-1">
                  <div
                    onClick={handleCheckClick}
                    className="p-1 group cursor-pointer h-fit"
                  >
                    <Circle
                      size={22}
                      strokeWidth={1.5}
                      className={`${
                        task.priority == "P1"
                          ? "text-red-500"
                          : task.priority == "P2"
                          ? "text-orange-500"
                          : task.priority == "P3"
                          ? "text-indigo-500"
                          : "text-gray-500"
                      } ${task.is_completed ? "hidden" : "group-hover:hidden"}`}
                    />
                    <CircleCheck
                      size={22}
                      strokeWidth={1.5}
                      className={`transition rounded-full ${
                        task.priority == "P1"
                          ? "text-red-500"
                          : task.priority == "P2"
                          ? "text-orange-500"
                          : task.priority == "P3"
                          ? "text-indigo-500"
                          : "text-gray-500"
                      } ${
                        !task.is_completed
                          ? "hidden group-hover:block"
                          : `text-white ${
                              task.priority == "P1"
                                ? "bg-red-500"
                                : task.priority == "P2"
                                ? "bg-orange-500"
                                : task.priority == "P3"
                                ? "bg-indigo-500"
                                : "bg-gray-500"
                            }`
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`${
                        task.is_completed ? "line-through text-gray-500" : ""
                      } line-clamp-3`}
                    >
                      {task.title}
                    </p>

                    {subTasks.length > 0 ? (
                      <div className="flex items-center gap-[2px] text-gray-500">
                        <Workflow strokeWidth={1.5} className="w-3 h-3" />
                        <span className="text-xs">0/{subTasks.length}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div
                  className={`flex items-center gap-[2px] taskitem_group_hover transition ${
                    !showMoreDropdown ? "opacity-0" : ""
                  }`}
                >
                  <div
                    className="relative cursor-default"
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    <button
                      className="p-1 hover:bg-gray-100 transition rounded-md"
                      onClick={(ev) => {
                        setShowMoreDropdown(true);
                      }}
                    >
                      <Ellipsis strokeWidth={1.5} className="w-5 h-5" />
                    </button>

                    {showMoreDropdown && setShowDeleteConfirm && (
                      <TaskItemMoreDropdown
                        onClose={() => setShowMoreDropdown(false)}
                        setShowDeleteConfirm={setShowDeleteConfirm}
                        setAddTaskAboveBellow={setAddTaskAboveBellow}
                        task={task}
                        column={column}
                        setEditTaskId={setEditTaskId}
                      />
                    )}
                  </div>

                  <button
                    className="p-1 hover:bg-gray-100 transition rounded-md"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      typeof setShowShareOption == "function" &&
                        setShowShareOption(true);
                    }}
                  >
                    <User strokeWidth={1.5} className="w5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </Draggable>
      )}

      {addTaskAboveBellow?.position == "below" && (
        <AddTask
          onClose={() => setAddTaskAboveBellow(null)}
          isSmall={true}
          section_id={task.section_id}
          project={project}
          tasks={tasks}
          setTasks={setTasks}
          addTaskAboveBellow={addTaskAboveBellow}
        />
      )}

      {showModal == task.id && setShowModal && (
        <TaskItemModal
          task={task}
          subTasks={subTasks}
          setTasks={setTasks}
          tasks={tasks}
          onClose={() => setShowModal(null)}
          onCheckClick={handleCheckClick}
          project={project}
        />
      )}

      {showDeleteConfirm == task.id && setShowDeleteConfirm && (
        <ConfirmAlert
          title="Delete task?"
          description={`This will permanently delete "${task.title}". This can't be undone.`}
          submitBtnText="Delete"
          onCancel={() => setShowDeleteConfirm(null)}
          onSubmit={handleTaskDelete}
        />
      )}
    </>
  );
};

export default TaskItem;
