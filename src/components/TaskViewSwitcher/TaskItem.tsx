import { ProjectType, TaskType } from "@/types/project";
import TaskItemModal from "./TaskItemModal";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import TaskItemMoreDropdown from "./TaskItemMoreDropdown";
import { Draggable } from "@hello-pangea/dnd";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import {
  Check,
  Circle,
  CircleCheck,
  Ellipsis,
  User,
  Workflow,
} from "lucide-react";
import { supabaseBrowser } from "@/utils/supabase/client";
const TaskItem = ({
  task,
  subTasks,
  showShareOption,
  setShowShareOption,
  index,
  project,
  setTasks,
}: {
  task: TaskType;
  subTasks: TaskType[];
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
  index: number;
  project: ProjectType | null;
  setTasks: Dispatch<SetStateAction<TaskType[]>>;
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState<boolean>(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleSectionDelete = () => {
    // const updatedTasks = tasks.filter((t) => t.id !== task.id);
    // setTasks(updatedTasks);
  };

  const handleCheckClick = async (
    ev: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    ev.stopPropagation();

    // update local tasks
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((t) => {
        if (t.id === task.id) {
          return { ...t, is_completed: !t.is_completed };
        }
        return t;
      });
      return updatedTasks;
    });

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

  return (
    <Draggable draggableId={task.id?.toString()!} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="transition w-full"
        >
          <div
            className="flex items-start justify-between gap-2 taskitem_group bg-white p-2 w-full rounded-md"
            onClick={() => setShowModal(true)}
          >
            <div className="flex gap-1">
              <div
                onClick={handleCheckClick}
                className="p-1 group cursor-pointer h-fit"
              >
                <Circle
                  size={22}
                  strokeWidth={1.5}
                  className={`text-gray-400 ${
                    task.is_completed ? "hidden" : "group-hover:hidden"
                  }`}
                />
                <CircleCheck
                  size={22}
                  strokeWidth={1.5}
                  className={`transition text-gray-400 rounded-full ${
                    !task.is_completed ? "hidden group-hover:block" : "bg-gray-400 text-white"
                  }`}
                />
              </div>
              <div>
                <span
                  className={`${
                    task.is_completed ? "line-through text-gray-500" : ""
                  } line-clamp-3`}
                >
                  {task.title}
                </span>

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

                {showMoreDropdown && (
                  <TaskItemMoreDropdown
                    onClose={() => setShowMoreDropdown(false)}
                    setShowDeleteConfirm={setShowDeleteConfirm}
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

          {showModal && (
            <TaskItemModal
              task={task}
              subTasks={subTasks}
              setTasks={setTasks}
              onClose={() => setShowModal(false)}
              onCheckClick={handleCheckClick}
              project={project}
            />
          )}

          {showDeleteConfirm && (
            <ConfirmAlert
              title="Delete section?"
              description={`This will permanently delete "${task.title}". This can't be undone.`}
              submitBtnText="Delete"
              onCancel={() => setShowDeleteConfirm(false)}
              onSubmit={handleSectionDelete}
            />
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
