import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "../ui";
import { ProjectType, SectionType, TaskType } from "@/types/project";

import AddTaskForm from "../AddTask/AddTaskForm";
import Priorities from "../AddTask/Priorities";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import AddComentForm from "./AddComentForm";
import TaskItem from "./TaskItem";
import { supabaseBrowser } from "@/utils/supabase/client";
import {
  ChevronDown,
  Circle,
  CircleCheck,
  Ellipsis,
  Hash,
  Inbox,
  LockKeyhole,
  Paperclip,
  Plus,
  Text,
  X,
} from "lucide-react";
import { Textarea } from "../ui";
import { useAuthProvider } from "@/context/AuthContext";
import Image from "next/image";
import ProjectsSelector from "../AddTask/ProjectsSelector";
import AssigneeSelector from "../AddTask/AssigneeSelector";
import DateSelector from "../AddTask/DateSelector";
import DueDateButton from "./DueDateButton";
import AnimatedCircleCheck from "./AnimatedCircleCheck";
import { motion } from "framer-motion";

const TaskItemModal = ({
  task,
  subTasks,
  onClose,
  onCheckClick,
  project,
  setTasks,
  tasks,
}: {
  task: TaskType;
  subTasks: TaskType[];
  onClose: () => void;
  onCheckClick: () => void;
  project: ProjectType | null;
  setTasks: (tasks: TaskType[]) => void
  tasks: TaskType[];
}) => {
  const { profile } = useAuthProvider();
  const [contentEditable, setContentEditable] = useState<boolean>(false);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [showAddSubtask, setShowAddSubtask] = useState<boolean>(false);
  const [taskData, setTaskData] = useState<TaskType>(task);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleSaveTitleDesc = async () => {
    const { error } = await supabaseBrowser
      .from("tasks")
      .update({ title: taskData.title, description: taskData.description })
      .eq("id", task.id);

    setContentEditable(false);
  };

  useEffect(() => {
    document.body.classList.add("overflow-y-hidden");

    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-10 cursor-default"
      id="fixed_dropdown"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ duration: 0.2 }}
        className="bg-background rounded-l-2xl w-11/12 max-w-[52rem] min-h-full h-fit flex flex-col fixed top-0 right-0 bottom-0 border-l border-text-200 shadow-md"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="p-2 px-4 flex items-center justify-between border-b border-text-200">
          <div></div>

          <div className="flex items-center gap-2">
            {/* <button className="p-1 hover:bg-text-100 transition rounded-full">
              <Ellipsis strokeWidth={1.5} className="w-6 h-6" />
            </button> */}
            <button
              className="p-1 hover:bg-text-100 transition rounded-full"
              onClick={onClose}
            >
              <X strokeWidth={1.5} className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-[.99]">
          <div className="flex gap-1 bg-background p-4 flex-1">
            <AnimatedCircleCheck
              handleCheckSubmit={onCheckClick}
              is_completed={taskData.is_completed}
              priority={task.priority}
            />

            <div className="w-full">
              <div className="w-full space-y-2">
                <div
                  className={`${
                    contentEditable && "border"
                  } rounded-2xl overflow-hidden border-text-200 focus-within:border-text-400`}
                >
                  <Input
                    className={`${
                      taskData.is_completed ? "line-through text-text-500" : ""
                    } text-full font-bold w-full p-2 pb-[10px]`}
                    value={taskData.title}
                    onClick={() => setContentEditable(true)}
                    onChange={(ev) =>
                      setTaskData((prevTaskData) => ({
                        ...prevTaskData,
                        title: ev.target.value,
                      }))
                    }
                  />

                  <div
                    className="flex gap-[2px] pl-2 cursor-text"
                    onClick={() => {
                      setContentEditable(true);
                      descriptionRef.current?.focus();
                    }}
                  >
                    <Text
                      strokeWidth={1.5}
                      className="w-4 h-4 mt-[2px] text-text-400"
                    />
                    <Textarea
                      fullWidth
                      placeholder={"Description"}
                      className="resize-none"
                      rows={contentEditable ? 3 : 2}
                      ref={descriptionRef}
                      value={taskData.description}
                      onChange={(ev) =>
                        setTaskData((prevTaskData) => ({
                          ...prevTaskData,
                          description: ev.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {contentEditable && (
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setContentEditable(false)}
                      className="px-4 py-2 text-text-600 bg-text-200 rounded hover:bg-text-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveTitleDesc}
                      className="px-4 py-2 text-white bg-primary-500 rounded hover:bg-primary-700 text-xs font-semibold"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {!showAddSubtask && (
                  <button
                    className="text-xs hover:bg-text-100 transition rounded-full flex items-center gap-2 px-2 py-[6px] text-text-600"
                    onClick={() => setShowAddSubtask(true)}
                  >
                    <Plus strokeWidth={1.5} className="w-4 h-4" />

                    <span className="text-xs font-semibold">Add sub-task</span>
                  </button>
                )}
                {showAddSubtask && (
                  <div className="rounded-2xl border border-text-200 focus-within:border-text-400 bg-surface">
                    <AddTaskForm
                      onClose={() => setShowAddSubtask(false)}
                      parentTaskIdForSubTask={task.id}
                      project={project}
                      setTasks={setTasks}
                      tasks={tasks}
                      section_id={task.section_id}
                    />
                  </div>
                )}
              </div>

              <ul className="mt-6">
                {subTasks.map((subTask, index) => (
                  <li key={subTask.id}>
                    <TaskItem
                      task={subTask}
                      setTasks={setTasks}
                      index={index}
                      project={project}
                      subTasks={tasks
                        .map((t) => (t.parent_task_id == subTask.id ? t : null))
                        .filter((t) => t != null)}
                      tasks={tasks}
                    />
                  </li>
                ))}
              </ul>

              <div className="my-4 bg-text-200 h-[1px]" />

              {/* {!showCommentForm && (
                <div className="flex items-center gap-2">
                  <Image
                    src={profile?.avatar_url || "/default_avatar.png"}
                    width={20}
                    height={20}
                    alt={profile?.full_name || profile?.username || "avatar"}
                    className="rounded-full object-cover max-w-[28px] max-h-[28px]"
                  />

                  <div
                    className="flex items-center justify-between w-full border border-text-200 rounded-full py-1 px-4 hover:bg-text-100 cursor-pointer transition"
                    onClick={() => setShowCommentForm(true)}
                  >
                    <p className="">Comment</p>
                    <Paperclip
                      strokeWidth={1.5}
                      className="w-4 h-4 text-text-700"
                    />
                  </div>
                </div>
              )}

              {showCommentForm && (
                <AddComentForm
                  onCancelClick={() => setShowCommentForm(false)}
                />
              )} */}
            </div>
          </div>
          <div className="bg-primary-10 p-4 w-64">
            <div>
              <div className="space-y-2">
                <p className="font-semibold text-xs pl-2">Project</p>

                <ProjectsSelector
                  setTask={setTaskData}
                  isInbox
                  task={taskData}
                  forTaskModal
                />
              </div>
              <div className="h-[1px] bg-text-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <AssigneeSelector
                  task={taskData}
                  setTask={setTaskData}
                  forTaskModal
                  project={project}
                />
              </div>
              <div className="h-[1px] bg-text-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <DateSelector
                  forTaskModal
                  task={taskData}
                  setTask={setTaskData}
                />
              </div>
              <div className="h-[1px] bg-text-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <p className="font-semibold text-xs pl-2">Priority</p>

                <Priorities
                  taskData={taskData}
                  setTaskData={setTaskData}
                  forTaskItemModal
                />
              </div>
              <div className="h-[1px] bg-text-200 m-2"></div>
            </div>

            {/* <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-text-100 rounded-full cursor-pointer transition p-[6px] px-2 group">
                  <p className="font-semibold text-xs">Labels</p>
                  <Plus strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-text-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-text-100 rounded-full cursor-pointer transition p-[6px] px-2 group">
                  <p className="font-semibold text-xs">Reminders</p>
                  <Plus strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-text-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-text-100 rounded-full cursor-pointer transition p-[6px] px-2 group">
                  <p className="space-x-1 font-semibold text-xs">
                    <span>Location</span>
                    <span className="uppercase text-[10px] tracking-widest font-bold text-primary-800 bg-primary-100 p-[2px] px-1 rounded-full">
                      Upgrade
                    </span>
                  </p>
                  <LockKeyhole strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-text-200 m-2"></div>
            </div> */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskItemModal;
