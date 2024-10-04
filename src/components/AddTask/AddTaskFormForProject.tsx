import React, { useEffect, useRef, useState } from "react";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { ProjectType, SectionType, TaskType } from "@/types/project";

import Priorities from "./Priorities";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import DateSelector from "./DateSelector";
import AssigneeSelector from "./AssigneeSelector";
import { TaskInput } from "./TaskInput";
import AnimatedCircleCheck from "../TaskViewSwitcher/AnimatedCircleCheck";
import { getInitialTaskData } from "@/lib/getInitialTaskData";
import LabelSelector from "./LabelSelector";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useRole } from "@/context/RoleContext";
import { canCreateTask, canEditTask } from "@/types/hasPermission";

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
}: {
  onClose: () => void;
  isSmall?: boolean;
  section_id?: SectionType["id"] | null;
  parentTaskIdForSubTask?: string | number;
  project: ProjectType | null;
  setTasks: (tasks: TaskType[]) => void;
  tasks: TaskType[];
  addTaskAboveBellow?: { position: "above" | "below"; task: TaskType } | null;
  taskForEdit?: TaskType;
  biggerTitle?: boolean;
}) => {
  const { projects, activeProject } = useSidebarDataProvider();
  const { profile } = useAuthProvider();

  const [taskData, setTaskData] = useState<TaskType>(
    taskForEdit ||
      getInitialTaskData({
        project: activeProject ? activeProject : project,
        section_id,
        profile,
      })
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleEditableRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { role } = useRole();

  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;

      // Check if the click is outside the form and does not have a specific attribute
      if (
        formRef.current &&
        !formRef.current.contains(target) &&
        !target.closest('[data-form-element="true"]')
      ) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

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

    if (!profile?.id) {
      return;
    }

    setLoading(true);
    setError(null);

    const isEditing = !!taskForEdit;
    let updatedTasks: TaskType[] = [];

    try {
      if (isEditing && taskData.project_id) {
        // Optimistically update the task in the UI
        updatedTasks = tasks.map((t) =>
          t.id === taskData.id ? { ...t, ...taskData } : t
        );
        setTasks(updatedTasks);
        setLoading(false);

        const userRole = role({ _project_id: taskData.project_id });
        const canUpdateSection = userRole ? canEditTask(userRole) : false;
        if (!canUpdateSection) return;

        // Update the existing task in Supabase
        const { data, error } = await supabaseBrowser
          .from("tasks")
          .update(taskData)
          .eq("id", taskData.id)
          .select()
          .single();

        if (error) throw error;

        // Log the task update activity
        createActivityLog({
          actor_id: profile.id,
          action: ActivityAction.UPDATED_TASK,
          entity_type: EntityType.TASK,
          entity_id: taskData.id,
          metadata: {
            old_data: taskForEdit,
            new_data: data,
          },
        });

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
          newTask.order =
            Math.max(...tasks.map((task) => taskData.order), 0) + 1;
          updatedTasks = [...tasks, newTask];
        }

        // Optimistically update the task list in the UI
        setTasks(updatedTasks);
        setLoading(false);
        // Reset form and close
        resetTaskData();

        if (!taskData.project_id) return;
        const userRole = role({ _project_id: taskData.project_id });
        const canUpdateSection = userRole ? canCreateTask(userRole) : false;
        if (!canUpdateSection) return;

        // Insert the new task into Supabase
        const { id: tempId, ...taskDataWithoutId } = newTask;
        const { data, error } = await supabaseBrowser
          .from("tasks")
          .insert([taskDataWithoutId])
          .select()
          .single();

        if (error) throw error;

        // Log the task creation activity
        createActivityLog({
          actor_id: profile.id,
          action: ActivityAction.CREATED_TASK,
          entity_type: EntityType.TASK,
          entity_id: data.id,
          metadata: {
            new_data: data,
          },
        });

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
    <form ref={formRef} onSubmit={handleSubmit} className="w-full">
      <div className="border-b border-text-100 bg-transparent flex items-center font-medium h-10 overflow-hidden text-xs divide-x divide-text-200 pl-7 whitespace-nowrap">
        <div className={`w-[30%] md:w-[40%] flex items-center gap-2 py-2 pr-4`}>
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
            className="bg-transparent px-1"
          />
        </div>

        <div className="w-[15%]">
          <AssigneeSelector
            task={taskData}
            setTask={setTaskData}
            isSmall={isSmall}
            forListView
            dataFromElement
            project={project}
          />
        </div>

        <div className="w-[15%]">
          <DateSelector
            task={taskData}
            setTask={setTaskData}
            forListView
            dataFromElement
          />
        </div>

        <div className="w-[15%]">
          <Priorities
            taskData={taskData}
            setTaskData={setTaskData}
            isSmall={isSmall}
            forListView
            dataFromElement
          />
        </div>

        <div className="w-[15%]">
          <LabelSelector
            task={taskData}
            setTask={setTaskData}
            isSmall={isSmall}
            forListView
            dataFromElement
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 pt-3 text-center text-xs">{error}</p>
      )}
    </form>
  );
};

export default AddTaskFormForProject;
