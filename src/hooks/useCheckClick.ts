import { useAuthProvider } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { TaskType } from "@/types/project";
import { ProfileType } from "@/types/user";
import { canEditContent } from "@/utils/permissionUtils";
import { supabaseBrowser } from "@/utils/supabase/client";
import { debounce } from "lodash";

import React from "react";

const useCheckClick = ({
  tasks,
  setTasks,
  task,
}: {
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  task: TaskType | null;
}) => {
  const { role } = useRole();
  const { profile } = useAuthProvider();
  const { projects } = useSidebarDataProvider();

  const handleCheckClickDebounced = debounce(async () => {
    if (!profile?.id || !task) return;

    try {
      if (!task.is_inbox && task.project_id) {
        if (
          !canEditContent(
            role({
              project: projects.find((pro) => pro.id == task.project_id) || null,
              page: null,
            }),
            !!projects.find((pro) => pro.id == task.id)?.team_id
          )
        ) {
          console.error("User doesn't have permission to create a section");
          return;
        }

        // Update local tasks
        // setTasks(
        //   tasks.map((t) =>
        //     t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
        //   )
        // );

        const { error } = await supabaseBrowser
          .from("tasks")
          .update({
            is_completed: !task.is_completed,
          })
          .eq("id", task.id);

        if (error) {
          throw error;
        }

        if (task.is_completed) {
          createActivityLog({
            actor_id: profile.id,
            action: ActivityAction.REOPENED_TASK,
            entity: {
              id: task.id,
              type: EntityType.TASK,
              name: task.title,
            },
            metadata: {},
          });
        } else {
          createActivityLog({
            actor_id: profile.id,
            action: ActivityAction.COMPLETED_TASK,
            entity: {
              id: task.id,
              type: EntityType.TASK,
              name: task.title,
            },
            metadata: {},
          });
        }
      } else {
        // Update local tasks
        setTasks(
          tasks.map((t) =>
            t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
          )
        );

        const { error } = await supabaseBrowser
          .from("tasks")
          .update({
            is_completed: !task.is_completed,
          })
          .eq("id", task.id);

        if (error) {
          throw error;
        }

        if (task.is_completed) {
          createActivityLog({
            actor_id: profile.id,
            action: ActivityAction.REOPENED_TASK,
            entity: {
              id: task.id,
              type: EntityType.TASK,
              name: task.title,
            },
            metadata: {},
          });
        } else {
          createActivityLog({
            actor_id: profile.id,
            action: ActivityAction.COMPLETED_TASK,
            entity: {
              id: task.id,
              type: EntityType.TASK,
              name: task.title,
            },
            metadata: {},
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, 300);

  return {
    handleCheckClickDebounced,
  };
};

export default useCheckClick;
