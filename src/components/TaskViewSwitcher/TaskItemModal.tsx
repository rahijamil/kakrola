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
  CalendarRange,
  CheckCircle,
  ChevronDown,
  ChevronUpCircle,
  Circle,
  CircleCheck,
  Ellipsis,
  Hash,
  Inbox,
  LockKeyhole,
  Paperclip,
  Plus,
  Text,
  User,
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
import TaskDescription from "./TaskDescription";

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
  setTasks: (tasks: TaskType[]) => void;
  tasks: TaskType[];
}) => {
  const { profile } = useAuthProvider();
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [showAddSubtask, setShowAddSubtask] = useState<boolean>(false);
  const [taskData, setTaskData] = useState<TaskType>(task);

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
          <div>
            <button
              className="flex items-center gap-2 hover:bg-text-100 rounded-full p-2 transition"
              onClick={onCheckClick}
            >
              <AnimatedCircleCheck
                handleCheckSubmit={onCheckClick}
                is_completed={taskData.is_completed}
                priority={task.priority}
              />

              <span>Mark complete</span>
            </button>
          </div>

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

        <div className="flex-1 p-8 space-y-8">
          <div>
            <input
              type="text"
              className={`text-[26px] font-bold border-none focus-visible:outline-none bg-transparent w-full ${
                taskData.is_completed ? "line-through text-text-500" : ""
              }`}
              value={taskData.title}
              onChange={(ev) =>
                setTaskData((prevTaskData) => ({
                  ...prevTaskData,
                  title: ev.target.value,
                }))
              }
              onKeyDown={(ev) =>
                ev.key === "Enter" && console.log(taskData.title)
              }
            />
          </div>

          <div className="grid grid-cols-[20%_80%] items-center text-xs gap-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle strokeWidth={2} size={16} />
              <p className="font-semibold text-xs">Project</p>
            </div>
            <ProjectsSelector
              setTask={setTaskData}
              isInbox
              task={taskData}
              forTaskModal
            />

            <div className="flex items-center gap-2">
              <User strokeWidth={2} size={16} />
              <p
                className={`font-semibold text-xs \ ${
                  task.assignees.length > 0 && "cursor-text"
                }`}
              >
                Assignee
              </p>
            </div>

            <AssigneeSelector
              task={taskData}
              setTask={setTaskData}
              forTaskModal
              project={project}
            />

            <div className="flex items-start gap-2">
              <CalendarRange strokeWidth={2} size={16} />
              <p
                className={`font-semibold text-xs ${
                  task.dates.end_date !== null && "cursor-text"
                }`}
              >
                Dates
              </p>
            </div>
            <DateSelector forTaskModal task={taskData} setTask={setTaskData} />

            <div className="flex items-center gap-2">
              <ChevronUpCircle strokeWidth={2} size={16} />
              <p className="font-semibold text-xs">Priority</p>
            </div>

            <Priorities
              taskData={taskData}
              setTaskData={setTaskData}
              forTaskItemModal
            />

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

          <div>
            <TaskDescription 
            
            // taskData={taskData}
            //  setTaskData={setTaskData}
              />

            <div className="mt-6">
              {!showAddSubtask && (
                <button
                  className="text-xs hover:bg-text-100 transition rounded-full flex items-center gap-2 px-2 py-[6px] text-text-600 border border-text-200"
                  onClick={() => setShowAddSubtask(true)}
                >
                  <Plus strokeWidth={2} className="w-4 h-4" />

                  <span className="text-xs font-semibold">Add subtask</span>
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

            {!showCommentForm && (
              <div className="flex items-center gap-2">
                <Image
                  src={profile?.avatar_url || "/default_avatar.png"}
                  width={28}
                  height={28}
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
              <AddComentForm onCancelClick={() => setShowCommentForm(false)} />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskItemModal;
