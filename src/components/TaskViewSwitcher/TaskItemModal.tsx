import React, { useEffect, useState } from "react";
import { ProjectType, TaskType } from "@/types/project";

import Priorities from "../AddTask/Priorities";
import AddComentForm from "./AddComentForm";
import {
  CalendarRange,
  CheckCircle,
  ChevronUpCircle,
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
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useRole } from "@/context/RoleContext";
import { canEditTask } from "@/types/hasPermission";
import useScreen from "@/hooks/useScreen";

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
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [taskData, setTaskData] = useState<TaskType>(task);

  useEffect(() => {
    document.body.classList.add("overflow-y-hidden");

    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, []);

  const logActivity = (oldData?: any, newData?: any) => {
    if (!profile?.id) return;

    createActivityLog({
      actor_id: profile.id,
      action: ActivityAction.UPDATED_TASK,
      entity_id: task.id,
      entity_type: EntityType.TASK,
      metadata: { old_data: oldData, new_data: newData },
    });
  };

  const { role } = useRole();

  useEffect(() => {
    const updateTask = async () => {
      try {
        if (!profile?.id) return;

        if (!taskData.is_inbox && taskData.project_id) {
          const userRole = role(taskData.project_id);
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

          logActivity(
            {
              assignees: task.assignees,
            },
            {
              assignees: taskData.assignees,
            }
          );
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

          createActivityLog({
            actor_id: profile.id,
            action: ActivityAction.UPDATED_TASK,
            entity_id: task.id,
            entity_type: EntityType.TASK,
            metadata: {
              old_data: {
                dates: task.dates,
              },
              new_data: {
                dates: taskData.dates,
              },
            },
          });

          logActivity(
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
            {
              priority: task.priority,
            },
            {
              priority: taskData.priority,
            }
          );
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
          className={`bg-background rounded-l-2xl max-w-[52rem] overflow-y-auto flex flex-col fixed top-0 right-0 bottom-0 border-l border-text-100 shadow-md ${
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
                className="flex items-center gap-2 hover:bg-text-100 rounded-lg p-2 transition text-xs"
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

            <div className="flex items-center gap-2">
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
                className={`text-3xl font-bold border-none focus-visible:outline-none bg-transparent w-full ${
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
              <div className="grid grid-cols-[20%_80%] items-center text-xs gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle strokeWidth={2} size={16} />
                  <p className="font-semibold text-xs">Project</p>
                </div>
                <ProjectsSelector
                  setTask={setTaskData}
                  isInbox
                  task={taskData}
                  forTaskModal
                />

                <div className="flex items-center gap-2">
                  <User strokeWidth={2} size={16} />
                  <p
                    className={`font-semibold text-xs ${
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

                <div className="flex items-start gap-2">
                  <CalendarRange strokeWidth={2} size={16} />
                  <p
                    className={`font-semibold text-xs ${
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

                <div className="flex items-center gap-2">
                  <ChevronUpCircle strokeWidth={2} size={16} />
                  <p className="font-semibold text-xs">Priority</p>
                </div>

                <Priorities
                  taskData={taskData}
                  setTaskData={setTaskData}
                  forTaskItemModal
                />

                {/* <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-text-100 rounded-lg cursor-pointer transition p-[6px] px-2 group">
                  <p className="font-semibold text-xs">Labels</p>
                  <Plus strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-text-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-text-100 rounded-lg cursor-pointer transition p-[6px] px-2 group">
                  <p className="font-semibold text-xs">Reminders</p>
                  <Plus strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-text-200 m-2"></div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between hover:bg-text-100 rounded-lg cursor-pointer transition p-[6px] px-2 group">
                  <p className="space-x-1 font-semibold text-xs">
                    <span>Location</span>
                    <span className="uppercase text-[10px] tracking-widest font-bold text-primary-800 bg-primary-100 p-[2px] px-1 rounded-lg">
                      Upgrade
                    </span>
                  </p>
                  <LockKeyhole strokeWidth={1.5} className="w-4 h-4" />
                </div>
              </div>
              <div className="h-[1px] bg-text-200 m-2"></div>
            </div> */}
              </div>

              {/* <TaskDescription
              taskData={taskData}
              setTasks={setTasks}
              tasks={tasks}
            /> */}

              <SubTasks
                task={task}
                setTasks={setTasks}
                tasks={tasks}
                project={project}
                subTasks={subTasks}
              />
            </div>

            <div className="bg-text-50 p-8 rounded-lg">
              <div>
                <ul className="flex items-center gap-4">
                  <li className="font-semibold text-xs py-2 bg-text-50 transition cursor-pointer border-b-2 text-text-700 border-text-700 hover:border-text-700">
                    Comments
                  </li>
                  <li className="font-semibold text-xs py-2 bg-transparent transition cursor-pointer border-b-2 text-text-500 border-transparent hover:border-text-700">
                    Activity
                  </li>
                </ul>
              </div>

              <div className="mb-8 bg-text-200 h-[1px]" />

              {!showCommentForm && (
                <div className="flex items-center gap-2">
                  <Image
                    src={profile?.avatar_url || "/default_avatar.png"}
                    width={28}
                    height={28}
                    alt={profile?.full_name || profile?.username || "avatar"}
                    className="rounded-md object-cover max-w-[28px] max-h-[28px]"
                  />

                  <div
                    className="flex items-center justify-between w-full border border-text-100 rounded-lg py-2 px-4 bg-background hover:bg-text-100 cursor-pointer transition text-xs"
                    onClick={() => setShowCommentForm(true)}
                  >
                    <p className="">Write a comment</p>
                  </div>
                </div>
              )}

              {showCommentForm && (
                <div className="flex items-start gap-2 w-full">
                  <Image
                    src={profile?.avatar_url || "/default_avatar.png"}
                    width={28}
                    height={28}
                    alt={profile?.full_name || profile?.username || "avatar"}
                    className="rounded-md object-cover max-w-[28px] max-h-[28px]"
                  />
                  {/* <AddComentForm
                  onCancelClick={() => setShowCommentForm(false)}
                  task={task}
                /> */}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TaskItemModal;
