import React, {
  Dispatch,
  LegacyRef,
  SetStateAction,
  useEffect,
  useState,
} from "react";
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
  MapPinIcon,
  SendHorizonal,
  Tag,
  TagIcon,
  User,
  X,
} from "lucide-react";
import Priorities from "./Priorities";
import { useAuthProvider } from "@/context/AuthContext";
import Spinner from "../ui/Spinner";
import { supabaseBrowser } from "@/utils/supabase/client";
import { Input } from "../ui";
import { v4 as uuidv4 } from "uuid";
import ProjectsSelector from "./ProjectsSelector";
import DueDateSelector from "./DueDateSelector";
import AssigneeSelector from "./AssigneeSelector";
import { getDateInfo } from "@/utils/getDateInfo";
import Image from "next/image";
import { TaskInput } from "./TaskInput";

const AddTaskForm = ({
  onClose,
  isSmall,
  section_id,
  parentTaskIdForSubTask,
  project,
  setTasks,
  tasks,
  addTaskAboveBellow,
  taskForEdit,
  biggerTitle,
  dueDate,
}: {
  onClose: () => void;
  isSmall?: boolean;
  section_id?: SectionType["id"] | null;
  parentTaskIdForSubTask?: string | number;
  project: ProjectType | null;
  setTasks: (updatedTasks: TaskType[]) => void;
  tasks: TaskType[];
  addTaskAboveBellow?: { position: "above" | "below"; task: TaskType } | null;
  taskForEdit?: TaskType;
  biggerTitle?: boolean;
  dueDate?: Date | null;
}) => {
  const { projects, activeProject } = useTaskProjectDataProvider();
  const { profile } = useAuthProvider();

  const [taskData, setTaskData] = useState<TaskType>(
    taskForEdit || {
      id: uuidv4(),
      title: "",
      description: "",
      priority: "Priority",
      project_id: activeProject ? activeProject.id : project?.id || null,
      section_id: section_id || null,
      parent_task_id: null,
      profile_id: profile?.id || "",
      assigned_to_id: null,
      due_date: dueDate ? dueDate.toISOString() : new Date().toISOString(),
      reminder_time: null,
      is_inbox: activeProject ? false : project ? false : true,
      is_completed: false,
      order: Math.max(...tasks.map((task) => task.order), 0) + 1,
      completed_at: null,
      updated_at: new Date().toISOString(),
    }
  );

  const [showAssignee, setShowAssignee] = useState<boolean>(false);

  const [showReminder, setShowReminder] = useState<boolean>(false);
  const [showProjects, setShowProjects] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper functions
  const calculateNewOrder = (
    tasks: TaskType[],
    currentIndex: number,
    position: "above" | "below"
  ) => {
    const prevOrder =
      position === "above"
        ? tasks[currentIndex - 1]?.order || tasks[currentIndex].order - 1
        : tasks[currentIndex].order;
    const nextOrder =
      position === "below"
        ? tasks[currentIndex + 1]?.order || tasks[currentIndex].order + 1
        : tasks[currentIndex].order;
    return (prevOrder + nextOrder) / 2;
  };

  const resetTaskData = () => {
    setTaskData({
      id: uuidv4(),
      title: "",
      description: "",
      priority: "Priority",
      project_id: project?.id || null,
      section_id: section_id || null,
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskData.title) {
      setError("Task name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    const isEditing = !!taskForEdit;
    let updatedTasks: TaskType[] = [];

    try {
      if (isEditing) {
        // Optimistically update the task in the UI
        updatedTasks = tasks.map((t) =>
          t.id === taskData.id ? { ...t, ...taskData } : t
        );
        setTasks(updatedTasks);
        setLoading(false);

        // Update the existing task in Supabase
        const { data, error } = await supabaseBrowser
          .from("tasks")
          .update(taskData)
          .eq("id", taskData.id)
          .select()
          .single();

        if (error) throw error;

        // Ensure UI reflects any updates from the database
        updatedTasks = tasks.map((t) => (t.id === taskData.id ? data : t));
      } else {
        // Create a temporary task with a UUID
        const newTask: TaskType = {
          ...taskData,
          id: uuidv4(), // temporary ID
          updated_at: new Date().toISOString(),
          parent_task_id: parentTaskIdForSubTask || null,
        };

        if (addTaskAboveBellow) {
          const { position, task: existingTask } = addTaskAboveBellow;
          const currentIndex = tasks.findIndex((t) => t.id === existingTask.id);
          const insertIndex =
            position === "below" ? currentIndex + 1 : currentIndex;

          newTask.order = calculateNewOrder(tasks, currentIndex, position);

          updatedTasks = [
            ...tasks.slice(0, insertIndex),
            newTask,
            ...tasks.slice(insertIndex),
          ];
        } else {
          newTask.order = Math.max(...tasks.map((task) => task.order), 0) + 1;
          updatedTasks = [...tasks, newTask];
        }

        // Optimistically update the task list in the UI
        setTasks(updatedTasks);
        setLoading(false);
        // Reset form and close
        resetTaskData();

        // Insert the new task into Supabase
        const { id: tempId, ...taskDataWithoutId } = newTask;
        const { data, error } = await supabaseBrowser
          .from("tasks")
          .insert([taskDataWithoutId])
          .select()
          .single();

        if (error) throw error;

        // Replace the temporary ID with the actual ID from the database
        updatedTasks = updatedTasks.map((t) =>
          t.id === tempId ? { ...t, id: data.id } : t
        );
      }

      // Update state with new/updated tasks
      setTasks(updatedTasks);
      setLoading(false);

      if (isEditing) {
        onClose();
      }
    } catch (error: any) {
      setError(error.message);
      // Revert the optimistic update on error
      setTasks(tasks); // Revert to the original state
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-2 p-2">
        <div>
          <TaskInput
            projects={projects}
            taskData={taskData}
            setTaskData={setTaskData}
            biggerTitle={biggerTitle}
            handleSubmit={handleSubmit}
          />

          <Input
            type="text"
            placeholder="Description"
            value={taskData.description}
            onChange={(e) =>
              setTaskData({ ...taskData, description: e.target.value })
            }
            className="text-xs"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2 whitespace-nowrap">
          <DueDateSelector task={taskData} setTask={setTaskData} />

          <AssigneeSelector
            task={taskData}
            setTask={setTaskData}
            isSmall={isSmall}
          />

          <Priorities
            taskData={taskData}
            setTaskData={setTaskData}
            isSmall={isSmall}
          />

          {/* <div className="relative">
            <div
              className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-1 px-2 rounded-lg border border-gray-200"
              onClick={() => setShowReminder(!showReminder)}
            >
              <Bell strokeWidth={1.5} className="w-4 h-4 text-gray-500" />
              {!isSmall && (
                <span className="text-xs text-gray-700">Reminders</span>
              )}
            </div>
            {showReminder && (
              <>
                <div className="absolute bg-white border top-full -left-1/2 rounded-lg overflow-hidden z-20 p-2">
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
              className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-1 px-2 rounded-lg border border-gray-200"
              onClick={() => setShowMore(!showMore)}
            >
              <Ellipsis strokeWidth={1.5} className="w-5 h-5 text-gray-500" />
            </div>

            {showMore && (
              <>
                <div className="shadow-xl border border-gray-200 rounded-lg w-[250px] absolute bg-white right-0 top-full mt-1 z-20 text-xs">
                  <ul className="p-2">
                    <li className="flex items-center justify-between px-2 py-2 transition-colors hover:bg-gray-100 cursor-pointer text-gray-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag strokeWidth={1.5} className="w-4 h-4" />
                        <span>Labels</span>
                      </div>

                      <AtSignIcon className="w-4 h-4" />
                    </li>
                    <li className="flex items-center gap-2 px-2 py-2 transition-colors hover:bg-gray-100 cursor-pointer text-gray-700 rounded-lg">
                      <MapPin strokeWidth={1.5} className="w-4 h-4" />
                      <p className="space-x-1">
                        <span>Location</span>
                        <span className="uppercase text-[10px] tracking-widest font-bold text-indigo-800 bg-indigo-100 p-[2px] px-1 rounded-lg">
                          Upgrade
                        </span>
                      </p>
                    </li>
                  </ul>
                  <hr />
                  <ul className="p-2">
                    <li className="flex items-center justify-between px-2 py-2 transition-colors hover:bg-gray-100 cursor-pointer text-gray-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TagIcon className="w-4 h-4" />
                        <span>Labels</span>
                      </div>

                      <AtSignIcon className="w-4 h-4" />
                    </li>
                    <li className="flex items-center justify-between px-2 py-2 transition-colors hover:bg-gray-100 cursor-pointer text-gray-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span>Location</span>
                      </div>

                      <AtSignIcon className="w-4 h-4" />
                    </li>
                  </ul>
                </div>
                <div
                  className="fixed top-0 left-0 bottom-0 right-0 z-10"
                  onClick={() => setShowMore(false)}
                ></div>
              </>
            )}
          </div> */}
        </div>
      </div>

      <div className="border-t border-gray-200">
        {error && (
          <p className="text-red-500 pt-3 text-center text-xs">{error}</p>
        )}

        <div className="flex items-center justify-between gap-2 p-2 whitespace-nowrap">
          <ProjectsSelector
            setTask={setTaskData}
            task={taskData}
            isInbox
            isSmall={isSmall}
          />

          <div className="flex justify-end gap-2 select-none">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-[6px] text-[13px] text-gray-600 transition bg-gray-100 hover:bg-gray-200 rounded-lg"
              disabled={loading}
            >
              {isSmall ? <X strokeWidth={1.5} className="w-5 h-5" /> : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-3 py-[6px] text-[13px] text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-600 disabled:cursor-not-allowed transition disabled:opacity-50"
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
