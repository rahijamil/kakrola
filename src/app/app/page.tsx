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

const TabsComponent = ({
  tabs,
  setTabs,
}: {
  tabs: "today" | "upcoming";
  setTabs: React.Dispatch<React.SetStateAction<"today" | "upcoming">>;
}) => {
  return (
    <ul className="flex items-center gap-1 relative">
      {["today", "upcoming"].map((tab) => (
        <li key={tab} className="relative">
          <button
            className={`flex items-center justify-center gap-1 rounded-lg cursor-pointer flex-1 transition px-2 p-1 hover:bg-text-100 hover:text-primary-500 ${
              tabs === tab ? "text-primary-500" : "text-text-500"
            }`}
            onClick={() => setTabs(tab as "today" | "upcoming")}
          >
            {tab === "today" ? (
              <CalendarCheck strokeWidth={1.5} className="w-4 h-4" />
            ) : (
              <CalendarDays strokeWidth={1.5} className="w-4 h-4" />
            )}
            <span className="capitalize">{tab}</span>
          </button>

          {tabs === tab && (
            <motion.span
              layoutId="myTaskActiveIndicator"
              className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

const MyTasksPage = () => {
  const [view, setView] = useState<ViewTypes["view"]>("List");
  const [tabs, setTabs] = useState<"today" | "upcoming">("today");
  const [todayTasks, setTodayTasks] = useState<TaskType[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<TaskType[]>([]);
  const { profile } = useAuthProvider();

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
    const tasks = tabs === "today" ? todayTasks : upcomingTasks;
    switch (view) {
      case "List":
        return (
          <ListViewForToday
            tasks={tasks}
            setTasks={tabs === "today" ? setTodayTasks : setUpcomingTasks}
          />
        );
      case "Board":
        return (
          <BoardViewForToday
            tasks={tasks}
            setTasks={tabs === "today" ? setTodayTasks : setUpcomingTasks}
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

        <TabsComponent tabs={tabs} setTabs={setTabs} />
      </div>

      {renderTaskViewSwitcher()}
    </LayoutWrapper>
  ) : (
    <Sidebar sidebarWidth={screenWidth} />
  );
};

export default MyTasksPage;
