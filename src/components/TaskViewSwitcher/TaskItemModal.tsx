import React, { useRef, useState } from "react";
import { Dialog, Input, Textarea } from "../ui";
import { SectionType, TaskType } from "@/types/project";
import {
  Bars3BottomLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  FaceSmileIcon,
  HashtagIcon,
  LockClosedIcon,
  MicrophoneIcon,
  PaperClipIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import AddTaskForm from "../AddTask/AddTaskForm";
import Priorities from "../AddTask/Priorities";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import AddComentForm from "./AddComentForm";
import TaskItem from "./TaskItem";

const TaskItemModal = ({
  task,
  onClose,
  section,
  onCheckClick,
}: {
  task: TaskType;
  onClose: () => void;
  section?: SectionType;
  onCheckClick: () => void;
}) => {
  const [contentEditable, setContentEditable] = useState<boolean>(false);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [showAddSubtask, setShowAddSubtask] = useState<boolean>(false);
  const { setTasks, projects, sections, tasks } = useTaskProjectDataProvider();
  const [taskData, setTaskData] = useState<TaskType>(task);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleSaveTitleDesc = () => {
    setTasks((prevTasks) => [
      ...prevTasks.map((t) =>
        t.id == taskData.id ? { ...taskData, isCompleted: t.isCompleted } : t
      ),
    ]);
    setContentEditable(false);
  };

  return (
    <Dialog onClose={onClose} size="lg">
      <div className="h-[94%]">
        <div className="p-2 px-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <HashtagIcon className="w-4 h-4" />
              {projects.find((p) => p.id == taskData.projectId)?.name}
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
                  d="M19.5 20a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15zM18 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12zm0 1H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-6 2a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 12 9zm7.5-6a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15z"
                ></path>
              </svg>
              {sections.find((s) => s.id == taskData.sectionId)?.name}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-100 transition rounded-md">
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>
            <button
              className="p-1 hover:bg-gray-100 transition rounded-md"
              onClick={onClose}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          <div className="flex gap-1 bg-white p-4 flex-1">
            <div
              onClick={onCheckClick}
              className={`border w-5 h-5 rounded-full flex items-center justify-center mt-1 cursor-pointer group ${
                task.isCompleted
                  ? "bg-indigo-600 border-indigo-600"
                  : "border-gray-400"
              }`}
            >
              <CheckIcon
                className={`w-3 h-3 transition ${
                  task.isCompleted
                    ? "text-white"
                    : "text-gray-700 opacity-0 group-hover:opacity-100"
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
                      taskData.isCompleted ? "line-through text-gray-500" : ""
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
                    <Bars3BottomLeftIcon className="w-4 h-4 mt-[2px] text-gray-400" />
                    <Textarea
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
                    ></Textarea>
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
                    className="text-xs hover:bg-gray-100 transition rounded-md flex items-center gap-2 px-2 py-[6px] text-gray-600"
                    onClick={() => setShowAddSubtask(true)}
                  >
                    <PlusIcon className="w-4 h-4" />

                    <span className="text-xs font-semibold">Add sub-task</span>
                  </button>
                )}
                {showAddSubtask && (
                  <div className="rounded-lg border border-gray-200 focus-within:border-gray-400 bg-white">
                    <AddTaskForm
                      onClose={() => setShowAddSubtask(false)}
                      taskIdForSubTask={task.id}
                    />
                  </div>
                )}
              </div>

              <ul className="mt-6">
                {tasks
                  .filter((t) => t.parentTaskId == task.id)
                  .map((subTask, index) => (
                    <li>
                      <TaskItem
                        task={subTask}
                        onCheckClick={() => {}}
                        showShareOption={false}
                        setShowShareOption={(v) => {}}
                        index={index}
                      />
                    </li>
                  ))}
              </ul>

              <div className="my-4 bg-gray-100 h-[1px]" />

              {!showCommentForm && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-black rounded-full"></div>

                  <div
                    className="flex items-center justify-between w-full border border-gray-100 rounded-full py-1 px-4 hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => setShowCommentForm(true)}
                  >
                    <p className="">Comment</p>
                    <PaperClipIcon className="w-4 h-4 text-gray-700" />
                  </div>
                </div>
              )}

              {showCommentForm && (
                <AddComentForm
                  onCancelClick={() => setShowCommentForm(false)}
                />
              )}
            </div>
          </div>
          <div className="bg-gray-50 p-4 w-64">
            <div>
              <div className="space-y-2">
                <p className="font-semibold text-xs pl-2">Project</p>

                <div className="flex items-center justify-between hover:bg-gray-200 rounded-md cursor-pointer transition p-[6px] px-2 group">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <HashtagIcon className="w-3 h-3" />
                      {projects.find((p) => p.id == taskData.projectId)?.name}
                    </div>
                    <div>/</div>
                    <div className="flex items-center gap-2">
                      {sections.find((s) => s.id == taskData.sectionId)?.name}
                    </div>
                  </div>

                  <ChevronDownIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-gray-200 rounded-md cursor-pointer transition p-[6px] px-2 group">
                  <p className="font-semibold text-xs">Assignee</p>
                  <PlusIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-gray-200 rounded-md cursor-pointer transition p-[6px] px-2 group">
                  <p className="font-semibold text-xs">Due date</p>
                  <PlusIcon className="w-4 h-4" />
                </div>
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
            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-gray-200 rounded-md cursor-pointer transition p-[6px] px-2 group">
                  <p className="font-semibold text-xs">Labels</p>
                  <PlusIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-gray-200 rounded-md cursor-pointer transition p-[6px] px-2 group">
                  <p className="font-semibold text-xs">Reminders</p>
                  <PlusIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-gray-200 rounded-md cursor-pointer transition p-[6px] px-2 group">
                  <p className="space-x-1 font-semibold text-xs">
                    <span>Location</span>
                    <span className="uppercase text-[10px] tracking-widest font-bold text-orange-800 bg-orange-100 p-[2px] px-1 rounded-md">
                      Upgrade
                    </span>
                  </p>
                  <LockClosedIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 m-2"></div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TaskItemModal;
