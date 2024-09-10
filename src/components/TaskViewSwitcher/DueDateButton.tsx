import { TaskType } from "@/types/project";
import { Dispatch, SetStateAction } from "react";
import { getDateInfo } from "@/utils/getDateInfo";
import { X } from "lucide-react";

const DueDateButton = ({
  taskData,
  setTaskData,
  setShowDateSelector,
  showDateSelector,
}: {
  taskData: TaskType;
  setTaskData: Dispatch<SetStateAction<TaskType>>;
  showDateSelector: boolean;
  setShowDateSelector: Dispatch<SetStateAction<boolean>>;
}) => {

  const dateInfo = getDateInfo(taskData.dates.end_date);

  return (
    <button
      onClick={() => setShowDateSelector(true)}
      className={`flex items-center relative rounded-lg transition py-[6px] px-2 group w-full text-xs ${
        taskData.dates.end_date !== null
          ? showDateSelector
            ? "bg-primary-100 cursor-pointer"
            : "hover:bg-text-100 cursor-pointer"
          : "cursor-default"
      }`}
    >
      {taskData.dates.end_date ? (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {dateInfo?.icon}
            <span>{dateInfo?.label}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <p className="font-semibold text-xs">Due date</p>
          <span className="text-text-400">+</span>
        </div>
      )}

      {taskData.dates.end_date && (
        <div
          onClick={(ev) => {
            ev.stopPropagation();
            setTaskData({ ...taskData, dates: {...taskData.dates, end_date: null} });
          }}
          className="p-1 rounded-lg hover:bg-surface absolute top-1/2 -translate-y-1/2 right-1"
        >
          <X strokeWidth={1.5} size={16} />
        </div>
      )}
    </button>
  );
};

export default DueDateButton;
