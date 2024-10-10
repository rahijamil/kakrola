import { useAuthProvider } from "@/context/AuthContext";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import AddComentForm from "./AddComentForm";
import { TaskType } from "@/types/project";
import { motion } from "framer-motion";
import { Logs, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabaseBrowser } from "@/utils/supabase/client";
import { TaskCommentType } from "@/types/comment";
import { ProfileType } from "@/types/user";
import CommentCard from "./CommentCard";
import { ActivityLogType, ActivityWithProfile } from "@/types/activitylog";
import { usePathname, useSearchParams } from "next/navigation";
import { generateActivityLogText } from "@/lib/generateActivityLogText";
import { formatDate } from "@/utils/utility_functions";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

enum TabEnum {
  comments = "comments",
  activity = "activity",
}

const tabItems: {
  id: number;
  name: string;
  tab: TabEnum;
  icon: React.ReactNode;
}[] = [
  {
    id: 1,
    name: "Comments",
    icon: <MessageCircle strokeWidth={1.5} className="w-4 h-4" />,
    tab: TabEnum.comments,
  },
  {
    id: 2,
    name: "Activity",
    icon: <Logs strokeWidth={1.5} className="w-4 h-4" />,
    tab: TabEnum.activity,
  },
];

const TabsComponent = ({
  tabs,
  setTabs,
}: {
  tabs: TabEnum;
  setTabs: Dispatch<SetStateAction<TabEnum>>;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTask = searchParams.get("task");

  return (
    <ul className="flex items-center gap-1 relative">
      {tabItems.map((item) => (
        <li key={item.id} className="relative">
          <button
            className={`flex items-center justify-center gap-1 rounded-lg cursor-pointer flex-1 transition px-2 p-1 hover:bg-text-100 hover:text-primary-500 ${
              tabs === item.tab ? "text-primary-500" : "text-text-500"
            }`}
            onClick={() => {
              setTabs(item.tab as TabEnum);
              window.history.pushState(
                null,
                "",
                `${pathname}?task=${searchTask}&tab=${item.tab}`
              );
            }}
          >
            {item.icon}
            <span className="capitalize">{item.name}</span>
          </button>

          {tabs === item.tab && (
            <motion.span
              layoutId="activeIndicator"
              className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

interface CommentWithProfile extends TaskCommentType {
  profiles: {
    id: ProfileType["id"];
    avatar_url: ProfileType["avatar_url"];
    full_name: ProfileType["full_name"];
    email: ProfileType["email"];
  };
}

const getTaskCommentById = async (
  task_id: TaskType["id"]
): Promise<CommentWithProfile[]> => {
  try {
    if (!task_id) return [];

    const { data, error } = await supabaseBrowser
      .from("task_comments")
      .select(
        "id, profiles(id, avatar_url, full_name, email), content, parent_comment_id, is_edited, created_at"
      )
      .eq("task_id", task_id);

    if (error) throw error;

    return data.map((comment) => ({
      ...comment,
      task_id,
    })) as any;
  } catch (error) {
    console.error(`Error getting task_comments: `, error);
    return [];
  }
};

const getTaskActivityById = async (
  task_id: TaskType["id"]
): Promise<ActivityWithProfile[]> => {
  try {
    if (!task_id) return [];

    // Explicitly specify which foreign key to use when embedding 'profiles'
    const { data, error } = await supabaseBrowser
      .from("activity_logs")
      .select(
        `id, action, entity, profiles!activity_logs_actor_id_fkey (id, avatar_url, full_name, email), created_at, metadata`
      )
      .eq("entity->>type", "task")
      .eq("entity->>id", task_id.toString());

    if (error) throw error;

    return data.map((log) => {
      const { profiles, ...restLog } = log;
      return {
        ...restLog,
        task_id,
        actor: profiles,
      };
    }) as any;
  } catch (error) {
    console.error(`Error getting task logs: `, error);
    return [];
  }
};

const TaskModalComment = ({ task }: { task: TaskType }) => {
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [tabs, setTabs] = useState<TabEnum>(TabEnum.comments);
  const { profile } = useAuthProvider();
  const searchParams = useSearchParams();
  const searchTabs = searchParams.get("tab");

  useEffect(() => {
    if (searchTabs) {
      setTabs(searchTabs as TabEnum);
    }
  }, [searchTabs]);

  const {
    data: taskComments = [],
    error,
    isLoading: commentLoading,
  } = useQuery({
    queryKey: ["task_comments", task.id],
    queryFn: async () => await getTaskCommentById(task.id),
    enabled: !!task.id || !!task.profile_id,
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  const {
    data: taskActivies = [],
    error: activityError,
    isLoading: activityLoading,
  } = useQuery({
    queryKey: ["task_activities", task.id],
    queryFn: async () => await getTaskActivityById(task.id),
    enabled: !!task.id || !!task.profile_id,
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="">
      <div className="px-8">
        <TabsComponent tabs={tabs} setTabs={setTabs} />
      </div>

      <div className="bg-text-100 h-px mb-4" />

      {tabs === TabEnum.comments ? (
        <div>
          {commentLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center p-4 gap-3">
                  <div className="w-9 h-9 min-w-9 min-h-9 rounded-lg object-cover">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="w-full h-4" />
                  </div>
                </div>
              ))
            : taskComments
                .sort(
                  (a, b) =>
                    new Date(a.created_at || "").getTime() -
                    new Date(b.created_at || "").getTime()
                )
                .map((comment) => (
                  <CommentCard
                    comment={comment}
                    profile={comment.profiles as ProfileType}
                  />
                ))}
        </div>
      ) : (
        <div>
          {activityLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center p-4 gap-3">
                  <div className="w-9 h-9 min-w-9 min-h-9 rounded-lg object-cover">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="w-full h-4" />
                  </div>
                </div>
              ))
            : taskActivies.map((log) => (
                <div
                  className={`relative group md:hover:bg-text-10dark:md:hover:bg-background transition px-4 md:px-6 select-none md:select-auto py-1 flex gap-2`}
                  onTouchStart={(ev) => {
                    ev.currentTarget.classList.add("bg-text-100");
                    // handleTouchStart(comment.id.toString());
                  }}
                  onTouchEnd={(ev) => {
                    ev.currentTarget.classList.remove("bg-text-100");
                    // handleTouchEnd();
                  }}
                >
                  <div className="w-9 h-9 flex items-center justify-center">
                    <Image
                      src={profile?.avatar_url || "/default_avatar.png"}
                      alt={profile?.full_name || "User"}
                      width={28}
                      height={28}
                      className="rounded-lg w-7 h-7 min-w-7 min-h-7 object-cover"
                    />
                  </div>

                  <div className={`flex-1`}>
                    <div>{generateActivityLogText(log)}</div>

                    <p className="text-xs text-text-500">
                      {moment(log.created_at).fromNow()}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      )}

      <div className="bg-text-100 h-px my-4" />

      <div className="p-8 pt-0">
        {!showCommentForm && (
          <div className="flex items-center gap-2">
            <Image
              src={profile?.avatar_url || "/default_avatar.png"}
              width={28}
              height={28}
              alt={profile?.full_name || profile?.username || "avatar"}
              className="rounded-md object-cover max-w-[28px] max-h-[28px]"
            />

            <div
              className="flex items-center justify-between w-full border border-text-100 rounded-lg py-2 px-4 bg-background hover:bg-text-100 dark:hover:bg-surface cursor-pointer transition text-xs"
              onClick={() => setShowCommentForm(true)}
            >
              <p className="text-text-500">Write a comment</p>
            </div>
          </div>
        )}

        {showCommentForm && (
          <div className="flex items-start gap-2 w-full">
            <Image
              src={profile?.avatar_url || "/default_avatar.png"}
              width={28}
              height={28}
              alt={profile?.full_name || profile?.username || "avatar"}
              className="rounded-md object-cover max-w-[28px] max-h-[28px]"
            />
            <AddComentForm
              onCancelClick={() => setShowCommentForm(false)}
              task={task}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModalComment;
