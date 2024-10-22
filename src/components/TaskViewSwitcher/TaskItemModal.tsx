import React, { useEffect, useCallback, useMemo, memo } from "react";
import { ProjectType, TaskType } from "@/types/project";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlignLeft,
  CalendarRange,
  CheckCircle,
  ChevronUpCircle,
  CircleArrowRight,
  LucideProps,
  Tag,
  User,
  X,
} from "lucide-react";

import { useAuthProvider } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import useScreen from "@/hooks/useScreen";
import { supabaseBrowser } from "@/utils/supabase/client";
import { canEditContent } from "@/utils/permissionUtils";
import {
  ActivityAction,
  ActivityLogType,
  ActivityWithProfile,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import {
  createNotification,
  NotificationTypeEnum,
  RelatedEntityTypeEnum,
} from "@/types/notification";
import ProjectsSelector from "../AddTask/ProjectsSelector";
import AssigneeSelector from "../AddTask/AssigneeSelector";
import DateSelector from "../AddTask/DateSelector";
import Priorities from "../AddTask/Priorities";
import StatusSelector from "../AddTask/StatusSelector";
import LabelSelector from "../AddTask/LabelSelector";
import SubTasks from "./SubTasks";
import TaskModalComment from "./TaskModalComment";
import TaskDescription from "./TaskDescription";
import AnimatedTaskCheckbox from "./AnimatedCircleCheck";

// Memoized child components
const MemoizedProjectSelector = memo(ProjectsSelector);
const MemoizedAssigneeSelector = memo(AssigneeSelector);
const MemoizedDateSelector = memo(DateSelector);
const MemoizedPriorities = memo(Priorities);
const MemoizedStatusSelector = memo(StatusSelector);
const MemoizedLabelSelector = memo(LabelSelector);
const MemoizedSubTasks = memo(SubTasks);
const MemoizedTaskModalComment = memo(TaskModalComment);
const MemoizedTaskDescription = memo(TaskDescription);
const MemoizedAnimatedCircleCheck = memo(AnimatedTaskCheckbox);

// Animations config
const modalAnimations = {
  initial: {
    scaleX: 0.8,
    x: 10,
    opacity: 0.8,
    transformOrigin: "right",
    width: 0,
  },
  animate: {
    scaleX: 1,
    x: [0, 5, 0],
    opacity: 1,
    transformOrigin: "right",
  },
  exit: {
    scaleX: 0.8,
    x: 10,
    opacity: 0.8,
    transformOrigin: "right",
    width: 0,
  },
  transition: {
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1],
    x: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
};

// Field Label component for reusability
const FieldLabel = memo(({ icon: Icon, label }: {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  label: string;
}) => (
  <div className="flex items-center gap-2 text-text-500">
    <Icon strokeWidth={2} size={16} className="min-w-4 min-h-4" />
    <p className="font-medium text-xs">{label}</p>
  </div>
));

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
  const { role } = useRole();
  const { screenWidth } = useScreen();
  const queryClient = useQueryClient();
  const [taskData, setTaskData] = React.useState(task);

  // Memoize width calculation
  const modalWidth = useMemo(() => 
    screenWidth > 768 ? { width: "90%" } : { width: "100%" },
    [screenWidth]
  );

  // Optimize activity logging
  const logActivity = useCallback((
    action: ActivityAction,
    oldData?: any,
    newData?: any
  ) => {
    if (!profile?.id) return;

    const newLog: ActivityLogType = {
      id: uuidv4(),
      actor_id: profile.id,
      action,
      entity: {
        id: task.id,
        type: EntityType.TASK,
        name: task.title,
      },
      created_at: new Date().toISOString(),
      metadata: { old_data: oldData, new_data: newData },
    };

    queryClient.setQueryData(
      ["task_activities", task.id],
      (oldLogs: ActivityWithProfile[]) => [
        ...oldLogs,
        {
          ...newLog,
          actor: {
            id: profile.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            email: profile.email,
          },
        },
      ]
    );

    const { id, created_at, ...restLog } = newLog;
    createActivityLog(restLog);
  }, [profile, task.id, task.title, queryClient]);

  // Optimize task updates
  const updateTask = useCallback(async (updates: Partial<TaskType>, activityType: ActivityAction, oldData: any, newData: any) => {
    if (!profile?.id) return;

    try {
      if (!taskData.is_inbox && taskData.project_id) {
        if (!canEditContent(role({ project, page: null }), !!project?.team_id)) {
          return;
        }
      }

      const { error } = await supabaseBrowser
        .from("tasks")
        .update(updates)
        .eq("id", task.id);

      if (error) throw error;

      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, ...updates } : t)));
      logActivity(activityType, oldData, newData);
    } catch (error) {
      console.error(`Error updating task: ${error}`);
    }
  }, [profile, taskData, project, role, task.id, setTasks, tasks, logActivity]);

  // Handle title updates
  const handleSaveTaskTitle = useCallback(async () => {
    if (!profile?.id || !taskData.title.trim() || taskData.title === task.title) return;
    
    updateTask(
      { title: taskData.title },
      ActivityAction.UPDATED_TASK,
      { title: task.title },
      { title: taskData.title }
    );
  }, [profile, taskData.title, task.title, updateTask]);

  // Cleanup effect
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  return (
    <div
      className="fixed inset-0 z-20 cursor-default"
      id="fixed_dropdown"
      onClick={onClose}
    >
      <AnimatePresence>
        <motion.div
          {...modalAnimations}
          animate={{ ...modalAnimations.animate, ...modalWidth }}
          className={`bg-surface rounded-l-2xl max-w-[52rem] overflow-auto flex flex-col fixed top-0 right-0 bottom-0 border-l border-text-100 shadow-md ${
            screenWidth > 768 ? "w-11/12" : "w-full"
          }`}
          onClick={(ev) => ev.stopPropagation()}
        >
          <div className={`p-2 flex items-center justify-between border-b border-text-100 ${
            screenWidth > 768 ? "px-4" : "px-3"
          }`}>
            <button
              className="flex items-center gap-2 text-text-500 hover:bg-text-100 rounded-lg p-2 transition text-xs"
              onClick={onCheckClick}
            >
              <MemoizedAnimatedCircleCheck
                handleCheckSubmit={onCheckClick}
                is_completed={taskData.is_completed}
                priority={task.priority}
              />
              <span>Mark complete</span>
            </button>

            <button
              className="p-1 hover:bg-text-100 transition rounded-lg"
              onClick={onClose}
            >
              <X strokeWidth={1.5} className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col space-y-8">
            <div className="px-4 md:px-24 pt-8">
              <input
                type="text"
                className={`text-3xl font-bold border-none focus-visible:outline-none bg-transparent w-full text-text-900 ${
                  taskData.is_completed ? "line-through text-text-500" : ""
                }`}
                value={taskData.title}
                onChange={(ev) =>
                  setTaskData((prev) => ({ ...prev, title: ev.target.value }))
                }
                onKeyDown={(ev) => ev.key === "Enter" && handleSaveTaskTitle()}
                onBlur={handleSaveTaskTitle}
              />
            </div>

            <div className="space-y-3 flex-1">
              <div className="grid grid-cols-[20%_80%] items-center gap-3 px-4 md:px-24">
                <FieldLabel icon={CheckCircle} label="Project" />
                <MemoizedProjectSelector
                  setTask={setTaskData}
                  isInbox
                  task={taskData}
                  forTaskModal
                />

                <FieldLabel icon={User} label="Assignee" />
                <MemoizedAssigneeSelector
                  task={taskData}
                  setTask={setTaskData}
                  forTaskModal
                  project={project}
                />

                <FieldLabel icon={CalendarRange} label="Dates" />
                <MemoizedDateSelector
                  forTaskModal
                  task={taskData}
                  setTask={setTaskData}
                />

                <FieldLabel icon={ChevronUpCircle} label="Priority" />
                <MemoizedPriorities
                  taskData={taskData}
                  setTaskData={setTaskData}
                  forTaskItemModal
                />

                <FieldLabel icon={CircleArrowRight} label="Status" />
                <MemoizedStatusSelector
                  taskData={taskData}
                  setTaskData={setTaskData}
                  forTaskItemModal
                />

                <FieldLabel icon={Tag} label="Labels" />
                <MemoizedLabelSelector
                  task={taskData}
                  setTask={setTaskData}
                  forTaskModal
                />
              </div>

              <MemoizedSubTasks
                task={task}
                setTasks={setTasks}
                tasks={tasks}
                project={project}
                subTasks={subTasks}
              />

              <MemoizedTaskModalComment task={task} />

              <MemoizedTaskDescription
                taskData={taskData}
                setTasks={setTasks}
                tasks={tasks}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default memo(TaskItemModal);