"use client";
import React, { useState } from "react";
import { Task } from "@/types/project";
import AddTaskTextButton from "@/components/AddTaskTextButton";
import AddTask from "@/components/AddTask";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import LayoutWrapper from "../../../components/LayoutWrapper";
import Image from "next/image";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { ViewTypes } from "@/types/viewTypes";

const Home = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const { tasks, setTasks } = useTaskProjectDataProvider();
  const [view, setView] = useState<ViewTypes["view"]>("List");

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  return (
    <LayoutWrapper headline="Inbox" setView={setView} view={view}>
      {tasks.length > 0 ? (
        <>
          <TaskViewSwitcher
            tasks={tasks}
            view={view}
            onTaskUpdate={handleTaskUpdate}
          />

          <div className="my-6">
            {!showAddTask && (
              <AddTaskTextButton handleAddTask={() => setShowAddTask(true)} />
            )}

            {showAddTask && <AddTask onClose={() => setShowAddTask(false)} />}
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            {!showAddTask && (
              <AddTaskTextButton handleAddTask={() => setShowAddTask(true)} />
            )}
          </div>

          {showAddTask && <AddTask onClose={() => setShowAddTask(false)} />}
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
        </>
      )}
    </LayoutWrapper>
  );
};

export default Home;
