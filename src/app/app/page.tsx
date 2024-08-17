"use client";
import React, { useEffect, useState } from "react";
import { TaskType } from "@/types/project";
import LayoutWrapper from "../../components/LayoutWrapper";
import Image from "next/image";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { ViewTypes } from "@/types/viewTypes";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useAuthProvider } from "@/context/AuthContext";

const Today = () => {
  const { profile } = useAuthProvider();
  const [view, setView] = useState<ViewTypes["view"]>("List");
  const [todayTasks, setTodayTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    const fetchTodayTasks = async () => {
      const { data, error } = await supabaseBrowser
        .from("tasks")
        .select("*")
        .eq("due_date", new Date().toISOString().split("T")[0])
        .eq("profile_id", profile?.id);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setTodayTasks(data);
      }
    };

    fetchTodayTasks();
  }, [profile?.id]);

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
        setTasks={() => null}
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
