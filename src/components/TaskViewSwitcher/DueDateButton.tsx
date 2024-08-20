import { TaskType } from "@/types/project";
import { Dispatch, SetStateAction } from "react";
import { getDateInfo } from "@/utils/getDateInfo";
import { X } from "lucide-react";

const DueDateButton = ({
  taskData,
  setTaskData,
  setShowDueDateSelector,
  showDueDateSelector,
}: {
  taskData: TaskType;
  setTaskData: Dispatch<SetStateAction<TaskType>>;
  showDueDateSelector: boolean;
  setShowDueDateSelector: Dispatch<SetStateAction<boolean>>;
}) => {

  const dateInfo = getDateInfo(taskData.due_date);

  return (
    <button
      onClick={() => setShowDueDateSelector(true)}
      className={`flex items-center relative rounded-lg transition py-[6px] px-2 group w-full text-xs ${
        taskData.due_date !== null
          ? showDueDateSelector
            ? "bg-indigo-100 cursor-pointer"
            : "hover:bg-indigo-100 cursor-pointer"
          : "cursor-default"
      }`}
    >
      {taskData.due_date ? (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {dateInfo?.icon}
            <span>{dateInfo?.label}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <p className="font-semibold text-xs">Due date</p>
          <span className="text-gray-400">+</span>
        </div>
      )}

      {taskData.due_date && (
        <div
          onClick={(ev) => {
            ev.stopPropagation();
            setTaskData({ ...taskData, due_date: null });
          }}
          className="p-1 rounded-lg hover:bg-white absolute top-1/2 -translate-y-1/2 right-1"
        >
          <X strokeWidth={1.5} size={16} />
        </div>
      )}
    </button>
  );
};

export default DueDateButton;
