import { TaskType } from "@/types/project";
import {
  CheckIcon,
  EllipsisHorizontalIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import TaskItemModal from "./TaskItemModal";
import { Dispatch, SetStateAction, useState } from "react";
import TaskItemMoreDropdown from "./TaskItemMoreDropdown";
import { Draggable } from "react-beautiful-dnd";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
const TaskItem = ({
  task,
  onCheckClick,
  showShareOption,
  setShowShareOption,
  index,
}: {
  task: TaskType;
  onCheckClick: () => void;
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
  index: number;
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState<boolean>(false);

  const { tasks, setTasks } = useTaskProjectDataProvider();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleSectionDelete = () => {
    const updatedTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(updatedTasks);
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="rounded shadow-sm hover:shadow-md transition w-full"
        >
          <div
            className="flex items-start justify-between gap-2 taskitem_group bg-white p-2 w-full rounded-md"
            onClick={() => setShowModal(true)}
          >
            <div className="flex gap-1">
              <div
                onClick={(ev) => {
                  ev.stopPropagation();
                  onCheckClick();
                }}
                className="p-1 group cursor-pointer"
              >
                <div
                  className={`border w-5 h-5 rounded-full flex items-center justify-center ${
                    task.isCompleted
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-gray-400"
                  }`}
                >
                  <CheckIcon
                    className={`w-3 h-3 transition text-white ${
                      !task.isCompleted && "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
              </div>
              <span
                className={`${
                  task.isCompleted ? "line-through text-gray-500" : ""
                } line-clamp-3`}
              >
                {task.title}
              </span>
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
                  <EllipsisHorizontalIcon className="w-5 h-5" />
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
                <UserIcon className="w5 h-5" />
              </button>
            </div>
          </div>

          {showModal && (
            <TaskItemModal
              task={task}
              onClose={() => setShowModal(false)}
              onCheckClick={onCheckClick}
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
