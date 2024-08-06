"use client";
import React, { useEffect, useState } from "react";
import { SectionType, TaskType } from "@/types/project";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import LayoutWrapper from "../../../components/LayoutWrapper";
import Image from "next/image";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { ViewTypes } from "@/types/viewTypes";

const InboxPage = () => {
  const { tasks, sections, setTasks } = useTaskProjectDataProvider();
  const [view, setView] = useState<ViewTypes["view"]>("List");
  const [inboxTasks, setInboxTasks] = useState<TaskType[]>([]);
  const [inboxSections, setInboxSections] = useState<SectionType[]>([]);

  const handleTaskUpdate = (updatedTask: TaskType) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  useEffect(() => {
    setInboxTasks(tasks.filter((task) => task.isInbox));
  }, [tasks]);

  useEffect(() => {
    setInboxSections(
      sections.filter((section) =>
        inboxTasks.map((t) => t.sectionId).includes(section.id)
      )
    );
  }, [inboxTasks, sections]);

  return (
    <LayoutWrapper headline="Inbox" setView={setView} view={view}>
      <TaskViewSwitcher
        tasks={inboxTasks}
        view={view}
        sections={inboxSections}
        onTaskUpdate={handleTaskUpdate}
      />

      {tasks.filter((task) => task.isInbox).length == 0 && view == "List" && (
        <div className="flex items-center justify-center flex-col gap-1 h-[30vh] select-none">
          <Image
            src="/inbox.png"
            width={220}
            height={200}
            alt="Today"
            className="rounded-full object-cover"
            draggable={false}
          />

          <div className="text-center space-y-1 w-72">
            <h3 className="font-medium text-base">
              Your peace of mind is priceless
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

export default InboxPage;
