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
  onCheckClick: (
    ev: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => Promise<void>;
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
        className="bg-white rounded-lg w-11/12 max-w-[52rem] min-h-full h-fit flex flex-col"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="p-2 px-4 flex items-center justify-between border-b border-gray-200">
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
            {/* <button className="p-1 hover:bg-gray-100 transition rounded-lg">
              <Ellipsis strokeWidth={1.5} className="w-6 h-6" />
            </button> */}
            <button
              className="p-1 hover:bg-gray-100 transition rounded-lg"
              onClick={onClose}
            >
              <X strokeWidth={1.5} className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-[.99]">
          <div className="flex gap-1 bg-white p-4 flex-1">
            <div
              onClick={onCheckClick}
              className="p-1 group cursor-pointer h-fit"
            >
              <Circle
                size={22}
                strokeWidth={
                  task.priority == "P1"
                    ? 2.5
                    : task.priority == "P2"
                    ? 2.5
                    : task.priority == "P3"
                    ? 2.5
                    : 1.5
                }
                className={`rounded-full ${
                  task.priority == "P1"
                    ? "text-red-500 bg-red-100"
                    : task.priority == "P2"
                    ? "text-orange-500 bg-orange-100"
                    : task.priority == "P3"
                    ? "text-indigo-500 bg-indigo-100"
                    : "text-gray-500"
                } ${task.is_completed ? "hidden" : "group-hover:hidden"}`}
              />

              <CircleCheck
                size={22}
                strokeWidth={
                  task.priority == "P1"
                    ? 2.5
                    : task.priority == "P2"
                    ? 2.5
                    : task.priority == "P3"
                    ? 2.5
                    : 1.5
                }
                className={`transition rounded-full ${
                  task.priority == "P1"
                  ? "text-red-500 bg-red-100"
                  : task.priority == "P2"
                  ? "text-orange-500 bg-orange-100"
                  : task.priority == "P3"
                  ? "text-indigo-500 bg-indigo-100"
                  : "text-gray-500"
                } ${
                  !taskData.is_completed
                    ? "hidden group-hover:block"
                    : `text-white ${
                        taskData.priority == "P1"
                          ? "bg-red-500"
                          : taskData.priority == "P2"
                          ? "bg-orange-500"
                          : taskData.priority == "P3"
                          ? "bg-indigo-500"
                          : "bg-gray-500"
                      }`
                }`}
              />
            </div>

            <div className="w-full">
              <div className="w-full space-y-2">
                <div
                  className={`${
                    contentEditable && "border"
                  } rounded-lg overflow-hidden border-gray-200 focus-within:border-gray-400`}
                >
                  <Input
                    className={`${
                      taskData.is_completed ? "line-through text-gray-500" : ""
                    } text-lg font-bold w-full p-2 pb-[10px]`}
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
                      className="w-4 h-4 mt-[2px] text-gray-400"
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
                      className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveTitleDesc}
                      className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 text-xs font-semibold"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {!showAddSubtask && (
                  <button
                    className="text-xs hover:bg-gray-100 transition rounded-lg flex items-center gap-2 px-2 py-[6px] text-gray-600"
                    onClick={() => setShowAddSubtask(true)}
                  >
                    <Plus strokeWidth={1.5} className="w-4 h-4" />

                    <span className="text-xs font-semibold">Add sub-task</span>
                  </button>
                )}
                {showAddSubtask && (
                  <div className="rounded-lg border border-gray-200 focus-within:border-gray-400 bg-white">
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

              <div className="my-4 bg-gray-100 h-[1px]" />

              {/* {!showCommentForm && (
                <div className="flex items-center gap-2">
                  <Image
                    src={profile?.avatar_url || "/default_avatar.png"}
                    width={28}
                    height={28}
                    alt={profile?.full_name || profile?.username || "avatar"}
                    className="rounded-full"
                  />

                  <div
                    className="flex items-center justify-between w-full border border-gray-100 rounded-full py-1 px-4 hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => setShowCommentForm(true)}
                  >
                    <p className="">Comment</p>
                    <Paperclip
                      strokeWidth={1.5}
                      className="w-4 h-4 text-gray-700"
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
          <div className="bg-indigo-50/50 p-4 w-64">
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
              <div className="h-[1px] bg-gray-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <AssigneeSelector
                  task={taskData}
                  setTask={setTaskData}
                  forTaskModal
                />
              </div>
              <div className="h-[1px] bg-gray-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <DueDateSelector
                  forTaskModal
                  task={taskData}
                  setTask={setTaskData}
                />
              </div>
              <div className="h-[1px] bg-gray-200 m-2"></div>
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
              <div className="h-[1px] bg-gray-200 m-2"></div>
            </div>

            {/* <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-indigo-100 rounded-lg cursor-pointer transition p-[6px] px-2 group">
                  <p className="font-semibold text-xs">Labels</p>
                  <Plus strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-indigo-100 rounded-lg cursor-pointer transition p-[6px] px-2 group">
                  <p className="font-semibold text-xs">Reminders</p>
                  <Plus strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-indigo-100 rounded-lg cursor-pointer transition p-[6px] px-2 group">
                  <p className="space-x-1 font-semibold text-xs">
                    <span>Location</span>
                    <span className="uppercase text-[10px] tracking-widest font-bold text-indigo-800 bg-indigo-100 p-[2px] px-1 rounded-lg">
                      Upgrade
                    </span>
                  </p>
                  <LockKeyhole strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 m-2"></div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItemModal;
