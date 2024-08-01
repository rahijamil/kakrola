import React, { Dispatch, SetStateAction, useState } from "react";
import LayoutView from "../LayoutView";
import {
  ArrowsUpDownIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  FlagIcon,
  QuestionMarkCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { ToggleSwitch } from "../ui";
import { ViewTypes } from "@/types/viewTypes";

const ViewOptions = ({
  onClose,
  view,
  setView,
  hideCalendarView,
}: {
  onClose: () => void;
  view?: ViewTypes["view"];
  setView: Dispatch<SetStateAction<ViewTypes["view"]>>;
  hideCalendarView?: boolean;
}) => {
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  return (
    <>
      <div className="absolute bg-white drop-shadow-md rounded-md border border-gray-200 pt-3 pb-1 w-[300px] top-full right-0 z-20">
        <div className="space-y-2">
          <div className="px-3">
            {view && <LayoutView view={view} setView={setView} showHelper hideCalendarView={hideCalendarView} />}
          </div>

          <div
            className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md"
            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`border border-gray-400 w-5 h-5 rounded-full flex items-center justify-center`}
              >
                <CheckIcon className={`w-3 h-3 transition`} />
              </div>
              <span>Completed tasks</span>
            </div>

            <ToggleSwitch
              enabled={showCompletedTasks}
              setEnabled={setShowCompletedTasks}
            />
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 my-1"></div>

        <div>
          <div className="flex items-center justify-between gap-8 font-bold mb-[6px] mt-2 px-3">
            <h5>Sort by</h5>
            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-500" />
          </div>

          <div>
            <ul>
              <li className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M18 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12Zm0 1H6a2 2 0 0 0-1.995 1.85L4 6v12a2 2 0 0 0 1.85 1.994L6 20h12a2 2 0 0 0 1.994-1.85L20 18V6a2 2 0 0 0-1.85-1.995L18 4Zm-3 4.5A1.5 1.5 0 0 0 13.5 7h-5A1.5 1.5 0 0 0 7 8.5v5A1.5 1.5 0 0 0 8.5 15h5a1.5 1.5 0 0 0 1.5-1.5v-5ZM8.5 8h5l.09.008A.5.5 0 0 1 14 8.5v5l-.008.09a.5.5 0 0 1-.492.41h-5l-.09-.008A.5.5 0 0 1 8 13.5v-5l.008-.09A.5.5 0 0 1 8.5 8Zm.585 8a1.5 1.5 0 0 0 1.415 1h5a1.5 1.5 0 0 0 1.5-1.5v-5a1.5 1.5 0 0 0-1-1.415V15.5a.5.5 0 0 1-.5.5H9.085Z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Grouping
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>None (default)</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md">
                <div className="flex items-center gap-[10px]">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <ArrowsUpDownIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  Sorting
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>None (default)</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 my-1"></div>

        <div>
          <div className="flex items-center justify-between gap-8 font-bold mb-[6px] mt-2 px-3">
            <h5>Filter by</h5>
            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-500" />
          </div>

          <div>
            <ul>
              <li className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  Due date
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>All (default)</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md">
                <div className="flex items-center gap-[10px]">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <FlagIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  Priority
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>P4</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 transition cursor-pointer py-[6px] px-3 mx-1 rounded-md">
                <div className="flex items-center gap-[10px]">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <TagIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  Label
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>@goals</span>
                  <ChevronDownIcon className="w-4 h-4" />
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
