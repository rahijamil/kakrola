import { ViewTypes } from "@/types/viewTypes";
import { CalendarDays, CircleHelp, SquareKanban } from "lucide-react";
import Image from "next/image";
import React from "react";

const views: {
  id: number;
  name: ViewTypes["view"];
  icon: React.JSX.Element;
}[] = [
  {
    id: 1,
    name: "List",
    icon: <SquareKanban size={24} strokeWidth={1.5} className="-rotate-90" />,
  },
  {
    id: 2,
    name: "Board",
    icon: <SquareKanban size={24} strokeWidth={1.5} />,
  },
  {
    id: 3,
    name: "Calendar",
    icon: (
      <div className="relative">
        <CalendarDays strokeWidth={1.5} size={24} />
        {/* <Image
          src="/ProIcon.svg"
          width={12}
          height={12}
          alt="List"
          className="absolute bottom-0 right-0"
        /> */}
      </div>
    ),
  },
];

const LayoutView = ({
  view,
  setView,
  showHelper,
  hideCalendarView,
}: {
  view: ViewTypes["view"];
  setView: (v: ViewTypes["view"]) => void;
  showHelper?: boolean;
  hideCalendarView?: boolean;
}) => {
  return (
    <div className="px-2 pt-2 space-y-2">
      <div className="flex items-center justify-between gap-8 font-bold">
        <h5 className="font-bold">View</h5>
        {showHelper && (
          <CircleHelp strokeWidth={1.5} className="w-5 h-5 text-text-500" />
        )}
      </div>

      <div>
        <ul className="bg-text-50 text-text-700 rounded-2xl overflow-hidden flex items-center gap-1 p-1">
          {views.map(
            (v) =>
              !(v.name === "Calendar" && hideCalendarView) && (
                <li
                  key={v.id}
                  className={`flex flex-col items-center justify-center gap-1 py-1 rounded-2xl cursor-pointer flex-1 transition border ${
                    v.name === view
                      ? "bg-surface border-text-200"
                      : "hover:bg-text-100 border-transparent"
                  }`}
                  onClick={() => setView(v.name)}
                >
                  {v.icon}
                  <span className="text-xs">{v.name}</span>
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  );
};

export default LayoutView;
