import React, {
  Dispatch,
  LegacyRef,
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from "react";

import { TaskType } from "@/types/project";
import { Check, ChevronDown, Flag, X } from "lucide-react";
import { FlagIcon } from "@heroicons/react/16/solid";
import Dropdown from "../ui/Dropdown";
const priorities = [
  { value: "P1", label: "Priority 1", color: "text-red-500" },
  { value: "P2", label: "Priority 2", color: "text-orange-500" },
  { value: "P3", label: "Priority 3", color: "text-primary-600" },
  { value: "Priority", label: "Priority 4", color: "text-text-500" },
];

const PriorityIcon = ({ priority }: { priority: string }) => {
  switch (priority) {
    case "P1":
    case "P2":
    case "P3":
      return (
        <FlagIcon
          className={`w-4 h-4 ${
            priorities.find((p) => p.value === priority)?.color
          }`}
        />
      );
    default:
      return (
        <Flag
          strokeWidth={1.5}
          className={`w-4 h-4 ${
            priorities.find((p) => p.value === priority)?.color
          }`}
        />
      );
  }
};

const Priorities = ({
  taskData,
  setTaskData,
  isSmall,
  forTaskItemModal,
  forListView,
  dataFromElement,
}: {
  taskData: TaskType;
  setTaskData: Dispatch<SetStateAction<TaskType>>;
  isSmall?: boolean;
  forTaskItemModal?: boolean;
  forListView?: boolean;
  dataFromElement?: boolean;
}) => {
  const selectedPriority = priorities.find(
    (priority) => priority.value === taskData.priority
  );

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const triggerRef = useRef(null);

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <>
          {forTaskItemModal ? (
            <div
              ref={triggerRef}
              className={`flex items-center justify-between rounded-full transition p-[6px] px-2 group cursor-pointer ${
                isOpen ? "bg-primary-100" : "hover:bg-text-100"
              }`}
              onClick={onClick}
            >
              <div className="flex items-center gap-2 text-xs">
                <PriorityIcon priority={taskData.priority} />
                <span className="text-xs">
                  {selectedPriority?.value == "Priority"
                    ? "P4"
                    : selectedPriority?.value || ""}
                </span>
              </div>

              <ChevronDown
                strokeWidth={1.5}
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition"
              />
            </div>
          ) : forListView ? (
            <div
              data-form-element={dataFromElement}
              ref={triggerRef}
              data-state="priority"
              className={`flex items-center justify-between cursor-pointer h-10 px-2 group relative ring-1 ${
                isOpen
                  ? "ring-primary-300 bg-primary-10"
                  : "hover:ring-primary-300 ring-transparent"
              }`}
              onClick={onClick}
            >
              <div className="flex items-center gap-1">
                <PriorityIcon priority={taskData.priority} />

                {isSmall ? (
                  <>
                    {taskData.priority !== "Priority" && (
                      <span className="text-xs text-text-700">
                        {
                          priorities.find((p) => p.value === taskData.priority)
                            ?.value
                        }
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-text-700">
                    {
                      priorities.find((p) => p.value === taskData.priority)
                        ?.value
                    }
                  </span>
                )}
              </div>

              {taskData.priority !== "Priority" && (
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setTaskData({ ...taskData, priority: "Priority" });
                  }}
                  className="text-text-500 hover:text-text-700 p-[2px] hover:bg-text-200 rounded-full hidden group-data-[state=priority]:group-hover:inline-block absolute top-1/2 -translate-y-1/2 right-2"
                >
                  <X strokeWidth={1.5} className="w-4 h-4 text-text-500" />
                </button>
              )}
            </div>
          ) : (
            <div
              ref={triggerRef}
              className={`flex items-center gap-1 cursor-pointer p-1 px-2 rounded-full border border-text-200 ${
                isOpen ? "bg-text-50" : "hover:bg-text-100"
              }`}
              onClick={onClick}
            >
              <PriorityIcon priority={taskData.priority} />

              {isSmall ? (
                <>
                  {taskData.priority !== "Priority" && (
                    <span className="text-xs text-text-700">
                      {
                        priorities.find((p) => p.value === taskData.priority)
                          ?.value
                      }
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs text-text-700">
                  {priorities.find((p) => p.value === taskData.priority)?.value}
                </span>
              )}

              {taskData.priority !== "Priority" && (
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setTaskData({ ...taskData, priority: "Priority" });
                  }}
                  className="text-text-500 hover:text-text-700 p-[2px] hover:bg-text-100 rounded-full"
                >
                  <X strokeWidth={1.5} className="w-3 h-3 text-text-500" />
                </button>
              )}
            </div>
          )}
        </>
      )}
      content={
        <ul className="text-xs" data-form-element={dataFromElement}>
          {priorities.map((priority) => (
            <li
              key={priority.value}
              className={`flex items-center px-2 py-2 transition-colors hover:bg-text-100 cursor-pointer text-text-700 rounded-2xl`}
              onClick={() => {
                setTaskData({
                  ...taskData,
                  priority: priority.value as TaskType["priority"],
                });
                onClose();
              }}
            >
              <PriorityIcon priority={priority.value} />
              <span className="ml-2">{priority.label}</span>
              {taskData.priority === priority.value && (
                <Check
                  strokeWidth={2}
                  className="w-4 h-4 ml-auto text-primary-600"
                />
              )}
            </li>
          ))}
        </ul>
      }
      contentWidthClass="w-[200px] py-1"
    />
  );
};

export default Priorities;
