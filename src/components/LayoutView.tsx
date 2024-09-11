import { ViewTypes } from "@/types/viewTypes";
import {
  CalendarDays,
  ChevronDown,
  File,
  LayoutDashboard,
  Plus,
  SquareKanban,
} from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Dropdown from "./ui/Dropdown";
import AnimatedTaskCheckbox from "./TaskViewSwitcher/AnimatedCircleCheck";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ProjectType, TaskPriority } from "@/types/project";

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
    visible: true,
  },
  {
    id: 4,
    name: "Dashboard",
    icon: <LayoutDashboard size={16} strokeWidth={1.5} />,
    visible: true,
  },
  {
    id: 5,
    name: "Page",
    icon: <File size={16} strokeWidth={1.5} />,
    visible: true,
  },
];

const LayoutView = ({
  view,
  setView,
  showHelper,
  hideCalendarView,
  project,
  forPreview,
}: {
  view: ViewTypes["view"];
  setView: (v: ViewTypes["view"]) => void;
  showHelper?: boolean;
  hideCalendarView?: boolean;
  project?: ProjectType;
  forPreview?: boolean;
}) => {
  // const [views, setViews] = useState(
  //   allViews.map((v) => ({
  //     ...v,
  //     visible:
  //       v.name === "List" || v.name === "Board" || forPreview
  //         ? true
  //         : project?.settings.selected_views.includes(v.name), // Ensure List/Board is always visible
  //   }))
  // );
  const [views, setViews] = useState(allViews);

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
    <div
      className={`flex items-center gap-1 ${
        view !== "List" && "border-b border-text-200 mb-4"
      }`}
    >
      <ul className="flex items-center gap-1">
        {views
          .filter((v) => v.visible)
          .map(
            (v) =>
              !(v.name === "Calendar" && hideCalendarView) && (
                <li
                  key={v.id}
                  className={`border-b-2 pb-1 ${
                    v.name == view ? "border-text-700" : "border-transparent"
                  }`}
                >
                  <button
                    className={`flex items-center justify-center gap-1 rounded-lg cursor-pointer flex-1 transition px-2 p-1 hover:bg-text-100 hover:text-text-700 text-text-500 ${
                      v.name === view && "text-text-700"
                    }`}
                    onClick={() => setView(v.name)}
                  >
                    {v.icon}
                    <span className="">{v.name}</span>
                  </button>
                </li>
              )
          )}
      </ul>

      {/* {!forPreview && (
        <Dropdown
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          triggerRef={triggerRef}
          Label={({ onClick }) => (
            <div
              ref={triggerRef}
              className={`rounded-lg cursor-pointer transition p-1.5 text-text-500 mb-1.5 ${
                "" ? "bg-text-100" : "hover:bg-text-100"
              }`}
              onClick={onClick}
            >
              <Plus size={16} />
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
                priority={
                  v.name === "List" ? TaskPriority.Priority : TaskPriority.P3
                }
                playSound={false}
                handleCheckSubmit={() => handleSelectedViews(v)}
                is_completed={v.visible!}
                disabled={v.name === "List"}
              />
            ),
          }))}
          autoClose={false}
        />
      )} */}
    </div>
  );
};

export default LayoutView;
