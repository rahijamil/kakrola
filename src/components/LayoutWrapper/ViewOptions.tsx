import React, { useState } from "react";
import LayoutView from "../LayoutView";
import { ViewTypes } from "@/types/viewTypes";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import {
  ArrowUpDown,
  Calendar,
  Check,
  ChevronDown,
  Flag,
  Group,
  HelpCircle,
  Tag,
} from "lucide-react";

const ViewOptions = ({
  onClose,
  view,
  setView,
  hideCalendarView,
}: {
  onClose: () => void;
  view?: ViewTypes["view"];
  setView: (value: ViewTypes["view"]) => void;
  hideCalendarView?: boolean;
}) => {
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  return (
    <>
      <div className="absolute bg-white drop-shadow-md rounded-md border border-gray-200 pt-3 pb-1 w-[300px] top-full right-0 z-20">
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

          <div
            className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md"
            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`border border-gray-400 w-5 h-5 rounded-md flex items-center justify-center`}
              >
                <Check
                  strokeWidth={1.5}
                  className={`w-3 h-3 transition text-gray-500`}
                />
              </div>
              <span>Completed tasks</span>
            </div>

            <ToggleSwitch
              checked={showCompletedTasks}
              onCheckedChange={(value) => setShowCompletedTasks(value)}
            />
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 my-1"></div>

        <div>
          <div className="flex items-center justify-between gap-8 font-bold mb-[6px] mt-2 px-3">
            <h5>Sort by</h5>
            <HelpCircle strokeWidth={1.5} className="w-5 h-5 text-gray-500" />
          </div>

          <div>
            <ul>
              <li className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md">
                <div className="flex items-center gap-2">
                  <Group strokeWidth={1.5} className="w-5 h-5 text-gray-500" />
                  Grouping
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>None (default)</span>
                  <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md">
                <div className="flex items-center gap-[10px]">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <ArrowUpDown
                      strokeWidth={1.5}
                      className="w-5 h-5 text-gray-500"
                    />
                  </div>
                  Sorting
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>None (default)</span>
                  <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 my-1"></div>

        <div>
          <div className="flex items-center justify-between gap-8 font-bold mb-[6px] mt-2 px-3">
            <h5>Filter by</h5>
            <HelpCircle strokeWidth={1.5} className="w-5 h-5 text-gray-500" />
          </div>

          <div>
            <ul>
              <li className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Calendar
                      strokeWidth={1.5}
                      className="w-5 h-5 text-gray-500"
                    />
                  </div>
                  Due date
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>All (default)</span>
                  <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md">
                <div className="flex items-center gap-[10px]">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Flag strokeWidth={1.5} className="w-5 h-5 text-gray-500" />
                  </div>
                  Priority
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>P4</span>
                  <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md">
                <div className="flex items-center gap-[10px]">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Tag strokeWidth={1.5} className="w-5 h-5 text-gray-500" />
                  </div>
                  Label
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>@goals</span>
                  <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 my-1"></div>

        <div>
          <ul>
            <li className="flex justify-between items-center hover:bg-gray-100 text-red-600 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md">
              Reset all
            </li>
          </ul>
        </div>
      </div>

      <div
        className="fixed top-0 left-0 bottom-0 right-0 z-10"
        onClick={onClose}
      ></div>
    </>
  );
};

export default ViewOptions;
