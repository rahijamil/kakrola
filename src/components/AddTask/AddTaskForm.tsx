import React, { useState } from "react";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import {
  AtSignIcon,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  Ellipsis,
  Hash,
  Inbox,
  MapPin,
  SendHorizonal,
  Tag,
  User,
  X,
} from "lucide-react";
import Priorities from "./Priorities";
import { useAuthProvider } from "@/context/AuthContext";
import Spinner from "../ui/Spinner";
import { supabaseBrowser } from "@/utils/supabase/client";
import { Input } from "../ui";

const AddTaskForm = ({
  onClose,
  isSmall,
  section,
  parentTaskIdForSubTask,
  project,
}: {
  onClose: () => void;
  isSmall?: boolean;
  section?: SectionType;
  parentTaskIdForSubTask?: number;
  project: ProjectType | null;
}) => {
  const { projects } = useTaskProjectDataProvider();
  const { profile } = useAuthProvider();

  const [taskData, setTaskData] = useState<TaskType>({
    title: "",
    description: "",
    priority: "Priority",
    project_id: project?.id || null,
    section_id: section?.id || null,
    parent_task_id: null,
    profile_id: profile?.id || "",
    assigned_to_id: null,
    due_date: new Date().toISOString(),
    reminder_time: null,
    is_inbox: project ? false : true,
    is_completed: false,
    order: 0,
    completed_at: null,
    updated_at: new Date().toISOString(),
  });

  const [showDueDate, setShowDueDate] = useState<boolean>(false);
  const [showAssignee, setShowAssignee] = useState<boolean>(false);

  const [showReminder, setShowReminder] = useState<boolean>(false);
  const [showProjects, setShowProjects] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskData.title) {
      setError("Task name is required.");
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      if (parentTaskIdForSubTask) {
        const { error } = await supabaseBrowser.from("tasks").insert([
          {
            ...taskData,
            updated_at: new Date().toISOString(),
            parent_task_id: parentTaskIdForSubTask,
          },
        ]);

        if (error) {
          setError(error.message); // Set error if any
          setLoading(false); // Stop loading
          return;
        }
      } else {
        const { error } = await supabaseBrowser
          .from("tasks")
          .insert([{ ...taskData, updated_at: new Date().toISOString() }]);

        if (error) {
          setError(error.message); // Set error if any
          setLoading(false); // Stop loading
          return;
        }
      }
    } catch (error: any) {
      setError(error.message); // Set error if any
    } finally {
      setTaskData({
        title: "",
        description: "",
        priority: "Priority",
        project_id: project?.id || null,
        section_id: section?.id || null,
        parent_task_id: 0 || null,
        profile_id: profile?.id || "",
        assigned_to_id: null,
        due_date: new Date().toString(),
        reminder_time: null,
        is_inbox: project ? false : true,
        is_completed: false,
        order: 0,
        completed_at: null,
      });

      setLoading(false); // Stop loading
    }
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
              <Calendar strokeWidth={1.5} className="w-4 h-4 text-gray-500" />
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
                    // value={}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        due_date: new Date(e.target.value).toISOString(),
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
              <User strokeWidth={1.5} className="w-4 h-4 text-gray-500" />
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
                            project_id: project.id!,
                            is_inbox: false,
                          });
                          setShowProjects(false);
                        }}
                      >
                        <Hash strokeWidth={1.5} className="w-4 h-4 mr-2" />
                        {project.name}
                        {taskData.project_id === project.id && (
                          <Check
                            strokeWidth={1.5}
                            className="w-4 h-4 ml-auto"
                          />
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
              <Bell strokeWidth={1.5} className="w-4 h-4 text-gray-500" />
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
              <Ellipsis strokeWidth={1.5} className="w-5 h-5 text-gray-500" />
            </div>

            {showMore && (
              <>
                <div className="shadow-xl border border-gray-200 rounded-md w-[250px] absolute bg-white right-0 top-full mt-1 z-20">
                  <ul className="p-2">
                    <li className="flex items-center justify-between px-2 py-2 transition-colors hover:bg-gray-100 cursor-pointer text-gray-700 rounded-md">
                      <div className="flex items-center gap-2">
                        <Tag strokeWidth={1.5} className="w-4 h-4" />
                        <span>Labels</span>
                      </div>

                      <AtSignIcon className="w-4 h-4" />
                    </li>
                    <li className="flex items-center gap-2 px-2 py-2 transition-colors hover:bg-gray-100 cursor-pointer text-gray-700 rounded-md">
                      <MapPin strokeWidth={1.5} className="w-4 h-4" />
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

      <div className="border-t border-gray-200">
        {error && (
          <p className="text-red-500 pt-3 text-center text-xs">{error}</p>
        )}

        <div className="flex items-center justify-between gap-2 p-2 whitespace-nowrap">
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
                {taskData.is_inbox ? (
                  <Inbox strokeWidth={1.5} className="w-4 h-4" />
                ) : (
                  <Hash strokeWidth={1.5} className="w-4 h-4" />
                )}
                <span className="font-bold text-xs truncate">
                  {taskData.project_id
                    ? projects.find((p) => p.id === taskData.project_id)?.name
                    : "Inbox"}
                </span>
              </button>
              <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
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
                        project_id: null,
                        is_inbox: true,
                      });
                      setShowProjects(false);
                    }}
                  >
                    <Inbox strokeWidth={1.5} className="w-5 h-5 mr-3" />
                    Inbox
                    {taskData.is_inbox && (
                      <Check strokeWidth={1.5} className="w-4 h-4 ml-auto" />
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
                              project_id: project.id!,
                              is_inbox: false,
                            });
                            setShowProjects(false);
                          }}
                        >
                          <Hash strokeWidth={1.5} className="w-4 h-4 mr-2" />
                          {project.name}
                          {taskData.project_id === project.id && (
                            <Check
                              strokeWidth={1.5}
                              className="w-4 h-4 ml-auto"
                            />
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
              disabled={loading}
            >
              {isSmall ? <X strokeWidth={1.5} className="w-5 h-5" /> : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-3 py-[6px] text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-600 disabled:cursor-not-allowed transition disabled:opacity-50"
              disabled={!taskData.title.trim() || loading}
            >
              {loading ? (
                <>
                  {isSmall ? (
                    <Spinner color="white" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Spinner color="white" />
                      <span>Adding...</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {isSmall ? (
                    <SendHorizonal strokeWidth={1.5} className="w-5 h-5" />
                  ) : (
                    "Add task"
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;
