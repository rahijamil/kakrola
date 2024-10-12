"use client";
import React, { useEffect, useState } from "react";
import { SectionType, TaskType } from "@/types/project";
import LayoutWrapper from "../../../components/LayoutWrapper";
import Image from "next/image";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { ViewTypes } from "@/types/viewTypes";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useAuthProvider } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";

const fetchInboxSectionsAndTasks = async (_profile_id?: string) => {
  if (!_profile_id) return { sections: [], tasks: [] };

  const { data, error } = await supabaseBrowser.rpc(
    "fetch_inbox_sections_and_tasks",
    { _profile_id }
  );

  if (error) {
    console.error("Error fetching inbox data:", error.message);
    return { sections: [], tasks: [] }; // Return empty arrays if there's an error
  }

  // Data is already separated into sections and tasks
  return { sections: data.sections, tasks: data.tasks };
};

const InboxPage = () => {
  const { profile } = useAuthProvider();

  const { data, isLoading } = useQuery({
    queryKey: ["inbox", profile?.id],
    queryFn: () => fetchInboxSectionsAndTasks(profile?.id),
    enabled: !!profile?.id,
  });

  const [view, setView] = useState<ViewTypes["view"]>("List");

  const [inboxTasks, setInboxTasks] = useState<TaskType[]>([]);
  const [inboxSections, setInboxSections] = useState<SectionType[]>([]);

  useEffect(() => {
    if(data){
      setInboxTasks(data.tasks);
      setInboxSections(data.sections);
    }
  }, [data]);

  return (
    <LayoutWrapper headline="Inbox" setView={setView} view={view}>
      <TaskViewSwitcher
        project={null}
        tasks={inboxTasks}
        setTasks={setInboxTasks}
        sections={inboxSections}
        setSections={setInboxSections}
        view={view}
        isLoading={isLoading}
      />

      {inboxTasks.length === 0 && view === "List" && (
        <div className="flex items-center justify-center flex-col gap-1 h-[30vh] select-none">
          <Image
            src="/inbox.png"
            width={220}
            height={200}
            alt="Today"
            className="rounded-md object-cover"
            draggable={false}
          />
          <div className="text-center space-y-1 w-72">
            <h3 className="font-medium text-base">
              Your peace of mind is priceless
            </h3>
            <p className="text-sm text-text-600">
              By default, tasks added here will be due today.
            </p>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
};

export default InboxPage;
