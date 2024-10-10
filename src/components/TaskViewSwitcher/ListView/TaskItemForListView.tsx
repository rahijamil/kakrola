import { ProjectType, TaskType } from "@/types/project";
import TaskItemModal from "../TaskItemModal";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import TaskItemMoreDropdown from "../TaskItemMoreDropdown";
import { Draggable } from "@hello-pangea/dnd";
import ConfirmAlert from "../../AlertBox/ConfirmAlert";
import { ChevronRight, PanelRight, Workflow } from "lucide-react";
import { supabaseBrowser } from "@/utils/supabase/client";
import AddTask from "../../AddTask";
import { debounce } from "lodash";
import { getDateInfo } from "@/utils/getDateInfo";
import AnimatedCircleCheck from "../AnimatedCircleCheck";
import DateSelector from "@/components/AddTask/DateSelector";
import AssigneeSelector from "@/components/AddTask/AssigneeSelector";
import Priorities from "@/components/AddTask/Priorities";
import LabelSelector from "@/components/AddTask/LabelSelector";
import { useAuthProvider } from "@/context/AuthContext";
import {
  ActivityAction,
  ActivityLogType,
  ActivityWithProfile,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useRole } from "@/context/RoleContext";
import { canDeleteTask, canEditTask } from "@/types/hasPermission";
import useCheckClick from "@/hooks/useCheckClick";
import LocationSelector from "@/components/AddTask/LocationSelector";
import {
  NotificationTypeEnum,
  RelatedEntityTypeEnum,
} from "@/types/notification";
import { createNotification } from "@/types/notification";
import { usePathname, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";

const TaskItemForListView = ({
  task,
  subTasks,
  index,
  project,
  setTasks,
  tasks,
  setShowModal,
  setShowAddTask,
  showModal,
  showDeleteConfirm,
  smallAddTask,
  setShowDeleteConfirm,
  column,
}: {
  task: TaskType;
  subTasks: TaskType[];
  index: number;
  project: ProjectType | null;
  setTasks: (tasks: TaskType[]) => void;
  tasks: TaskType[];
  showModal?: string | null;
  smallAddTask?: boolean;
  setShowModal?: Dispatch<SetStateAction<string | null>>;
  setShowAddTask?: Dispatch<SetStateAction<string | number | null>>;
  showDeleteConfirm?: string | null;
  setShowDeleteConfirm?: Dispatch<SetStateAction<string | null>>;
  column?: {
    id: string;
    title: string;
    tasks: TaskType[];
    is_archived?: boolean;
  };
}) => {
  const [addTaskAboveBellow, setAddTaskAboveBellow] = useState<{
    position: "above" | "below";
    task: TaskType;
  } | null>(null);

  const [taskData, setTaskData] = useState<TaskType>(task);

  const { profile } = useAuthProvider();
  const { role } = useRole();
  const { handleCheckClickDebounced } = useCheckClick({
    task,
    tasks,
    setTasks,
  });

  const handleTaskDelete = async () => {
    if (!profile?.id) return;

    if (!task.is_inbox && task.project_id) {
      const userRole = role({ _project_id: task.project_id });

      const canDelTask = userRole ? canDeleteTask(userRole) : false;
      if (!canDelTask) return;

      const updatedTasks = tasks.filter((t) => t.id !== task.id);

      setTasks(updatedTasks);

      const { error } = await supabaseBrowser
        .from("tasks")
        .delete()
        .eq("id", task.id);

      if (error) {
        console.log(error);
      }

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.DELETED_TASK,
        entity: {
          id: task.id,
          type: EntityType.TASK,
          name: task.title,
        },
        metadata: {
          old_data: task,
        },
      });
    } else {
      const updatedTasks = tasks.filter((t) => t.id !== task.id);

      setTasks(updatedTasks);

      const { error } = await supabaseBrowser
        .from("tasks")
        .delete()
        .eq("id", task.id);

      if (error) {
        console.log(error);
      }

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.DELETED_TASK,
        entity: {
          id: task.id,
          type: EntityType.TASK,
          name: task.title,
        },
        metadata: {
          old_data: task,
        },
      });
    }
  };

  const [editTaskId, setEditTaskId] = useState<TaskType["id"] | null>(null);

  const [editTaskTitle, setEditTaskTitle] = useState(false);
  const queryClient = useQueryClient();

  const handleUpdateTaskTitle = () => {
    setEditTaskTitle(false);
  };

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
          taskData.assignees.flatMap((a) => a.id).join(",") !==
          task.assignees.flatMap((a) => a.id).join(",")
        ) {
          const oldAssignees = task.assignees.map((a) => a.id);
          const newAssignees = taskData.assignees.map((a) => a.id);

          // Find added and removed assignees
          const addedAssignees = taskData.assignees.filter(
            (a) => !oldAssignees.includes(a.id)
          );
          const removedAssignees = task.assignees.filter(
            (a) => !newAssignees.includes(a.id)
          );

          const { data, error } = await supabaseBrowser
            .from("tasks")
            .update({
              assignees: taskData.assignees,
            })
            .eq("id", task.id);

          if (error) {
            throw error;
          }

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
    taskData.assignees,
    taskData.dates,
    taskData.priority,
    taskData.task_labels,
    task.id,
  ]);

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [style, setStyle] = useState({
    top: "auto",
    left: "auto",
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTask = searchParams.get("task");

  useEffect(() => {
    if (searchTask && setShowModal) {
      setShowModal(searchTask);
    }
  }, [searchTask]);

  return (
    <div className="w-full">
      {addTaskAboveBellow?.position == "above" && (
        <AddTask
          onClose={() => setAddTaskAboveBellow(null)}
          isSmall={smallAddTask}
          section_id={task.section_id}
          project={project}
          tasks={tasks}
          setTasks={setTasks}
          addTaskAboveBellow={addTaskAboveBellow}
        />
      )}

      {editTaskId == task.id ? (
        <AddTask
          onClose={() => setEditTaskId(null)}
          isSmall={smallAddTask}
          section_id={task.section_id}
          project={project}
          tasks={tasks}
          setTasks={setTasks}
          addTaskAboveBellow={addTaskAboveBellow}
          taskForEdit={task}
        />
      ) : (
        <Draggable draggableId={task.id?.toString()} index={index}>
          {(provided, snapshot) => (
            <tr
              onContextMenu={(ev) => {
                ev.preventDefault();
                setShowContextMenu(true);
                setStyle({
                  top:
                    window.innerHeight -
                      (triggerRef.current?.getBoundingClientRect().bottom ||
                        0) -
                      50 >
                    (triggerRef.current?.clientHeight || 0)
                      ? ev.clientY + "px"
                      : ev.clientY + "px",
                  left: ev.clientX + "px",
                });
              }}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`group border-b border-text-100 cursor-pointer flex items-center justify-between h-10 ring-1 divide-x divide-text-200 relative ${
                snapshot.isDragging && "border-t"
              } ${
                showModal === task.id.toString()
                  ? "ring-primary-300 bg-primary-10"
                  : "ring-transparent bg-background"
              }`}
            >
              <>
                <td
                  className={`w-[30%] md:w-[40%] pl-4 md:pl-8 flex items-center justify-between gap-4 group ring-1 ring-transparent h-10 ${
                    editTaskTitle ? "bg-primary-10" : "hover:ring-primary-300"
                  }`}
                  onClick={() => setShowAddTask && setShowAddTask(null)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <AnimatedCircleCheck
                      handleCheckSubmit={handleCheckClickDebounced}
                      priority={task.priority}
                      is_completed={task.is_completed}
                    />
                    <div
                      className="flex items-center gap-2 w-full"
                      onClick={() => {
                        setShowModal && setShowModal(task.id.toString());
                      }}
                    >
                      <div className="w-full">
                        {!editTaskTitle ? (
                          <h2
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setEditTaskTitle(true);
                            }}
                            className={`${
                              task.is_completed
                                ? "line-through text-text-500"
                                : ""
                            } line-clamp-1 cursor-pointer h-10 flex items-center w-full`}
                          >
                            {task.title}
                          </h2>
                        ) : (
                          <input
                            value={taskData.title}
                            onChange={(ev) =>
                              setTaskData({
                                ...taskData,
                                title: ev.target.value,
                              })
                            }
                            className="outline-none w-full bg-background rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-primary-300 h-7"
                            onKeyDown={(ev) => {
                              if (ev.key === "Enter") {
                                handleUpdateTaskTitle();
                              }
                            }}
                            onBlur={handleUpdateTaskTitle}
                            autoFocus
                            onFocus={(ev) => ev.target.select()}
                            onClick={(ev) => ev.stopPropagation()}
                          />
                        )}
                      </div>

                      {subTasks.length > 0 && (
                        <button
                          onClick={(ev) => ev.stopPropagation()}
                          className="flex items-center gap-[2px] text-text-500 hover:bg-text-100 rounded-lg transition hover:text-text-700 p-0.5 px-1"
                        >
                          <Workflow strokeWidth={1.5} className="w-3 h-3" />
                          <span className="text-xs">
                            {subTasks.filter((t) => t.is_completed).length}/
                            {subTasks.length}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pr-1">
                    <button
                      onClick={() => {
                        setShowModal && setShowModal(task.id.toString());
                        window.history.pushState(
                          null,
                          "",
                          `${pathname}?task=${task.id}`
                        );
                      }}
                      className={`px-2 py-1 transition rounded-lg hover:bg-text-100 items-center gap-1 text-text-500 ${
                        !editTaskTitle ? "hidden group-hover:flex" : "flex"
                      }`}
                    >
                      <PanelRight strokeWidth={1.5} className="w-4 h-4" />
                      <span className="text-[11px] uppercase font-medium">
                        Open
                      </span>
                    </button>
                  </div>
                </td>
                <td className="w-[15%]">
                  <AssigneeSelector
                    task={taskData}
                    setTask={setTaskData}
                    forListView
                    project={project}
                  />
                </td>
                <td className="w-[15%]">
                  <div onClick={(ev) => ev.stopPropagation()}>
                    <DateSelector
                      task={taskData}
                      setTask={setTaskData}
                      forListView
                    />
                  </div>
                </td>
                <td className="w-[15%]">
                  <Priorities
                    taskData={taskData}
                    setTaskData={setTaskData}
                    forListView
                  />
                </td>
                <td className="w-[15%]">
                  <LabelSelector
                    task={taskData}
                    setTask={setTaskData}
                    forListView
                  />
                </td>

                {/* <td className="w-[15%]">
                  <LocationSelector
                    task={taskData}
                    setTask={setTaskData}
                    forListView
                  />
                </td> */}
              </>

              <TaskItemMoreDropdown
                setShowDeleteConfirm={setShowDeleteConfirm!}
                setAddTaskAboveBellow={setAddTaskAboveBellow}
                task={task}
                column={column}
                setEditTaskId={setEditTaskId}
                showContextMenu={showContextMenu}
                setShowContextMenu={setShowContextMenu}
                style={style}
                triggerRef={triggerRef}
              />
            </tr>
          )}
        </Draggable>
      )}

      {addTaskAboveBellow?.position == "below" && (
        <AddTask
          onClose={() => setAddTaskAboveBellow(null)}
          isSmall={smallAddTask}
          section_id={task.section_id}
          project={project}
          tasks={tasks}
          setTasks={setTasks}
          addTaskAboveBellow={addTaskAboveBellow}
        />
      )}

      {showModal == task.id && setShowModal && (
        <TaskItemModal
          task={task}
          subTasks={subTasks}
          setTasks={setTasks}
          tasks={tasks}
          onClose={() => {
            setShowModal(null);
            window.history.pushState(null, "", pathname);
          }}
          onCheckClick={handleCheckClickDebounced}
          project={project}
        />
      )}

      {showDeleteConfirm == task.id && setShowDeleteConfirm && (
        <ConfirmAlert
          description={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold">&quot;{task.title}&quot;</span>?
            </>
          }
          submitBtnText="Delete"
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={handleTaskDelete}
        />
      )}
    </div>
  );
};

export default TaskItemForListView;
