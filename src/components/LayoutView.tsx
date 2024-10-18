import { ViewTypes } from "@/types/viewTypes";
import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  MapPin,
  SquareKanban,
} from "lucide-react";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import Dropdown from "./ui/Dropdown";
import AnimatedTaskCheckbox from "./TaskViewSwitcher/AnimatedCircleCheck";
import { ProjectType, TaskPriority } from "@/types/project";
import useScreen from "@/hooks/useScreen";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import TabSwitcher from "./TabSwitcher";

const allViews: {
  id: ViewTypes["view"];
  name: ViewTypes["view"];
  icon: React.JSX.Element;
  visible: boolean;
}[] = [
  {
    id: "List",
    name: "List",
    icon: <SquareKanban size={16} strokeWidth={1.5} className="-rotate-90" />,
    visible: true, // List is always visible
  },
  {
    id: "Board",
    name: "Board",
    icon: <SquareKanban size={16} strokeWidth={1.5} />,
    visible: true,
  },
  // {
  //   id: 3,
  //   name: "Calendar",
  //   icon: (
  //     <div className="relative">
  //       <CalendarDays strokeWidth={1.5} size={16} />
  //       {/* <Image
  //         src="/ProIcon.svg"
  //         width={12}
  //         height={12}
  //         alt="List"
  //         className="absolute bottom-0 right-0"
  //       /> */}
  //     </div>
  //   ),
  //   visible: true,
  // },
  {
    id: "Dashboard",
    name: "Dashboard",
    icon: <LayoutDashboard size={16} strokeWidth={1.5} />,
    visible: true,
  },
  // {
  //   id: 5,
  //   name: "Map",
  //   icon: <MapPin strokeWidth={1.5} size={16} />,
  //   visible: true,
  // },
  // {
  //   id: 6,
  //   name: "Page",
  //   icon: <FileText size={16} strokeWidth={1.5} />,
  //   visible: true,
  // },
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
    id: ViewTypes["view"];
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

  const { isShowViewModal, setIsShowViewModal } = useSidebarDataProvider();
  const viewModalTrigger = useRef(null);

  const { screenWidth } = useScreen();

  return screenWidth > 768 ? (
    <div
      className={`flex items-center gap-1 ${
        view !== "List" && project && "border-b border-text-100"
      }`}
    >
      <TabSwitcher
        activeTab={view}
        tabItems={views
          .filter((v) => v.visible)
          .filter((v) => (hideCalendarView ? v.name !== "Calendar" : v))
          .map((item) => ({
            id: item.id.toString(),
            name: item.name,
            icon: item.icon,
            onClick: () => setView(item.id),
          }))}
        hideBottomBorder
        layoutId="layout_views"
      />

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
  ) : (
    <Dropdown
      isOpen={isShowViewModal}
      setIsOpen={setIsShowViewModal}
      triggerRef={viewModalTrigger}
      Label={() => null}
      items={views.map((v) => ({
        id: v.id,
        label: v.name,
        icon: v.icon,
        onClick: () => setView(v.name),
        rightContent: v.name == view && (
          <AnimatedTaskCheckbox
            priority={TaskPriority.P3}
            playSound={false}
            handleCheckSubmit={() => setView(v.name)}
            is_completed={v.name == view}
          />
        ),
      }))}
      title="View"
    />
  );
};

export default LayoutView;
