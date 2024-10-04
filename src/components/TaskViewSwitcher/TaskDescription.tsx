import { AlignLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/github.css";
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

const icons = Quill.import("ui/icons");
// Link icons
icons[
  "link"
] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

// Image icons
icons[
  "image"
] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;

// Video icons
icons[
  "video"
] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`;

// Blockquote icons
icons[
  "blockquote"
] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/></svg>`;

// Code icons
icons[
  "code"
] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;

// Code Block icons
icons[
  "code-block"
] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-code"><path d="M10 9.5 8 12l2 2.5"/><path d="m14 9.5 2 2.5-2 2.5"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>`;

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    ["bold", "italic", "underline", "strike"],
    ["link", "image", "video"],
    [{ align: [] }],
    ["blockquote", "code", "code-block"],
    ["clean"], // remove formatting button
  ],
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
};

const formats = [
  "header",
  "list",
  "bold",
  "italic",
  "underline",
  "strike",
  "link",
  "image",
  "video",
  "align",
  "blockquote",
  "code",
  "code-block",
];

const TaskDescription = ({
  taskData,
  setTasks,
  tasks,
}: {
  taskData: TaskType;
  setTasks: (tasks: TaskType[]) => void;
  tasks: TaskType[];
}) => {
  const [editorState, setEditorState] = useState(taskData.description);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const quillRef = useRef<any>(null);

  const { profile } = useAuthProvider();

  useEffect(() => {
    if (isEdit) {
      if (quillRef.current) {
        console.log(quillRef.current.editor.root.focus());
      }
    }
  }, [isEdit]);

  const handleChange = (value: any) => {
    setEditorState(value);
  };

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
      if (taskData.description !== editorState) {
        setTasks(
          tasks.map((task) =>
            task.id === taskData.id
              ? { ...task, description: editorState }
              : task
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
          entity_id: taskData.id,
          entity_type: EntityType.TASK,
          metadata: {
            old_data: {
              description: editorState,
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
    <div className={`grid grid-cols-[20%_80%] items-start`}>
      <div className="flex items-center gap-2 mt-2">
        <AlignLeft strokeWidth={2} size={16} />
        <p className="font-semibold text-xs">Description</p>
      </div>

      {isEdit ? (
        <motion.div
          initial={{
            scaleY: 0.8,
            y: -10, // Upwards for top-right, downwards for bottom-left
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
          <ReactQuill
            ref={quillRef}
            theme="snow"
            modules={modules}
            formats={formats}
            value={editorState}
            onChange={handleChange}
            placeholder="What is this task about?"
            className="custom-quill-editor"
          />
          <div className="flex justify-end gap-2 text-xs">
            <Button
              variant="ghost"
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
              disabled={taskData.description === editorState || loading}
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
          <div
            // ref={triggerRef}
            className="text-text-600 text-xs line-clamp-1"
            dangerouslySetInnerHTML={{
              __html: editorState || "No description",
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default TaskDescription;
