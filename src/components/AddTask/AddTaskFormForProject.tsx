import React, { useRef, useState } from "react";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import {
  AtSignIcon,
  Bell,
  Ellipsis,
  MapPin,
  MapPinIcon,
  SendHorizonal,
  Tag,
  TagIcon,
  X,
} from "lucide-react";

import Priorities from "./Priorities";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import DueDateSelector from "./DueDateSelector";
import AssigneeSelector from "./AssigneeSelector";
import { TaskInput } from "./TaskInput";
import AnimatedCircleCheck from "../TaskViewSwitcher/AnimatedCircleCheck";

const getInitialTaskData = ({
  project,
  section_id,
  profile,
  dueDate,
}: {
  project: ProjectType | null;
  section_id?: SectionType["id"] | null;
  profile: { id: string } | null;
  dueDate?: Date | null;
}): TaskType => ({
  id: uuidv4(),
  title: "",
  description: "",
  priority: "Priority",
  project_id: project?.id || null,
  section_id: section_id || null,
  parent_task_id: null,
  profile_id: profile?.id || "",
  assigned_to_id: null,
  due_date: dueDate ? dueDate.toISOString() : null,
  reminder_time: null,
  is_inbox: project ? false : true,
  is_completed: false,
  order: 0,
  completed_at: null,
  updated_at: new Date().toISOString(),
});

const AddTaskFormForProject = ({
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
  const { projects, activeProject, sections } = useTaskProjectDataProvider();
  const { profile } = useAuthProvider();

  const [taskData, setTaskData] = useState<TaskType>(
    taskForEdit ||
      getInitialTaskData({
        project: activeProject ? activeProject : project,
        section_id,
        profile,
        dueDate,
      })
  );

  const [showReminder, setShowReminder] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleEditableRef = useRef<HTMLDivElement>(null);

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
    setTaskData(
      getInitialTaskData({
        project: activeProject ? activeProject : project,
        section_id,
        profile,
        dueDate,
      })
    );

    if (titleEditableRef.current) {
      titleEditableRef.current.innerHTML = "";
      titleEditableRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskData.title) {
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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="border-b border-text-200 mx-8 bg-transparent flex items-center divide-x divide-text-200 text-xs font-medium px-8 h-10 overflow-hidden">
        <div
          className={`w-full max-w-[600px] flex items-center gap-2 py-2 pr-4`}
        >
          <AnimatedCircleCheck
            handleCheckSubmit={() => {}}
            priority={taskData.priority}
            is_completed={taskData.is_completed}
          />

          <TaskInput
            projects={projects}
            taskData={taskData}
            setTaskData={setTaskData}
            handleSubmit={handleSubmit}
            titleEditableRef={titleEditableRef}
            className=" bg-transparent  px-1"
          />
        </div>

        <div className="min-w-32">
          <AssigneeSelector
            task={taskData}
            setTask={setTaskData}
            isSmall={isSmall}
            forListView
          />
        </div>

        <div className="min-w-32">
          <DueDateSelector task={taskData} setTask={setTaskData} forListView />
        </div>

        <div className="min-w-32">
          <Priorities
            taskData={taskData}
            setTaskData={setTaskData}
            isSmall={isSmall}
            forListView
          />
        </div>

        <div className="relative">
          <div
            className="flex items-center gap-1 hover:bg-text-100 cursor-pointer p-1 px-2 rounded-full border border-text-200"
            onClick={() => setShowReminder(!showReminder)}
          >
            <Bell strokeWidth={1.5} className="w-4 h-4 text-text-500" />
            {!isSmall && (
              <span className="text-xs text-text-700">Reminders</span>
            )}
          </div>
          {showReminder && (
            <>
              <div className="absolute bg-surface border top-full -left-1/2 rounded-2xl overflow-hidden z-20 p-2">
                <input
                  type="datetime-local"
                  className="p-2 border border-text-300 rounded"
                  onChange={(e) => console.log("Set reminder:", e.target.value)}
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
            className="flex items-center gap-2 hover:bg-text-100 cursor-pointer p-1 rounded-full border border-text-200"
            onClick={() => setShowMore(!showMore)}
          >
            <Ellipsis strokeWidth={1.5} className="w-5 h-5 text-text-500" />
          </div>

          {showMore && (
            <>
              <div className="shadow-xl border border-text-200 rounded-2xl w-[250px] absolute bg-surface right-0 top-full mt-1 z-20 text-xs">
                <ul className="p-2">
                  <li className="flex items-center justify-between px-2 py-2 transition-colors hover:bg-text-100 cursor-pointer text-text-700 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Tag strokeWidth={1.5} className="w-4 h-4" />
                      <span>Labels</span>
                    </div>

                    <AtSignIcon className="w-4 h-4" />
                  </li>
                  <li className="flex items-center gap-2 px-2 py-2 transition-colors hover:bg-text-100 cursor-pointer text-text-700 rounded-2xl">
                    <MapPin strokeWidth={1.5} className="w-4 h-4" />
                    <p className="space-x-1">
                      <span>Location</span>
                      <span className="uppercase text-[10px] tracking-widest font-bold text-primary-800 bg-primary-100 p-[2px] px-1 rounded-2xl">
                        Upgrade
                      </span>
                    </p>
                  </li>
                </ul>
                <hr />
                <ul className="p-2">
                  <li className="flex items-center justify-between px-2 py-2 transition-colors hover:bg-text-100 cursor-pointer text-text-700 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <TagIcon className="w-4 h-4" />
                      <span>Labels</span>
                    </div>

                    <AtSignIcon className="w-4 h-4" />
                  </li>
                  <li className="flex items-center justify-between px-2 py-2 transition-colors hover:bg-text-100 cursor-pointer text-text-700 rounded-2xl">
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
        </div>
      </div>

      {error && (
        <p className="text-red-500 pt-3 text-center text-xs">{error}</p>
      )}
    </form>
  );
};

export default AddTaskFormForProject;
