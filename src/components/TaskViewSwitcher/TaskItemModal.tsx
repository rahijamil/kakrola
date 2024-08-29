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
import DueDateSelector from "../AddTask/DueDateSelector";
import DueDateButton from "./DueDateButton";
import AnimatedCircleCheck from "./AnimatedCircleCheck";

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
  setTasks: (updatedTasks: TaskType[]) => void;
  tasks: TaskType[];
}) => {
  const { profile } = useAuthProvider();
  const [contentEditable, setContentEditable] = useState<boolean>(false);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [showAddSubtask, setShowAddSubtask] = useState<boolean>(false);
  const { projects, sections } = useTaskProjectDataProvider();
  const [taskData, setTaskData] = useState<TaskType>(task);

  const [showProjectsSelector, setShowProjectsSelector] =
    useState<boolean>(false);
  const [showAssigneeSelector, setShowAssigneeSelector] =
    useState<boolean>(false);
  const [showDueDateSelector, setShowDueDateSelector] =
    useState<boolean>(false);

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
      className="fixed top-0 left-0 right-0 bottom-0 flex py-16 justify-center bg-black/50 z-20 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-2xl w-11/12 max-w-[52rem] min-h-full h-fit flex flex-col"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="p-2 px-4 flex items-center justify-between border-b border-text-200">
          {taskData.is_inbox ? (
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              Inbox
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Hash strokeWidth={1.5} className="w-4 h-4" />
                {projects.find((p) => p.id == taskData.project_id)?.name}
              </div>
              <div>/</div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M17.5 20a.5.5 0 0 1 0 1h-11a.5.5 0 0 1 0-1h11zM16 8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h8zm0 1H8a1 1 0 0 0-.993.883L7 10v5a1 1 0 0 0 .883.993L8 16h8a1 1 0 0 0 .993-.883L17 15v-5a1 1 0 0 0-.883-.993L16 9zm1.5-5a.5.5 0 0 1 0 1h-11a.5.5 0 0 1 0-1h11z"
                  ></path>
                </svg>
                {sections.find((s) => s.id == taskData.section_id)?.name}
              </div>
            </div>
          )}

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
                  } rounded-full overflow-hidden border-text-200 focus-within:border-text-400`}
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
                  <div className="rounded-full border border-text-200 focus-within:border-text-400 bg-surface">
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
                      showShareOption={false}
                      setShowShareOption={(v) => {}}
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
                />
              </div>
              <div className="h-[1px] bg-text-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <DueDateSelector
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
      </div>
    </div>
  );
};

export default TaskItemModal;
