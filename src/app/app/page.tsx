"use client";
import React, { useState } from "react";
import { Task } from "@/types/project";
import LayoutWrapper from "../../components/LayoutWrapper";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import Image from "next/image";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { ViewTypes } from "@/types/viewTypes";

const Home = () => {
  const { tasks, setTasks } = useTaskProjectDataProvider();
  const [view, setView] = useState<ViewTypes["view"]>("List");

  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  return (
    <LayoutWrapper
      headline="Today"
      setView={setView}
      view={view}
      hideCalendarView
    >
      <TaskViewSwitcher
        tasks={[]}
        view={view}
        onTaskUpdate={handleTaskUpdate}
      />

      {tasks.filter(
        (task) =>
          new Date(task.dueDate).toDateString() == new Date().toDateString()
      ).length == 0 &&
        view == "List" && (
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

export default Home;
