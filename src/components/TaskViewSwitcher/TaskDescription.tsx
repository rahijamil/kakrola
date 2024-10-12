import { AlignLeft } from "lucide-react";
import React, { KeyboardEvent, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { TaskType } from "@/types/project";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useRole } from "@/context/RoleContext";
import { canEditTask } from "@/types/hasPermission";
import { Spinner } from "@nextui-org/react";
import ReplyEditor from "@/app/app/ch/[channel_slug]/th/[thread_slug]/ReplyEditor";
import { JSONContent } from "novel";
import useScreen from "@/hooks/useScreen";
import { getTextFromContent } from "@/lib/getTextFromContent";
import dynamic from "next/dynamic";
const NovelEditor = dynamic(() => import("@/components/NovelEditor"), {
  ssr: false,
});

const TaskDescription = ({
  taskData,
  setTasks,
  tasks,
}: {
  taskData: TaskType;
  setTasks: (tasks: TaskType[]) => void;
  tasks: TaskType[];
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [charsCount, setCharsCount] = useState(0);
  const ProseMirror = (editorRef.current as any)?.querySelector(".ProseMirror");

  const { screenWidth } = useScreen();

  const [content, setContent] = useState(taskData.description);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const { profile } = useAuthProvider();

  const { role } = useRole();

  const handleSaveTaskDescription = async () => {
    if (!profile?.id) return;

    if (!taskData.is_inbox && taskData.project_id) {
      const userRole = role({ _project_id: taskData.project_id });
      const canEdit = userRole ? canEditTask(userRole) : false;

      if (!canEdit)
        throw new Error("You don't have permission to edit this task");
    }

    setLoading(true);

    try {
      if (taskData.description !== content && charsCount > 0) {
        setTasks(
          tasks.map((task) =>
            task.id === taskData.id ? { ...task, description: content } : task
          )
        );

        const { data, error } = await supabaseBrowser
          .from("tasks")
          .update({
            description: taskData.description,
          })
          .eq("id", taskData.id);

        if (error) {
          throw error;
        }

        createActivityLog({
          actor_id: profile.id,
          action: ActivityAction.UPDATED_TASK,
          entity: {
            id: taskData.id,
            type: EntityType.TASK,
            name: taskData.title,
          },
          metadata: {
            old_data: {
              description: content,
            },
            new_data: {
              description: taskData.description,
            },
          },
        });
      }
    } catch (error) {
      console.error(`Error updating task description: ${error}`);
    } finally {
      setLoading(false);
      setIsEdit(false);
    }
  };

  return (
    <>
      {isEdit ? (
        <motion.div
          initial={{
            scaleY: 0.8,
            y: -10,
            opacity: 0,
            transformOrigin: "top", // Change origin
            height: 0,
          }}
          animate={{
            scaleY: 1,
            y: [0, -5, 0], // Subtle bounce in the respective direction
            opacity: 1,
            transformOrigin: "top",
            height: "auto",
          }}
          exit={{
            scaleY: 0.8,
            y: -10,
            opacity: 0,
            transformOrigin: "top",
            height: 0,
          }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
            y: {
              type: "spring",
              stiffness: 300,
              damping: 15,
            },
          }}
          className="space-y-4 mt-2"
        >
          <div className="description-editor hide-some-command relative rounded-lg transition cursor-text border border-text-200 focus-within:border-text-300 focus-within:shadow bg-background">
            <NovelEditor
              editorRef={editorRef}
              content={content}
              handleSave={(content) => setContent(content)}
              setCharsCount={setCharsCount}
              hideContentItemMenu
            />
          </div>

          <div className="flex justify-end gap-2 text-xs">
            <Button
              variant="secondary"
              type="button"
              size="sm"
              onClick={() => setIsEdit(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleSaveTaskDescription}
              disabled={
                taskData.description === content || loading || charsCount == 0
              }
              // variant={charsCount == 0 ? "ghost" : "default"}
            >
              {loading ? (
                <>
                  <Spinner color="white" size="sm" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </motion.div>
      ) : (
        <div
          onClick={() => setIsEdit(true)}
          className="cursor-pointer hover:bg-text-100 transition rounded-lg p-2 px-4 w-full text-left"
        >
          <div className={`line-clamp-1 ${charsCount == 0 && "text-text-500"}`}>
            {charsCount > 0 && content
              ? getTextFromContent(content).substring(0, 40)
              : "No description"}
          </div>
        </div>
      )}
    </>
  );
};

export default TaskDescription;
