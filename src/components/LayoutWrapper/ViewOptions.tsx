import React, { useEffect, useState, useCallback } from "react";
import LayoutView from "../LayoutView";
import { ViewTypes } from "@/types/viewTypes";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { Check } from "lucide-react";
import { TaskType } from "@/types/project";

const ViewOptions = React.memo(
  ({
    onClose,
    view,
    setView,
    hideCalendarView,
    tasks = [],
    setTasks,
  }: {
    onClose: () => void;
    view?: ViewTypes["view"];
    setView: (value: ViewTypes["view"]) => void;
    hideCalendarView?: boolean;
    setTasks?: (updatedTasks: TaskType[]) => void;
    tasks?: TaskType[];
  }) => {
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);

    const toggleShowCompletedTasks = useCallback(() => {
      setShowCompletedTasks((prev) => !prev);
    }, []);

    useEffect(() => {
      if (setTasks) {
        const updatedTasks = showCompletedTasks
          ? tasks
          : tasks.filter((t) => !t.is_completed);

        // Update only if tasks have changed
        if (
          tasks.length !== updatedTasks.length ||
          tasks.some((t, index) => t.id !== updatedTasks[index].id)
        ) {
          setTasks(updatedTasks);
        }
      }
    }, [showCompletedTasks, setTasks]);

    return (
      <>
        <div className="absolute bg-white drop-shadow-md rounded-md border border-gray-200 pt-3 pb-1 w-[300px] top-full right-0 z-20 text-xs">
          <div className="space-y-2">
            <div className="px-3">
              {view && (
                <LayoutView
                  view={view}
                  setView={setView}
                  showHelper
                  hideCalendarView={hideCalendarView}
                />
              )}
            </div>

            {/* <div
              className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md"
              onClick={toggleShowCompletedTasks}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`border w-5 h-5 rounded-full flex items-center justify-center ${
                    showCompletedTasks
                      ? "border-indigo-600 bg-indigo-600"
                      : "border-gray-400 bg-white"
                  }`}
                >
                  <Check
                    strokeWidth={1.5}
                    className={`w-[14px] h-[14px] transition ${
                      showCompletedTasks ? "text-white" : "text-gray-500"
                    }`}
                  />
                </div>
                <span>Completed tasks</span>
              </div>

              <ToggleSwitch
                checked={showCompletedTasks}
                onCheckedChange={setShowCompletedTasks}
              />
            </div> */}
          </div>
        </div>

        <div
          className="fixed top-0 left-0 bottom-0 right-0 z-10"
          onClick={onClose}
        ></div>
      </>
    );
  }
);

ViewOptions.displayName = "ViewOptions";

export default ViewOptions;
