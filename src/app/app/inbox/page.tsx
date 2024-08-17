"use client";
import React, { useEffect, useState } from "react";
import { SectionType, TaskType } from "@/types/project";
import LayoutWrapper from "../../../components/LayoutWrapper";
import Image from "next/image";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { ViewTypes } from "@/types/viewTypes";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useAuthProvider } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";

const InboxPage = () => {
  const { profile } = useAuthProvider();
  const [view, setView] = useState<ViewTypes["view"]>("List");
  const [inboxTasks, setInboxTasks] = useState<TaskType[]>([]);
  const [inboxSections, setInboxSections] = useState<SectionType[]>([]);

  const [loading, setLoading] = useState(true);

  const handleTaskUpdate = (updatedTask: TaskType) => {
    setInboxTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  useEffect(() => {
    const fetchTasksAndSections = async () => {
      if (profile?.id) {
        const { data: tasksData, error: tasksError } = await supabaseBrowser
          .from("tasks")
          .select("*")
          .eq("is_inbox", true)
          .eq("profile_id", profile?.id);

        if (tasksError) {
          console.error(tasksError);
        } else {
          setInboxTasks(tasksData || []);
        }

        const { data: sectionData, error: sectionError } = await supabaseBrowser
          .from("sections")
          .select("*")
          .eq("is_inbox", true)
          .eq("profile_id", profile?.id);

        if (sectionError) {
          console.error(sectionError);
        } else {
          setInboxSections(sectionData || []);
        }
      }

      setLoading(false);
    };

    fetchTasksAndSections();

    // Subscribe to real-time changes for tasks
    const tasksSubscription = supabaseBrowser
      .channel("tasks-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `profile_id=eq.${profile?.id}`,
        },
        (payload) => {
          console.log("Task change received!", payload);
          if (
            payload.eventType === "INSERT" &&
            payload.new.profile_id === profile?.id
          ) {
            setInboxTasks((prevTasks) => [
              ...prevTasks,
              payload.new as TaskType,
            ]);
          } else if (payload.eventType === "UPDATE") {
            handleTaskUpdate(payload.new as TaskType);
          } else if (payload.eventType === "DELETE") {
            setInboxTasks((prevTasks) =>
              prevTasks.filter((task) => task.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // // Subscribe to real-time changes for sections
    // const sectionsSubscription = supabaseBrowser
    //   .channel("sections-all-channel")
    //   .on(
    //     "postgres_changes",
    //     {
    //       event: "*",
    //       schema: "public",
    //       table: "sections",
    //       filter: `profile_id=eq.${profile?.id}`,
    //     },
    //     (payload) => {
    //       console.log("Section change received!", payload);
    //       if (payload.eventType === "INSERT" && payload.new.profile_id === profile?.id) {
    //         setInboxSections((prevSections) => [
    //           ...prevSections,
    //           payload.new as SectionType,
    //         ]);
    //       } else if (payload.eventType === "UPDATE") {
    //         setInboxSections((prevSections) =>
    //           prevSections.map((section) =>
    //             section.id === payload.new.id
    //               ? (payload.new as SectionType)
    //               : section
    //           )
    //         );
    //       } else if (payload.eventType === "DELETE") {
    //         setInboxSections((prevSections) =>
    //           prevSections.filter((section) => section.id !== payload.old.id)
    //         );
    //       }
    //     }
    //   )
    //   .subscribe();

    // Cleanup subscriptions on component unmount
    return () => {
      supabaseBrowser.removeChannel(tasksSubscription);
      // supabaseBrowser.removeChannel(sectionsSubscription);
    };
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Spinner />
      </div>
    );
  }

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
