import { ProjectType, TaskType } from "@/types/project";
import TaskItemModal from "./TaskItemModal";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import TaskItemMoreDropdown from "./TaskItemMoreDropdown";
import { Draggable } from "react-beautiful-dnd";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import { Check, Ellipsis, User, Workflow } from "lucide-react";
import { supabaseBrowser } from "@/utils/supabase/client";
const TaskItem = ({
  task,
  subTasks,
  showShareOption,
  setShowShareOption,
  index,
  project,
}: {
  task: TaskType;
  subTasks: TaskType[];
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
  index: number;
  project: ProjectType | null;
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
                <div
                  className={`border w-5 h-5 rounded-full flex items-center justify-center ${
                    task.is_completed
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-gray-400"
                  }`}
                >
                  <Check
                    strokeWidth={1.5}
                    className={`w-3 h-3 transition ${
                      !task.is_completed
                        ? "opacity-0 group-hover:opacity-100 text-gray-400"
                        : "text-white"
                    }`}
                  />
                </div>
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
