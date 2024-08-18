"use client";
import React, { useMemo, useState } from "react";
import { TaskType } from "@/types/project";
import LayoutWrapper from "../../components/LayoutWrapper";
import Image from "next/image";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { ViewTypes } from "@/types/viewTypes";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
const Today = () => {
  const { tasks, setTasks } = useTaskProjectDataProvider();
  const [view, setView] = useState<ViewTypes["view"]>("List");

  const todayTasks = useMemo(() => {
    return (
      tasks
        // .filter(
        //   (t) => projects.find((p) => p.id === t.project_id)?.team_id == null
        // )
        .sort((a, b) => a.order - b.order)
    );
  }, [tasks]);

  return (
    <LayoutWrapper
      headline="Today"
      setView={setView}
      view={view}
      hideCalendarView
    >
      <TaskViewSwitcher
        tasks={todayTasks}
        sections={[]}
        setTasks={setTasks}
        view={view}
        project={null}
        setSections={() => null}
      />

      {todayTasks.length == 0 && view == "List" && (
        <div className="flex items-center justify-center flex-col gap-1 h-[30vh] select-none">
          <Image
            src="/today.png"
            width={220}
            height={200}
            alt="Today"
            className="rounded-full object-cover"
            draggable={false}
          />

          <div className="text-center space-y-1 w-72">
            <h3 className="font-medium text-base">
              What do you need to get done today?
            </h3>
            <p className="text-sm text-gray-600">
              By default, tasks added here will be due today.
            </p>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
};

export default Today;
