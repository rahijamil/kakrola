import React, { Dispatch, SetStateAction, useRef, useState } from "react";

import { TaskPriority, TaskType } from "@/types/project";
import { ChevronDown, X } from "lucide-react";
import Dropdown from "../ui/Dropdown";
import { priorities, PriorityIcon } from "@/utils/utility_functions";
import AnimatedTaskCheckbox from "../TaskViewSwitcher/AnimatedCircleCheck";

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

  const triggerRef = useRef(null);

  return (
    <Dropdown
      fullMode
      title="Select Priority"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <>
          {forTaskItemModal ? (
            <div
              className={`flex items-center justify-between rounded-lg transition py-2 px-4 group cursor-pointer ${
                isOpen ? "bg-primary-50" : "hover:bg-text-100"
              }`}
              onClick={onClick}
            >
              <div ref={triggerRef} className="flex items-center gap-2 text-xs">
                <PriorityIcon priority={taskData.priority} />
                <span className="text-xs">
                  {selectedPriority?.value == "Priority"
                    ? "P4"
                    : selectedPriority?.value || ""}
                </span>
              </div>

              <ChevronDown
                strokeWidth={1.5}
                className={`w-4 h-4 transition text-text-500 ${
                  !isOpen && "opacity-0 group-hover:opacity-100"
                }`}
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
                    setTaskData({
                      ...taskData,
                      priority: TaskPriority.Priority,
                    });
                  }}
                  className="text-text-500 hover:text-text-700 p-[2px] hover:bg-text-100 rounded-lg hidden group-data-[state=priority]:group-hover:inline-block absolute top-1/2 -translate-y-1/2 right-2"
                >
                  <X strokeWidth={1.5} className="w-4 h-4 text-text-500" />
                </button>
              )}
            </div>
          ) : (
            <div
              ref={triggerRef}
              className={`flex items-center gap-1 cursor-pointer p-1 px-2 rounded-lg border border-text-100 text-[11px] ${
                isOpen ? "bg-text-50" : "hover:bg-text-100"
              }`}
              onClick={onClick}
            >
              <PriorityIcon priority={taskData.priority} />

              {isSmall ? (
                <>
                  {taskData.priority !== "Priority" && (
                    <span className="text-text-500">
                      {
                        priorities.find((p) => p.value === taskData.priority)
                          ?.value
                      }
                    </span>
                  )}
                </>
              ) : (
                <span className="text-text-700">
                  {priorities.find((p) => p.value === taskData.priority)?.value}
                </span>
              )}

              {taskData.priority !== "Priority" && (
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setTaskData({
                      ...taskData,
                      priority: TaskPriority.Priority,
                    });
                  }}
                  className="text-text-500 hover:text-text-900 p-[2px] hover:bg-text-100 rounded-lg"
                >
                  <X strokeWidth={1.5} className="w-3 h-3 text-text-500" />
                </button>
              )}
            </div>
          )}
        </>
      )}
      items={priorities.map((priority, id) => ({
        id,
        label: priority.label,
        onClick: () =>
          setTaskData({
            ...taskData,
            priority: priority.value as TaskType["priority"],
          }),
        icon: <PriorityIcon priority={priority.value} />,
        rightContent: taskData.priority == priority.value && (
          <AnimatedTaskCheckbox
            priority={TaskPriority.P3}
            playSound={false}
            handleCheckSubmit={() =>
              setTaskData({
                ...taskData,
                priority: priority.value as TaskType["priority"],
              })
            }
            is_completed={taskData.priority == priority.value}
          />
        ),
      }))}
    />
  );
};

export default Priorities;
