import React, { useEffect, useState } from "react";
import { ProjectType, TaskType } from "@/types/project";

import Priorities from "../AddTask/Priorities";
import AddComentForm from "./AddComentForm";
import {
  AlignLeft,
  CalendarRange,
  CheckCircle,
  ChevronUpCircle,
  LockKeyhole,
  Plus,
  Tag,
  User,
  X,
} from "lucide-react";
import { useAuthProvider } from "@/context/AuthContext";
import Image from "next/image";
import ProjectsSelector from "../AddTask/ProjectsSelector";
import AssigneeSelector from "../AddTask/AssigneeSelector";
import DateSelector from "../AddTask/DateSelector";
import AnimatedCircleCheck from "./AnimatedCircleCheck";
import { AnimatePresence, motion } from "framer-motion";
import TaskDescription from "./TaskDescription";
import SubTasks from "./SubTasks";
import { supabaseBrowser } from "@/utils/supabase/client";
import {
  ActivityAction,
  ActivityLogType,
  ActivityWithProfile,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useRole } from "@/context/RoleContext";
import { canEditTask } from "@/types/hasPermission";
import useScreen from "@/hooks/useScreen";
import LabelSelector from "../AddTask/LabelSelector";
import TaskModalComment from "./TaskModalComment";
import { ProfileType } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

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
  const [taskData, setTaskData] = useState<TaskType>(task);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const logActivity = (
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
  };

  const { role } = useRole();

  useEffect(() => {
    const updateTask = async () => {
      try {
        if (!profile?.id) return;

        if (!taskData.is_inbox && taskData.project_id) {
          const userRole = role({ _project_id: taskData.project_id });
          const canEdit = userRole ? canEditTask(userRole) : false;

          if (!canEdit) return;
        }

        setTasks(tasks.map((t) => (t.id === task.id ? taskData : t)));

        if (
          taskData.project_id !== task.project_id ||
          taskData.section_id !== task.section_id
        ) {
          const { data, error } = await supabaseBrowser
            .from("tasks")
            .update({
              project_id: taskData.project_id,
              section_id: taskData.section_id,
            })
            .eq("id", task.id);

          if (error) {
            throw error;
          }

          logActivity(
            ActivityAction.UPDATED_TASK,
            {
              project_id: task.project_id,
              section_id: task.section_id,
            },
            {
              project_id: taskData.project_id,
              section_id: taskData.section_id,
            }
          );
        }

        if (
          taskData.assignees.flatMap((a) => a.id).join(",") !==
          task.assignees.flatMap((a) => a.id).join(",")
        ) {
          const { data, error } = await supabaseBrowser
            .from("tasks")
            .update({
              assignees: taskData.assignees,
            })
            .eq("id", task.id);

          if (error) {
            throw error;
          }

          const oldAssignees = task.assignees.map((a) => a.id);
          const newAssignees = taskData.assignees.map((a) => a.id);

          // Find added and removed assignees
          const addedAssignees = taskData.assignees.filter(
            (a) => !oldAssignees.includes(a.id)
          );
          const removedAssignees = task.assignees.filter(
            (a) => !newAssignees.includes(a.id)
          );

          // Log activity for added assignees
          if (addedAssignees.length > 0) {
            logActivity(
              ActivityAction.ASSIGNED_TASK,
              { assignees: task.assignees },
              { assignees: addedAssignees }
            );
          }

          // Log activity for removed assignees
          if (removedAssignees.length > 0) {
            logActivity(
              ActivityAction.UNASSIGNED_TASK,
              { assignees: task.assignees },
              { assignees: removedAssignees }
            );
          }
        }

        if (
          taskData.dates.start_date !== task.dates.start_date ||
          taskData.dates.end_date !== task.dates.end_date ||
          taskData.dates.start_time !== task.dates.start_time ||
          taskData.dates.end_time !== task.dates.end_time ||
          taskData.dates.reminder !== task.dates.reminder
        ) {
          const { data, error } = await supabaseBrowser
            .from("tasks")
            .update({
              dates: taskData.dates,
            })
            .eq("id", task.id);

          if (error) {
            throw error;
          }

          logActivity(
            ActivityAction.UPDATED_TASK_DATES,
            {
              dates: task.dates,
            },
            {
              dates: taskData.dates,
            }
          );
        }

        if (taskData.priority !== task.priority) {
          const { data, error } = await supabaseBrowser
            .from("tasks")
            .update({
              priority: taskData.priority,
            })
            .eq("id", task.id);

          if (error) {
            throw error;
          }

          logActivity(
            ActivityAction.UPDATED_TASK_PRIORITY,
            {
              priority: task.priority,
            },
            {
              priority: taskData.priority,
            }
          );
        }

        if (
          taskData.task_labels.flatMap((label) => label.id).join(",") !==
          task.task_labels.flatMap((label) => label.id).join(",")
        ) {
          const { data, error } = await supabaseBrowser
            .from("tasks")
            .update({
              task_labels: taskData.task_labels,
            })
            .eq("id", task.id);

          if (error) {
            throw error;
          }

          const oldLabels = task.task_labels.map((l) => l.id);
          const newLabels = taskData.task_labels.map((l) => l.id);

          // Find added and removed labels
          const addedLabels = taskData.task_labels.filter(
            (l) => !oldLabels.includes(l.id)
          );
          const removedLabels = task.task_labels.filter(
            (l) => !newLabels.includes(l.id)
          );

          // Log activity for added labels
          if (addedLabels.length > 0) {
            logActivity(
              ActivityAction.ADDED_TASK_LABELS,
              { task_labels: task.task_labels },
              { task_labels: addedLabels }
            );
          }

          // Log activity for removed assignees
          if (removedLabels.length > 0) {
            logActivity(
              ActivityAction.REMOVED_TASK_LABELS,
              { task_labels: task.task_labels },
              { task_labels: removedLabels }
            );
          }
        }
      } catch (error) {
        console.error(`Error updating task: ${error}`);
      }
    };

    updateTask();
  }, [
    taskData.project_id,
    taskData.section_id,
    taskData.assignees,
    taskData.dates,
    taskData.priority,
    taskData.task_labels,
  ]);

  const handleSaveTaskTitle = async () => {
    if (!profile?.id) return;

    try {
      if (taskData.title.trim() && taskData.title !== task.title) {
        setTasks(
          tasks.map((t) =>
            t.id === task.id ? { ...task, title: taskData.title } : t
          )
        );

        const { data, error } = await supabaseBrowser
          .from("tasks")
          .update({
            title: taskData.title,
          })
          .eq("id", task.id);

        if (error) {
          console.log(error);
        }

        logActivity(
          ActivityAction.UPDATED_TASK,
          {
            title: task.title,
          },
          {
            title: taskData.title,
          }
        );
      }
    } catch (error) {
      console.error(`Error updating task title: ${error}`);
    }
  };

  const { screenWidth } = useScreen();

  return (
    <div
      className="fixed inset-0 z-20 cursor-default"
      id="fixed_dropdown"
      onClick={onClose}
    >
      <AnimatePresence>
        <motion.div
          initial={{
            scaleX: 0.8,
            x: 10,
            opacity: 0.8,
            transformOrigin: "right",
            width: 0,
          }}
          animate={{
            scaleX: 1,
            x: [0, 5, 0], // Subtle bounce in the respective direction
            opacity: 1,
            transformOrigin: "right",
            width: screenWidth > 768 ? "90%" : "100%",
          }}
          exit={{
            scaleX: 0.8,
            x: 10,
            opacity: 0.8,
            transformOrigin: "right",
            width: 0,
          }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
            x: {
              type: "spring",
              stiffness: 300,
              damping: 15,
            },
          }}
          className={`bg-surface rounded-l-2xl max-w-[52rem] overflow-auto flex flex-col fixed top-0 right-0 bottom-0 border-l border-text-100 shadow-md ${
            screenWidth > 768 ? "w-11/12" : "w-full"
          }`}
          onClick={(ev) => ev.stopPropagation()}
        >
          <div
            className={`p-2 flex items-center justify-between border-b border-text-100 ${
              screenWidth > 768 ? "px-4" : "px-3"
            }`}
          >
            <div>
              <button
                className="flex items-center gap-2 text-text-500 hover:bg-text-100 rounded-lg p-2 transition text-xs"
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

            <div className="flex items-center gap-2 text-text-500">
              {/* <button className="p-1 hover:bg-text-100 transition rounded-lg">
              <Ellipsis strokeWidth={1.5} className="w-6 h-6" />
            </button> */}
              <button
                className="p-1 hover:bg-text-100 transition rounded-lg"
                onClick={onClose}
              >
                <X strokeWidth={1.5} className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div
            className={`flex-1 flex flex-col ${
              screenWidth > 768 ? "p-8 space-y-8" : "p-3 px-6 space-y-8"
            }`}
          >
            <div>
              <input
                type="text"
                className={`text-3xl font-bold border-none focus-visible:outline-none bg-transparent w-full text-text-900 ${
                  taskData.is_completed ? "line-through text-text-500" : ""
                }`}
                value={taskData.title}
                onChange={(ev) =>
                  setTaskData((prevTaskData) => ({
                    ...prevTaskData,
                    title: ev.target.value,
                  }))
                }
                onKeyDown={(ev) => ev.key === "Enter" && handleSaveTaskTitle()}
                onBlur={handleSaveTaskTitle}
              />
            </div>

            <div className="space-y-3 flex-1">
              <div className="grid grid-cols-[20%_80%] items-center gap-3">
                <div className="flex items-center gap-2 text-text-500">
                  <CheckCircle strokeWidth={2} size={16} />
                  <p className="font-medium text-xs">Project</p>
                </div>
                <ProjectsSelector
                  setTask={setTaskData}
                  isInbox
                  task={taskData}
                  forTaskModal
                />

                <div className="flex items-center gap-2 text-text-500">
                  <User strokeWidth={2} size={16} />
                  <p
                    className={`font-medium text-xs ${
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

                <div className="flex items-start gap-2 text-text-500">
                  <CalendarRange strokeWidth={2} size={16} />
                  <p
                    className={`font-medium text-xs ${
                      task.dates.end_date !== null && "cursor-text"
                    }`}
                  >
                    Dates
                  </p>
                </div>
                <DateSelector
                  forTaskModal
                  task={taskData}
                  setTask={setTaskData}
                />

                <div className="flex items-center gap-2 text-text-500">
                  <ChevronUpCircle strokeWidth={2} size={16} />
                  <p className="font-medium text-xs">Priority</p>
                </div>

                <Priorities
                  taskData={taskData}
                  setTaskData={setTaskData}
                  forTaskItemModal
                />

                <div className="flex items-start gap-2 text-text-500">
                  <Tag strokeWidth={2} size={16} />
                  <p
                    className={`font-medium text-xs ${
                      task.dates.end_date !== null && "cursor-text"
                    }`}
                  >
                    Labels
                  </p>
                </div>
                <LabelSelector
                  task={taskData}
                  setTask={setTaskData}
                  forTaskModal
                />
              </div>

              <div className="grid grid-cols-[20%_80%] items-start gap-3">
                <div className="flex items-center gap-2 pt-2 text-text-500">
                  <AlignLeft strokeWidth={2} size={16} />
                  <p className="font-medium text-xs">Description</p>
                </div>

                <TaskDescription
                  taskData={taskData}
                  setTasks={setTasks}
                  tasks={tasks}
                />
              </div>

              <SubTasks
                task={task}
                setTasks={setTasks}
                tasks={tasks}
                project={project}
                subTasks={subTasks}
              />
            </div>
          </div>

          <TaskModalComment task={task} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TaskItemModal;
