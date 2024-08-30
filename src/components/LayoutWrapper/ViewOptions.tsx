import React, { useEffect, useState, useCallback, useRef } from "react";
import LayoutView from "../LayoutView";
import { ViewTypes } from "@/types/viewTypes";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { Check, SlidersHorizontal } from "lucide-react";
import { TaskType } from "@/types/project";
import Dropdown from "../ui/Dropdown";

const ViewOptions = React.memo(
  ({
    view,
    setView,
    hideCalendarView,
    tasks = [],
    setTasks,
  }: {
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
    }, [showCompletedTasks, setTasks, tasks]);

    const [isOpen, setIsOpen] = useState(false);

    const triggerRef = useRef(null);

    return (
      <Dropdown
        triggerRef={triggerRef}
        Label={({ onClick }) => (
          <button
            ref={triggerRef}
            className={`${
              isOpen ? "bg-text-50" : "hover:bg-text-100"
            } transition px-3 p-1 pr-2 rounded-full cursor-pointer flex items-center gap-1 text-text-500`}
            onClick={onClick}
          >
            <SlidersHorizontal
              strokeWidth={1.5}
              className="w-4 h-4"
            />
            <span className="hidden md:inline-block">Filters</span>
          </button>
        )}
        content={
          <div className="text-xs p-1">
            <div className="space-y-2">
              <div
                className="flex justify-between items-center hover:bg-text-100 transition cursor-pointer py-[6px] px-3 rounded-2xl"
                onClick={toggleShowCompletedTasks}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`border w-5 h-5 rounded-full flex items-center justify-center ${
                      showCompletedTasks
                        ? "border-primary-600 bg-primary-500"
                        : "border-text-400 bg-surface"
                    }`}
                  >
                    <Check
                      strokeWidth={1.5}
                      className={`w-[14px] h-[14px] transition ${
                        showCompletedTasks ? "text-white" : "text-text-500"
                      }`}
                    />
                  </div>
                  <span>Completed tasks</span>
                </div>

                <ToggleSwitch
                  checked={showCompletedTasks}
                  onCheckedChange={setShowCompletedTasks}
                />
              </div>
            </div>
          </div>
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        contentWidthClass="w-[300px]"
      />
    );
  }
);

ViewOptions.displayName = "ViewOptions";

export default ViewOptions;
