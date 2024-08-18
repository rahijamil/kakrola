"use client";
import React, { useEffect, useMemo, useState } from "react";
import { SectionType, TaskType } from "@/types/project";
import LayoutWrapper from "../../../components/LayoutWrapper";
import Image from "next/image";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { ViewTypes } from "@/types/viewTypes";
import { useAuthProvider } from "@/context/AuthContext";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";

const InboxPage = () => {
  const { tasks, sections, setSections, setTasks } =
    useTaskProjectDataProvider();
  const [view, setView] = useState<ViewTypes["view"]>("List");

  const inboxSections = useMemo(() => {
    return sections.filter((s) => s.is_inbox).sort((a, b) => a.order - b.order);
  }, [sections]);

  const inboxTasks = useMemo(() => {
    return tasks.filter((t) => t.is_inbox).sort((a, b) => a.order - b.order);
  }, [tasks]);

  const setInboxSections = (updatedSections: SectionType[]) => {
    setSections((prev) =>
      prev.map((section) =>
        section.is_inbox
          ? updatedSections.find((s) => s.id === section.id) || section
          : section
      )
    );
  };

  const setInboxTasks = (updatedTasks: TaskType[]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.is_inbox
          ? updatedTasks.find((t) => t.id === task.id) || task
          : task
      )
    );
  };

  return (
    <LayoutWrapper headline="Inbox" setView={setView} view={view}>
      <TaskViewSwitcher
        project={null}
        tasks={inboxTasks}
        setTasks={setInboxTasks}
        sections={inboxSections}
        setSections={setInboxSections}
        view={view}
      />

      {inboxTasks.length === 0 && view === "List" && (
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
