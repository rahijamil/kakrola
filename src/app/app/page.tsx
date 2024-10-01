"use client";
import React, { useEffect, useState } from "react";
import LayoutWrapper from "../../components/LayoutWrapper";
import Image from "next/image";
import { ViewTypes } from "@/types/viewTypes";
import ListViewForToday from "@/components/TaskViewSwitcher/ListViewForToday";
import BoardViewForToday from "@/components/TaskViewSwitcher/BoardViewForToday";
import { fetchTodayTasks } from "@/utils/fetchTodayTasks";
import { TaskType } from "@/types/project";
import { useAuthProvider } from "@/context/AuthContext";
import LayoutView from "@/components/LayoutView";
import { CalendarCheck, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { fetchUpcomingTasks } from "@/utils/fetchUpcomingTasks";

const TabsComponent = ({
  tabs,
  setTabs,
  hoverItem,
  setHoverItem,
}: {
  tabs: "today" | "upcoming";
  setTabs: (tab: "today" | "upcoming") => void;
  hoverItem: string | null;
  setHoverItem: (item: string | null) => void;
}) => {
  return (
    <ul className="flex items-center gap-1 relative">
      {["today", "upcoming"].map((tab) => (
        <li
          key={tab}
          className="relative"
          onMouseEnter={() => setHoverItem(tab)}
          onMouseLeave={() => setHoverItem(null)}
        >
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

          {(hoverItem === tab || tabs === tab) && (
            <motion.span
              layoutId="activeIndicator"
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
  const [hoverItem, setHoverItem] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchTodayTasks(profile.id).then((tasks) => {
        setTodayTasks(tasks);
      });
      fetchUpcomingTasks(profile.id).then((tasks) => {
        setUpcomingTasks(tasks);
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

  return (
    <LayoutWrapper
      headline="My Tasks"
      view={view}
      setView={setView}
      hideCalendarView
    >
      <div className="flex items-center justify-between gap-8 px-8 border-b border-text-100">
        {view && setView && <LayoutView view={view} setView={setView} />}

        <TabsComponent
          tabs={tabs}
          setTabs={setTabs}
          hoverItem={hoverItem}
          setHoverItem={setHoverItem}
        />
      </div>

      {renderTaskViewSwitcher()}

      {todayTasks.length === 0 && view === "List" && (
        <div className="flex items-center justify-center flex-col gap-1 h-[35vh] select-none">
          <Image
            src="/today.png"
            width={200}
            height={200}
            alt="Today"
            className="rounded-md object-cover"
            draggable={false}
          />
          <div className="text-center space-y-1 w-72">
            <h3 className="font-medium text-base">Your tasks for today</h3>
            <p className="text-sm text-text-600">
              Add your tasks here to focus on what’s important today.
            </p>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
};

export default MyTasksPage;
