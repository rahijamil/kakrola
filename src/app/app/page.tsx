"use client";
import React, { useMemo, useState } from "react";
import LayoutWrapper from "../../components/LayoutWrapper";
import Image from "next/image";
import { ViewTypes } from "@/types/viewTypes";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { isToday } from "date-fns";
import ListViewForToday from "@/components/TaskViewSwitcher/ListViewForToday";
import BoardViewForToday from "@/components/TaskViewSwitcher/BoardViewForToday";
import AppWrapper from "./AppLayoutWrapper";
const Today = () => {
  const { tasks, setTasks } = useTaskProjectDataProvider();
  const [view, setView] = useState<ViewTypes["view"]>("List");

  const todayTasks = useMemo(() => {
    return tasks
      .filter((t) => t.due_date && isToday(new Date(t.due_date)))
      .sort((a, b) => a.order - b.order);
  }, [tasks]);

  const renderTaskViewSwitcherForToday = () => {
    switch (view) {
      case "List":
        return (
          <ListViewForToday
            tasks={todayTasks}
            setTasks={setTasks}
          />
        );
      case "Board":
        return (
          <BoardViewForToday
            tasks={todayTasks}
            setTasks={setTasks}
          />
        );

      default:
        return <div>Invalid view selected</div>;
    }
  };

  return (
    <AppWrapper>
      <LayoutWrapper
        headline="Today"
        view={view}
        setView={setView}
        hideCalendarView
      >
        {renderTaskViewSwitcherForToday()}

        {todayTasks.length === 0 && view === "List" && (
          <div className="flex items-center justify-center flex-col gap-1 h-[35vh] select-none">
            <Image
              src="/today.png"
              width={200}
              height={200}
              alt="Today"
              className="rounded-full object-cover"
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
    </AppWrapper>
  );
};

export default Today;
