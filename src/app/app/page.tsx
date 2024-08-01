"use client";
import React, { useState } from "react";
import { Task } from "@/types/project";
import LayoutWrapper from "../../components/LayoutWrapper";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import Image from "next/image";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { ViewTypes } from "@/types/viewTypes";

const Home = () => {
  const { tasks, setTasks, projects } = useTaskProjectDataProvider();
  const [view, setView] = useState<ViewTypes["view"]>("List");

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  return (
    <LayoutWrapper headline="Today" setView={setView} view={view} hideCalendarView>
      <TaskViewSwitcher
        tasks={tasks}
        view={view}
        onTaskUpdate={handleTaskUpdate}
      />

      {tasks.length == 0 && (
        <div className="flex items-center justify-center flex-col gap-4 h-[50vh] select-none">
          <Image
            src="/today.png"
            width={200}
            height={200}
            alt="Today"
            className="rounded-full object-cover"
            draggable={false}
          />
          <h3 className="font-bold text-xl">
            What do you need to get done today?
          </h3>
          <p className="text-sm font-thin">
            By default, tasks added here will be due today.
          </p>
        </div>
      )}
    </LayoutWrapper>
  );
};

export default Home;
