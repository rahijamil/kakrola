import { ViewTypes } from "@/types/viewTypes";
import {
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  SquareKanban,
} from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Dropdown from "./ui/Dropdown";
import AnimatedTaskCheckbox from "./TaskViewSwitcher/AnimatedCircleCheck";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ProjectType } from "@/types/project";

const allViews: {
  id: number;
  name: ViewTypes["view"];
  icon: React.JSX.Element;
  visible: boolean;
}[] = [
  {
    id: 1,
    name: "List",
    icon: <SquareKanban size={16} strokeWidth={1.5} className="-rotate-90" />,
    visible: true, // List is always visible
  },
  {
    id: 2,
    name: "Board",
    icon: <SquareKanban size={16} strokeWidth={1.5} />,
    visible: true,
  },
  {
    id: 3,
    name: "Calendar",
    icon: (
      <div className="relative">
        <CalendarDays strokeWidth={1.5} size={16} />
        {/* <Image
          src="/ProIcon.svg"
          width={12}
          height={12}
          alt="List"
          className="absolute bottom-0 right-0"
        /> */}
      </div>
    ),
    visible: false,
  },
  {
    id: 4,
    name: "Dashboard",
    icon: <LayoutDashboard size={16} strokeWidth={1.5} />,
    visible: false,
  },
];

const LayoutView = ({
  view,
  setView,
  showHelper,
  hideCalendarView,
  project,
}: {
  view: ViewTypes["view"];
  setView: (v: ViewTypes["view"]) => void;
  showHelper?: boolean;
  hideCalendarView?: boolean;
  project: ProjectType;
}) => {
  const [views, setViews] = useState(
    allViews.map((v) => ({
      ...v,
      visible:
        v.name === "List" || project.settings.selected_views.includes(v.name), // Ensure List is always visible
    }))
  );

  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectedViews = async (v: {
    id: number;
    name: ViewTypes["view"];
  }) => {
    // Prevent toggling the "List" view
    if (v.name === "List") return;

    try {
      // Toggle visibility of the view
      const data = views.map((old) =>
        old.id === v.id ? { ...old, visible: !old.visible } : old
      );
      setViews(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <ul className="flex items-center gap-1">
        {views
          .filter((v) => v.visible)
          .map(
            (v) =>
              !(v.name === "Calendar" && hideCalendarView) && (
                <li
                  key={v.id}
                  className={`flex items-center justify-center gap-1 rounded-2xl cursor-pointer flex-1 transition px-3 p-1 pr-2 text-text-500 ${
                    v.name === view ? "bg-text-100" : "hover:bg-text-100"
                  }`}
                  onClick={() => setView(v.name)}
                >
                  {v.icon}
                  <span className="">{v.name}</span>
                </li>
              )
          )}
      </ul>

      <Dropdown
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        triggerRef={triggerRef}
        Label={({ onClick }) => (
          <div
            ref={triggerRef}
            className={`rounded-full cursor-pointer transition p-1.5 text-text-500 ${
              "" ? "bg-text-100" : "hover:bg-text-100"
            }`}
            onClick={onClick}
          >
            <ChevronDown size={16} />
          </div>
        )}
        items={views.map((v) => ({
          id: v.id,
          label: v.name,
          icon: v.icon,
          disabled: v.name === "List", // List view is disabled
          onClick: () => handleSelectedViews(v),
          rightContent: (
            <AnimatedTaskCheckbox
              priority={v.name === "List" ? "Priority" : "P3"}
              playSound={false}
              handleCheckSubmit={() => handleSelectedViews(v)}
              is_completed={v.visible}
              disabled={v.name === "List"}
            />
          ),
        }))}
        autoClose={false}
      />
    </div>
  );
};

export default LayoutView;
