import { ProjectType } from "@/types/project";
import {
  AlignLeft,
  CalendarRange,
  Check,
  CheckCircle,
  CircleChevronUp,
  FoldHorizontal,
  MoreHorizontal,
  Tag,
  UnfoldHorizontal,
  UserPlus,
} from "lucide-react";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LayoutView from "./LayoutView";
import Image from "next/image";
import { ViewTypes } from "@/types/viewTypes";

const ViewSkeleton = ({
  projectData,
  activeView,
}: {
  projectData?: Omit<ProjectType, "id">;
  activeView: ViewTypes["view"];
}) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-lg border border-text-400 cursor-default select-none pointer-events-none w-full p-4 space-y-2 h-[666px]">
      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <CheckCircle
            size={28}
            className={`text-${
              projectData ? projectData.settings.color : "gray-500"
            }`}
          />
          {projectData ? (
            <h1 className="text-3xl font-bold p-1.5 h-8">
              {projectData.name}
            </h1>
          ) : (
            <Skeleton height={28} width={200} enableAnimation={false} borderRadius={"8px"} />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Skeleton
            width={24}
            height={24}
            enableAnimation={false}
            borderRadius={"8px"}
          />
          <Skeleton
            width={24}
            height={24}
            enableAnimation={false}
            borderRadius={"8px"}
          />
          <Skeleton
            width={24}
            height={24}
            enableAnimation={false}
            borderRadius={"8px"}
          />
        </div>
      </div>

      <div>
        <LayoutView view={activeView} setView={(v) => {}} forPreview />

        <div>
          {activeView == "List" ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-y border-text-200 text-xs whitespace-nowrap grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200">
                  <th className="p-2 text-left font-medium flex items-center gap-2 pl-8">
                    <AlignLeft strokeWidth={2} className="w-4 h-4" />
                    <span>Task name</span>
                  </th>
                  <th className="p-2 text-left font-medium flex items-center gap-2">
                    <UserPlus strokeWidth={2} className="w-4 h-4" />
                    <span>Assignee</span>
                  </th>
                  <th className="p-2 text-left font-medium flex items-center gap-2">
                    <CalendarRange strokeWidth={2} className="w-4 h-4" />
                    <span>Dates</span>
                  </th>
                  <th className="p-2 text-left font-medium flex items-center gap-2">
                    <CircleChevronUp strokeWidth={2} className="w-4 h-4" />
                    <span>Priority</span>
                  </th>
                  <th className="p-2 text-left font-medium flex items-center gap-2">
                    <Tag strokeWidth={2} className="w-4 h-4" />
                    <span>Labels</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan={5} className="p-0 w-full pb-4">
                    <tr className="border-b border-text-200 block">
                      <td colSpan={5} className=" p-2">
                        <h3 className="font-bold">To do</h3>
                      </td>
                    </tr>
                    <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                      <td className="p-2 flex items-center gap-2">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"60%"} />
                        </div>
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                    </tr>
                    <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                      <td className="p-2 flex items-center gap-2">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"60%"} />
                        </div>
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                    </tr>
                    <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                      <td className="p-2 flex items-center gap-2">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"60%"} />
                        </div>
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                    </tr>
                  </td>
                </tr>

                <tr>
                  <td colSpan={5} className="p-0 w-full pb-4">
                    <tr className="border-b border-text-200 block">
                      <td colSpan={5} className=" p-2">
                        <h3 className="font-bold">In Progress</h3>
                      </td>
                    </tr>
                    <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                      <td className="p-2 flex items-center gap-2">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"60%"} />
                        </div>
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                    </tr>
                    <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                      <td className="p-2 flex items-center gap-2">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"60%"} />
                        </div>
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                    </tr>
                    <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                      <td className="p-2 flex items-center gap-2">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"60%"} />
                        </div>
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                    </tr>
                  </td>
                </tr>

                <tr>
                  <td colSpan={5} className="p-0 w-full pb-12">
                    <tr className="border-b border-text-200 block">
                      <td colSpan={5} className=" p-2">
                        <h3 className="font-bold">Complete</h3>
                      </td>
                    </tr>
                    <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                      <td className="p-2 flex items-center gap-2">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"60%"} />
                        </div>
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                    </tr>
                    <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                      <td className="p-2 flex items-center gap-2">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"60%"} />
                        </div>
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                    </tr>
                    <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                      <td className="p-2 flex items-center gap-2">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"60%"} />
                        </div>
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                      <td className="p-2">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </td>
                    </tr>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : activeView == "Board" ? (
            <div className="space-x-4 mt-4 flex">
              <div className="bg-text-100 p-2 rounded-lg w-72 space-y-2 h-fit">
                <div className="flex justify-between items-center gap-8">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold pl-[6px]">To do</h3>
                    <p className="text-sm text-text-600">3</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FoldHorizontal
                      strokeWidth={1.5}
                      className="w-5 h-5 text-text-700"
                    />

                    <MoreHorizontal
                      strokeWidth={1.5}
                      className="w-5 h-5 text-text-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                    <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                      <Check strokeWidth={1.5} size={16} />
                    </div>

                    <div className="w-full">
                      <Skeleton enableAnimation={false} width={"60%"} />
                    </div>
                  </div>
                  <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                    <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                      <Check strokeWidth={1.5} size={16} />
                    </div>

                    <div className="w-full">
                      <Skeleton enableAnimation={false} width={"70%"} />
                    </div>
                  </div>
                  <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                    <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                      <Check strokeWidth={1.5} size={16} />
                    </div>

                    <div className="w-full">
                      <Skeleton enableAnimation={false} width={"60%"} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-text-100 p-2 rounded-lg w-72 space-y-2">
                <div className="flex justify-between items-center gap-8">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold pl-[6px]">In progress</h3>
                    <p className="text-sm text-text-600">2</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FoldHorizontal
                      strokeWidth={1.5}
                      className="w-5 h-5 text-text-700"
                    />

                    <MoreHorizontal
                      strokeWidth={1.5}
                      className="w-5 h-5 text-text-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-2 space-y-2 bg-background rounded-lg overflow-hidden">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-text-100">
                      <Image
                        src="/today.png"
                        alt=""
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                        <Check strokeWidth={1.5} size={16} />
                      </div>

                      <div className="w-full">
                        <Skeleton enableAnimation={false} width={"60%"} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton
                          enableAnimation={false}
                          width={170}
                          // height={10}
                        />
                      </div>

                      <Skeleton
                        enableAnimation={false}
                        width={24}
                        height={24}
                        borderRadius={9999}
                      />
                    </div>
                  </div>

                  <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                    <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                      <Check strokeWidth={1.5} size={16} />
                    </div>

                    <div className="w-full">
                      <Skeleton enableAnimation={false} width={"60%"} />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`bg-text-100 p-2 flex flex-col py-4 px-2 h-fit items-center justify-center gap-4 rounded-lg hover:transition-colors cursor-pointer `}
              >
                <button className={`p-1 pointer-events-none`}>
                  <UnfoldHorizontal
                    strokeWidth={1.5}
                    className="w-5 h-5 text-text-700"
                  />
                </button>

                <h3 className="font-bold vertical-text">Complete</h3>

                <p className="text-sm text-text-600 vertical-text">4</p>
              </div>
            </div>
          ) : activeView == "Calendar" ? (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton enableAnimation={false} width={100} />
                  <Skeleton enableAnimation={false} width={100} />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton enableAnimation={false} width={100} />
                  <Skeleton enableAnimation={false} width={100} />
                </div>
              </div>

              <div className="rounded-lg border-l border-text-200 overflow-hidden">
                <div className="grid grid-cols-7 place-items-center bg-text-100 border border-text-200 rounded-t-lg">
                  {days.map((day, _index) => (
                    <div
                      key={day}
                      className={`text-right text-text-500 border-text-300 w-full p-2 flex flex-col gap-1 items-end font-medium ${
                        _index === days.length - 1 ? "border-r-0" : "border-r"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 flex-1 rounded-b-lg">
                  {[...Array(35)].map((i, index) => {
                    return (
                      <div
                        key={index}
                        className={`h-full w-full p-2 border-r border-b border-text-200 transition space-y-1 aspect-square max-h-[93px]`}
                      >
                        <div className="flex items-center justify-end">
                          <div className="w-2 h-2 rounded-lg bg-text-200"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSkeleton;
