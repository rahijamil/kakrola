"use client";
import React, { useEffect, useState } from "react";
import LayoutWrapper from "../../components/LayoutWrapper";
import Image from "next/image";
import { ViewTypes } from "@/types/viewTypes";
import ListViewForToday from "@/components/TaskViewSwitcher/ListViewForToday";
import BoardViewForToday from "@/components/TaskViewSwitcher/BoardViewForToday";
import { TaskType } from "@/types/project";
import { useAuthProvider } from "@/context/AuthContext";
import LayoutView from "@/components/LayoutView";
import { CalendarCheck, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { fetchTodayUpcomingTasks } from "@/utils/fetchTodayUpcomingTasks";
import useScreen from "@/hooks/useScreen";
import Sidebar from "@/components/SidebarWrapper/Sidebar";
import TabSwitcher from "@/components/TabSwitcher";
import { TabItem } from "@/types/types.utils";

const MyTasksPage = () => {
  const [view, setView] = useState<ViewTypes["view"]>("List");
  const [activeTab, setActiveTab] = useState("today");
  const [todayTasks, setTodayTasks] = useState<TaskType[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<TaskType[]>([]);
  const { profile } = useAuthProvider();

  const tabItems: TabItem[] = [
    {
      id: "today",
      name: "Today",
      icon: <CalendarCheck strokeWidth={1.5} className="w-4 h-4" />,
      onClick: () => setActiveTab("today"),
    },
    {
      id: "upcoming",
      name: "Upcoming",
      icon: <CalendarDays strokeWidth={1.5} className="w-4 h-4" />,
      onClick: () => setActiveTab("upcoming"),
    },
  ];

  const { screenWidth } = useScreen();

  useEffect(() => {
    if (profile?.id) {
      fetchTodayUpcomingTasks(profile.id).then((tasks) => {
        setTodayTasks(tasks.today);
        setUpcomingTasks(tasks.upcoming);
      });
    }
  }, [profile?.id]);

  const renderTaskViewSwitcher = () => {
    const tasks = activeTab === "today" ? todayTasks : upcomingTasks;
    switch (view) {
      case "List":
        return (
          <ListViewForToday
            tasks={tasks}
            setTasks={activeTab === "today" ? setTodayTasks : setUpcomingTasks}
          />
        );
      case "Board":
        return (
          <BoardViewForToday
            tasks={tasks}
            setTasks={activeTab === "today" ? setTodayTasks : setUpcomingTasks}
          />
        );
      default:
        return <div>Invalid view selected</div>;
    }
  };

  return screenWidth > 768 ? (
    <LayoutWrapper
      headline="My Tasks"
      view={view}
      setView={setView}
      hideCalendarView
    >
      <div
        className={`flex items-center justify-between gap-8 px-4 md:px-8 ${
          view !== "List" && "border-b border-text-100"
        }`}
      >
        {view && setView && screenWidth > 768 && (
          <LayoutView view={view} setView={setView} />
        )}

        <TabSwitcher
          tabItems={tabItems}
          activeTab={activeTab}
          hideBottomBorder
          layoutId="my_task"
        />
      </div>

      {activeTab == "today" ? (
        todayTasks?.length === 0 && view === "List" ? (
          <div className="flex items-center justify-center flex-col gap-1 h-[40vh] select-none">
            <Image
              src="/project.png"
              width={220}
              height={200}
              alt="Empty project"
              className="rounded-md object-cover"
              draggable={false}
            />
            <div className="text-center space-y-1 max-w-sm">
              <h3 className="font-medium text-base">
                Task assigned to you for today
              </h3>
              <p className="text-sm text-text-600">
                Add your tasks or find a template to get started with your
                project.
              </p>
            </div>
          </div>
        ) : (
          renderTaskViewSwitcher()
        )
      ) : upcomingTasks?.length === 0 && view === "List" ? (
        <div className="flex items-center justify-center flex-col gap-1 h-[40vh] select-none">
          <Image
            src="/project.png"
            width={220}
            height={200}
            alt="Empty project"
            className="rounded-md object-cover"
            draggable={false}
          />
          <div className="text-center space-y-1 max-w-sm">
            <h3 className="font-medium text-base">
              Task assigned to you for upcoming days
            </h3>
            <p className="text-sm text-text-600">
              Add your tasks or find a template to get started with your
              project.
            </p>
          </div>
        </div>
      ) : (
        renderTaskViewSwitcher()
      )}
    </LayoutWrapper>
  ) : (
    <Sidebar sidebarWidth={screenWidth} />
  );
};

export default MyTasksPage;
