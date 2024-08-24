import { ProjectType, TaskType } from "@/types/project";
import TaskItemModal from "./TaskItemModal";
import {
  Dispatch,
  LegacyRef,
  MouseEvent,
  SetStateAction,
  useState,
} from "react";
import TaskItemMoreDropdown from "./TaskItemMoreDropdown";
import { Draggable } from "@hello-pangea/dnd";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import { Circle, CircleCheck, Ellipsis, User, Workflow } from "lucide-react";
import { supabaseBrowser } from "@/utils/supabase/client";
import AddTask from "../AddTask";
import { debounce } from "lodash";
import { getDateInfo } from "@/utils/getDateInfo";

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
  smallAddTask,
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
  smallAddTask?: boolean;
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

  const [isAnimating, setIsAnimating] = useState<boolean>(false);

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

  const handleCheckClickDebounced = debounce(async () => {
    try {
      // Update local tasks
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
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  }, 300);

  const handleCheckClick = async (
    ev: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    ev.stopPropagation();

    if (!task.is_completed) {
      // Play sound
      const audio = new Audio("/sounds/done.wav");
      audio.play();
    }

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // Duration of animation

    handleCheckClickDebounced();
  };

  const [editTaskId, setEditTaskId] = useState<TaskType["id"] | null>(null);

  const dateInfo = getDateInfo(task.due_date);

  return (
    <div className="w-full">
      {addTaskAboveBellow?.position == "above" && (
        <AddTask
          onClose={() => setAddTaskAboveBellow(null)}
          isSmall={smallAddTask}
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
          isSmall={smallAddTask}
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
                className="flex items-start justify-between gap-2 taskitem_group bg-surface p-1 w-full rounded-lg cursor-pointer relative"
                onClick={() => setShowModal && setShowModal(task.id.toString())}
              >
                <div className="flex items-center gap-1">
                  <div
                    onClick={handleCheckClick}
                    className={`p-1 self-start group cursor-pointer h-fit ${
                      isAnimating ? "check-animation" : ""
                    }`}
                  >
                    <Circle
                      size={20}
                      strokeWidth={
                        task.priority == "P1"
                          ? 2.5
                          : task.priority == "P2"
                          ? 2.5
                          : task.priority == "P3"
                          ? 2.5
                          : 1.5
                      }
                      className={`rounded-full ${
                        task.priority == "P1"
                          ? "text-red-500 bg-red-100"
                          : task.priority == "P2"
                          ? "text-orange-500 bg-orange-100"
                          : task.priority == "P3"
                          ? "text-primary-500 bg-primary-100"
                          : "text-text-500"
                      } ${task.is_completed ? "hidden" : "group-hover:hidden"}`}
                    />
                    <CircleCheck
                      size={20}
                      strokeWidth={
                        task.priority == "P1"
                          ? 2.5
                          : task.priority == "P2"
                          ? 2.5
                          : task.priority == "P3"
                          ? 2.5
                          : 1.5
                      }
                      className={`transition rounded-full ${
                        task.priority == "P1"
                          ? "text-red-500 bg-red-100"
                          : task.priority == "P2"
                          ? "text-orange-500 bg-orange-100"
                          : task.priority == "P3"
                          ? "text-primary-500 bg-primary-100"
                          : "text-text-500"
                      } ${
                        !task.is_completed
                          ? "hidden group-hover:block"
                          : `text-white ${
                              task.priority == "P1"
                                ? "bg-red-500"
                                : task.priority == "P2"
                                ? "bg-orange-500"
                                : task.priority == "P3"
                                ? "bg-primary-500"
                                : "bg-text-500"
                            }`
                      }`}
                    />
                  </div>

                  <div className="space-y-2 py-1 pr-1 flex-1">
                    <div className="space-y-[2px]">
                      <p
                        className={`text-sm ${
                          task.is_completed ? "line-through text-text-500" : ""
                        } line-clamp-3`}
                      >
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="text-xs text-text-500 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {(subTasks.length > 0 || dateInfo) && (
                      <div className="flex items-center gap-2">
                        {subTasks.length > 0 ? (
                          <div className="flex items-center gap-[2px] text-text-500">
                            <Workflow strokeWidth={1.5} className="w-3 h-3" />
                            <span className="text-xs">0/{subTasks.length}</span>
                          </div>
                        ) : null}

                        {dateInfo && (
                          <div className="flex items-center gap-1 text-xs">
                            {dateInfo?.icon}
                            <span className={dateInfo?.color}>
                              {dateInfo?.label}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`flex items-center gap-[2px] taskitem_group_hover transition absolute top-1 right-1 bg-surface ${
                    !showMoreDropdown ? "opacity-0" : ""
                  }`}
                >
                  <div
                    className="relative cursor-default"
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    <TaskItemMoreDropdown
                      setShowDeleteConfirm={setShowDeleteConfirm!}
                      setAddTaskAboveBellow={setAddTaskAboveBellow}
                      task={task}
                      column={column}
                      setEditTaskId={setEditTaskId}
                    />
                  </div>

                  <button
                    className="p-1 hover:bg-primary-50 transition rounded-lg"
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
          isSmall={smallAddTask}
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
          description={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold">&quot;{task.title}&quot;</span>?
            </>
          }
          submitBtnText="Delete"
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={handleTaskDelete}
        />
      )}
    </div>
  );
};

export default TaskItem;
