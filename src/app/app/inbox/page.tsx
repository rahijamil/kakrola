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
import { toast } from "@/hooks/use-toast";

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
  return { sections: data.sections || [], tasks: data.tasks || [] };
};

const InboxPage = () => {
  const { profile } = useAuthProvider();

  const { data, isLoading, error } = useQuery({
    queryKey: ["inbox", profile?.id],
    queryFn: () => fetchInboxSectionsAndTasks(profile?.id),
    enabled: !!profile?.id,
  });

  const [view, setView] = useState<ViewTypes["view"]>("List");

  const [inboxTasks, setInboxTasks] = useState<TaskType[]>([]);
  const [inboxSections, setInboxSections] = useState<SectionType[]>([]);

  useEffect(() => {
    if (data) {
      setInboxTasks(data.tasks);
      setInboxSections(data.sections);
    }
  }, [data]);

  if (error) {
    console.error("Error fetching inbox data:", error);
    toast({
      title: "Error loading inbox data.",
      variant: "destructive",
    });
    return <div>Error loading inbox data.</div>;
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
        isLoading={isLoading}
      />
    </LayoutWrapper>
  );
};

export default InboxPage;
