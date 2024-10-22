import React, { Dispatch, SetStateAction, useRef, useState } from "react";

import { TaskPriority, TaskStatus, TaskType } from "@/types/project";
import { ChevronDown, Circle, Square, SquareCheck, X } from "lucide-react";
import Dropdown from "../ui/Dropdown";
import { taskStatus, TaskStatusColor } from "@/utils/utility_functions";
import AnimatedTaskCheckbox from "../TaskViewSwitcher/AnimatedCircleCheck";

const StatusSelector = ({
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
  const [isOpen, setIsOpen] = useState(false);

  const triggerRef = useRef(null);

  return (
    <Dropdown
      title="Select Status"
      fullMode
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
                {taskData.status == TaskStatus.COMPLETE ? (
                  <SquareCheck className="w-4 h-4 text-green-500" />
                ) : (
                  taskData.status && (
                    <div className="w-4 h-4 rounded-lg overflow-hidden">
                      <Square
                        fill={TaskStatusColor[taskData.status]}
                        strokeWidth={0}
                        className="w-4 h-4"
                      />
                    </div>
                  )
                )}
                <span
                  className={`text-xs ${
                    taskData.status == TaskStatus.COMPLETE && "text-green-500"
                  }`}
                >
                  {taskStatus.find(({ status }) => status === taskData.status)
                    ?.label || "No status"}
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
              data-state="status"
              className={`flex items-center justify-between cursor-pointer h-10 px-2 group relative ring-1 ${
                isOpen
                  ? "ring-primary-300 bg-primary-10"
                  : "hover:ring-primary-300 ring-transparent"
              }`}
              onClick={onClick}
            >
              <div className="flex items-center gap-1">
                {isSmall ? (
                  <>
                    {!taskData.status && (
                      <>
                        {taskData.status == TaskStatus.COMPLETE ? (
                          <SquareCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          taskData.status && (
                            <div className="w-4 h-4 rounded-lg overflow-hidden">
                              <Square
                                fill={TaskStatusColor[taskData.status]}
                                strokeWidth={0}
                                className="w-4 h-4"
                              />
                            </div>
                          )
                        )}
                        <span
                          className={`text-xs ${
                            taskData.status == TaskStatus.COMPLETE
                              ? "text-green-500"
                              : "text-text-700"
                          }`}
                        >
                          {taskStatus.find(
                            ({ status }) => status === taskData.status
                          )?.label || "No status"}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {taskData.status == TaskStatus.COMPLETE ? (
                      <SquareCheck className="w-4 h-4 text-green-500" />
                    ) : (
                      taskData.status && (
                        <div className="w-4 h-4 rounded-lg overflow-hidden">
                          <Square
                            fill={TaskStatusColor[taskData.status]}
                            strokeWidth={0}
                            className="w-4 h-4"
                          />
                        </div>
                      )
                    )}
                    <span
                      className={`text-xs ${
                        taskData.status == TaskStatus.COMPLETE
                          ? "text-green-500"
                          : "text-text-700"
                      }`}
                    >
                      {taskStatus.find(
                        ({ status }) => status === taskData.status
                      )?.label || "No status"}
                    </span>
                  </>
                )}
              </div>

              {taskData.status && (
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setTaskData({
                      ...taskData,
                      status: null,
                    });
                  }}
                  className="text-text-500 hover:text-text-700 p-[2px] hover:bg-text-100 rounded-lg hidden group-data-[state=status]:group-hover:inline-block absolute top-1/2 -translate-y-1/2 right-2"
                >
                  <X strokeWidth={1.5} className="w-4 h-4 text-text-500" />
                </button>
              )}
            </div>
          ) : (
            <div
              ref={triggerRef}
              className={`flex items-center gap-1 cursor-pointer p-1 px-2 rounded-lg border border-text-100 text-[11px ${
                isOpen ? "bg-text-50" : "hover:bg-text-100"
              }`}
              onClick={onClick}
            >
              {isSmall ? (
                <>
                  <span className="text-text-500">
                    {taskStatus.find(({ status }) => status === taskData.status)
                      ?.label || "No status"}
                  </span>
                </>
              ) : (
                <span className="text-text-700">
                  {taskStatus.find(({ status }) => status === taskData.status)
                    ?.label || "No status"}
                </span>
              )}

              {taskData.status && (
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setTaskData({
                      ...taskData,
                      status: null,
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
      items={taskStatus.map(({ label, status, color }, id) => ({
        id,
        label,
        onClick: () =>
          setTaskData({
            ...taskData,
            status,
          }),
        icon:
          status == TaskStatus.COMPLETE ? (
            <SquareCheck className="w-4 h-4 text-green-500" />
          ) : (
            <div className="w-4 h-4 rounded-lg overflow-hidden">
              <Square fill={color} strokeWidth={0} className="w-4 h-4" />
            </div>
          ),
        textColor: status == TaskStatus.COMPLETE ? "text-green-500" : undefined,
        rightContent: taskData.status == status && (
          <AnimatedTaskCheckbox
            priority={TaskPriority.P3}
            playSound={false}
            handleCheckSubmit={() =>
              setTaskData({
                ...taskData,
                status,
              })
            }
            is_completed={taskData.status == status}
          />
        ),
      }))}
    />
  );
};

export default StatusSelector;
