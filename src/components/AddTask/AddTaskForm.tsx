import React, { useState } from "react";
import { Input } from "../ui";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { SectionType, Task } from "@/types/project";
import {
  ChevronDownIcon,
  HashtagIcon,
  InboxIcon,
  CalendarIcon,
  BellIcon,
  UserIcon,
  TagIcon,
  MapPinIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { AtSignIcon } from "lucide-react";
import Priorities from "./Priorities";

const AddTaskForm = ({
  onClose,
  isSmall,
  section,
  taskIdForSubTask,
}: {
  onClose: () => void;
  isSmall?: boolean;
  section?: SectionType;
  taskIdForSubTask?: number;
}) => {
  const { projects, setTasks, tasks, activeProject } =
    useTaskProjectDataProvider();

  const [taskData, setTaskData] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    priority: "Priority",
    project: activeProject || null,
    section: section || null,
    dueDate: new Date(),
    isInbox: activeProject ? false : true,
    isCompleted: false,
    subTasks: []
  });

  const [showDueDate, setShowDueDate] = useState<boolean>(false);
  const [showAssignee, setShowAssignee] = useState<boolean>(false);

  const [showReminder, setShowReminder] = useState<boolean>(false);
  const [showProjects, setShowProjects] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (taskIdForSubTask) {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id == taskIdForSubTask
            ? {
                ...t,
                subTasks: [
                  ...t.subTasks,
                  { ...taskData, id: t.subTasks.length + 1 },
                ],
              }
            : t
        )
      );
    } else {
      setTasks([...tasks, { ...taskData, id: tasks.length + 1 }]);
    }

    setTaskData({
      id: 0,
      title: "",
      description: "",
      priority: "Priority",
      project: activeProject || null,
      section: section || null,
      dueDate: new Date(),
      isInbox: activeProject ? false : true,
      isCompleted: false,
      subTasks: []
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-2 p-2">
        <div>
          <Input
            type="text"
            placeholder="Task name"
            className="font-semibold"
            value={taskData.title}
            onChange={(e) =>
              setTaskData({ ...taskData, title: e.target.value })
            }
            required
            autoFocus
          />
          <Input
            type="text"
            placeholder="Description"
            value={taskData.description}
            onChange={(e) =>
              setTaskData({ ...taskData, description: e.target.value })
            }
          />
        </div>

        <div className="flex items-center flex-wrap gap-2 whitespace-nowrap">
          <div className="relative">
            <div
              className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-1 px-2 rounded-md border border-gray-200"
              onClick={() => setShowDueDate(!showDueDate)}
            >
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              {!isSmall && (
                <span className="text-sm text-gray-700">Due date</span>
              )}
            </div>
            {showDueDate && (
              <>
                <div className="absolute bg-white border top-full -left-full translate-x-1/2 rounded-md overflow-hidden z-20 p-2">
                  <input
                    type="date"
                    className="p-2 border border-gray-300 rounded"
                    value={taskData.dueDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        dueDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>

                <div
                  className="fixed top-0 left-0 bottom-0 right-0 z-10"
                  onClick={() => setShowDueDate(false)}
                ></div>
              </>
            )}
          </div>

          <div className="relative">
            <div
              className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-1 px-2 rounded-md border border-gray-200"
              onClick={() => setShowAssignee(!showDueDate)}
            >
              <UserIcon className="w-4 h-4 text-gray-500" />
              {!isSmall && (
                <span className="text-sm text-gray-700">Assignee</span>
              )}
            </div>
            {showAssignee && (
              <>
                <div className="absolute bg-white border top-full min-w-[250px] -left-full rounded-md overflow-hidden z-20">
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Type a project name"
                      className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <ul>
                    {projects.map((project) => (
                      <li
                        key={project.id}
                        className={
                          "flex items-center pl-6 px-2 py-2 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
                        }
                        onClick={() => {
                          setTaskData({
                            ...taskData,
                            project: project,
                            isInbox: false,
                          });
                          setShowProjects(false);
                        }}
                      >
                        <HashtagIcon className="w-4 h-4 mr-2" />
                        {project.name}
                        {taskData.project?.id === project.id && (
                          <CheckIcon className="w-4 h-4 ml-auto" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="fixed top-0 left-0 bottom-0 right-0 z-10"
                  onClick={() => setShowAssignee(false)}
                ></div>
              </>
            )}
          </div>

          <Priorities
            taskData={taskData}
            setTaskData={setTaskData}
            isSmall={isSmall}
          />

          <div className="relative">
            <div
              className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-1 px-2 rounded-md border border-gray-200"
              onClick={() => setShowReminder(!showReminder)}
            >
              <BellIcon className="w-4 h-4 text-gray-500" />
              {!isSmall && (
                <span className="text-sm text-gray-700">Reminders</span>
              )}
            </div>
            {showReminder && (
              <>
                <div className="absolute bg-white border top-full -left-1/2 rounded-md overflow-hidden z-20 p-2">
                  <input
                    type="datetime-local"
                    className="p-2 border border-gray-300 rounded"
                    onChange={(e) =>
                      console.log("Set reminder:", e.target.value)
                    }
                  />
                </div>

                <div
                  className="fixed top-0 left-0 bottom-0 right-0 z-10"
                  onClick={() => setShowReminder(false)}
                ></div>
              </>
            )}
          </div>

          <div className="relative">
            <div
              className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-1 px-2 rounded-md border border-gray-200"
              onClick={() => setShowMore(!showMore)}
            >
              <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500" />
            </div>

            {showMore && (
              <>
                <div className="shadow-xl border border-gray-200 rounded-md w-[250px] absolute bg-white right-0 top-full mt-1 z-20">
                  <ul className="p-2">
                    <li className="flex items-center justify-between px-2 py-2 transition-colors hover:bg-gray-100 cursor-pointer text-gray-700 rounded-md">
                      <div className="flex items-center gap-2">
                        <TagIcon className="w-4 h-4" />
                        <span>Labels</span>
                      </div>

                      <AtSignIcon className="w-4 h-4" />
                    </li>
                    <li className="flex items-center gap-2 px-2 py-2 transition-colors hover:bg-gray-100 cursor-pointer text-gray-700 rounded-md">
                      <MapPinIcon className="w-4 h-4" />
                      <p className="space-x-1">
                        <span>Location</span>
                        <span className="uppercase text-[10px] tracking-widest font-bold text-orange-800 bg-orange-100 p-[2px] px-1 rounded-md">
                          Upgrade
                        </span>
                      </p>
                    </li>
                  </ul>
                  {/* <hr />
                  <ul className="p-2">
                    <li className="flex items-center justify-between px-2 py-2 transition-colors hover:bg-gray-100 cursor-pointer text-gray-700 rounded-md">
                      <div className="flex items-center gap-2">
                        <TagIcon className="w-4 h-4" />
                        <span>Labels</span>
                      </div>

                      <AtSignIcon className="w-4 h-4" />
                    </li>
                    <li className="flex items-center justify-between px-2 py-2 transition-colors hover:bg-gray-100 cursor-pointer text-gray-700 rounded-md">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span>Location</span>
                      </div>

                      <AtSignIcon className="w-4 h-4" />
                    </li>
                  </ul> */}
                </div>
                <div
                  className="fixed top-0 left-0 bottom-0 right-0 z-10"
                  onClick={() => setShowMore(false)}
                ></div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-gray-200 p-2 whitespace-nowrap">
        <div className="relative">
          <div
            className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-2 px-2 rounded-md"
            onClick={() => setShowProjects(true)}
          >
            <button
              type="button"
              className={`w-full flex items-center text-sm transition-colors text-gray-700 gap-2 ${
                isSmall && "max-w-[100px]"
              }`}
            >
              {taskData.isInbox ? (
                <InboxIcon className="w-4 h-4" />
              ) : (
                <HashtagIcon className="w-4 h-4" />
              )}
              <span className="font-bold text-xs truncate">
                {taskData.project ? taskData.project.name : "Inbox"}
              </span>
            </button>
            <ChevronDownIcon className="w-4 h-4" />
          </div>

          {showProjects && (
            <>
              <div className="absolute bg-white border top-full w-[300px] -left-full rounded-md overflow-hidden z-20 text-xs">
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Type a project name"
                    className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div
                  className={`flex items-center p-2 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer`}
                  onClick={() => {
                    setTaskData({
                      ...taskData,
                      project: null,
                      isInbox: true,
                    });
                    setShowProjects(false);
                  }}
                >
                  <InboxIcon className="w-5 h-5 mr-3" />
                  Inbox
                  {taskData.isInbox && (
                    <CheckIcon className="w-4 h-4 ml-auto" />
                  )}
                </div>

                <div>
                  <div className="font-bold p-2 flex items-center gap-2">
                    <div className="w-5 h-5 bg-black rounded-full"></div>
                    <span>My projects</span>
                  </div>

                  <ul>
                    {projects.map((project) => (
                      <li
                        key={project.id}
                        className={
                          "flex items-center pl-6 px-2 py-2 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
                        }
                        onClick={() => {
                          setTaskData({
                            ...taskData,
                            project: project,
                            isInbox: false,
                          });
                          setShowProjects(false);
                        }}
                      >
                        <HashtagIcon className="w-4 h-4 mr-2" />
                        {project.name}
                        {taskData.project?.id === project.id && (
                          <CheckIcon className="w-4 h-4 ml-auto" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className="fixed top-0 left-0 bottom-0 right-0 z-10"
                onClick={() => setShowProjects(false)}
              ></div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 select-none">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-[6px] text-sm text-gray-600 transition bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            {isSmall ? <XMarkIcon className="w-5 h-5" /> : "Cancel"}
          </button>
          <button
            type="submit"
            className="px-3 py-[6px] text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-600 disabled:cursor-not-allowed transition disabled:opacity-50"
            disabled={!taskData.title.trim()}
          >
            {isSmall ? <PaperAirplaneIcon className="w-5 h-5" /> : "Add task"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;
