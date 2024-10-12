import { ProjectType, SectionType, TaskType } from "@/types/project";
import TaskItemModal from "./TaskItemModal";
import {
  Dispatch,
  LegacyRef,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import TaskItemMoreDropdown from "./TaskItemMoreDropdown";
import { Draggable } from "@hello-pangea/dnd";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import {
  AlignLeft,
  ArrowRight,
  CalendarRange,
  Clock,
  Minus,
  User,
  Workflow,
} from "lucide-react";
import { supabaseBrowser } from "@/utils/supabase/client";
import AddTask from "../AddTask";
import { debounce } from "lodash";
import { getDateInfo } from "@/utils/getDateInfo";
import AnimatedCircleCheck from "./AnimatedCircleCheck";
import { useGlobalOption } from "@/context/GlobalOptionContext";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useAuthProvider } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import { canDeleteTask, canEditTask } from "@/types/hasPermission";
import useTheme from "@/hooks/useTheme";
import { format } from "date-fns";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

const TaskItem = ({
  task,
  subTasks,
  index,
  project,
  setTasks,
  tasks,
  setShowModal,
  showModal,
  showDeleteConfirm,
  smallAddTask,
  setShowDeleteConfirm,
  column,
  sections,
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
  showDeleteConfirm?: string | null;
  setShowDeleteConfirm?: Dispatch<SetStateAction<string | null>>;
  column?: {
    id: string;
    title: string;
    tasks: TaskType[];
    is_archived?: boolean;
  };
  sections?: SectionType[];
}) => {
  const [addTaskAboveBellow, setAddTaskAboveBellow] = useState<{
    position: "above" | "below";
    task: TaskType;
  } | null>(null);

  const { profile } = useAuthProvider();
  const { role } = useRole();
  const [firstImage, setFirstImage] = useState<string | null>(null);

  // useEffect(() => {
  //   if (task.description) {
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(task.description, "text/html");
  //     const firstImage = doc.querySelector("img");
  //     setFirstImage(firstImage?.src || null);
  //   }
  // }, [task]);

  const handleTaskDelete = async () => {
    if (!profile?.id) return;

    if (!task.is_inbox && task.project_id) {
      const userRole = role({ _project_id: task.project_id });
      const canEdit = userRole ? canDeleteTask(userRole) : false;

      if (!canEdit) return;
    }

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
  };

  const handleCheckClickDebounced = debounce(async () => {
    try {
      if (!profile?.id) return;

      if (!task.is_inbox && task.project_id) {
        const userRole = role({ _project_id: task.project_id });
        const canEdit = userRole ? canEditTask(userRole) : false;

        if (!canEdit) return;
      }

      // Update local tasks
      // setTasks(
      //   tasks.map((t) =>
      //     t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
      //   )
      // );

      const { error } = await supabaseBrowser
        .from("tasks")
        .update({
          is_completed: !task.is_completed,
        })
        .eq("id", task.id);

      if (error) {
        throw error;
      }

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.UPDATED_TASK,
        entity: {
          id: task.id,
          type: EntityType.TASK,
          name: task.title,
        },
        metadata: {
          old_data: task,
          new_data: {
            ...task,
            is_completed: !task.is_completed,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, 300);

  const [editTaskId, setEditTaskId] = useState<TaskType["id"] | null>(null);

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [style, setStyle] = useState({
    top: "auto",
    left: "auto",
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
          setShowModal={setShowModal}
        />
      ) : (
        <Draggable draggableId={task.id?.toString()} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="transition w-full group relative bg-background rounded-lg cursor-pointer overflow-hidden"
              onClick={() => {
                setShowModal && setShowModal(task.id.toString());
                window.history.pushState(
                  null,
                  "",
                  `${pathname}?task=${task.id}`
                );
              }}
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
            >
              {firstImage && (
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    src={firstImage}
                    alt="Task Image"
                    fill
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
              )}

              <div className={`p-2 w-full relative space-y-2`}>
                <div className="flex items-center gap-2 w-full">
                  <div>
                    <AnimatedCircleCheck
                      handleCheckSubmit={handleCheckClickDebounced}
                      priority={task.priority}
                      is_completed={task.is_completed}
                    />
                  </div>

                  <h1
                    className={`text-sm ${
                      task.is_completed ? "line-through text-text-500" : ""
                    } line-clamp-3`}
                  >
                    {task.title}
                  </h1>
                </div>

                {(subTasks.length > 0 ||
                  task.dates.start_date ||
                  task.dates.end_date ||
                  task.description ||
                  task.assignees.length > 0) && (
                  <div className="flex flex-wrap gap-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap text-[11px]">
                      {subTasks.length > 0 ? (
                        <div className="flex items-center gap-[2px] text-text-600">
                          <Workflow strokeWidth={1.5} className="w-3 h-3" />
                          <span>
                            {subTasks.filter((t) => t.is_completed).length}/
                            {subTasks.length}
                          </span>
                        </div>
                      ) : null}

                      {(task.dates.start_date || task.dates.end_date) && (
                        <div className="flex items-center gap-1 text-text-600">
                          <Clock strokeWidth={1.5} size={16} />
                          {task.dates.start_date && (
                            <div className="flex items-center gap-1">
                              <span>
                                {format(task.dates.start_date, "MMM dd")}
                              </span>
                            </div>
                          )}

                          {task.dates.start_date && task.dates.end_date && (
                            <div>-</div>
                          )}

                          {task.dates.end_date && (
                            <div className="flex items-center gap-1">
                              <span>
                                {format(task.dates.end_date, "MMM dd")}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {task.description && (
                        <div className="flex items-start gap-1 text-text-600">
                          <AlignLeft
                            strokeWidth={1.5}
                            className="w-4 h-4 min-w-4 min-h-4"
                          />
                          {/* <div
                      className="text-xs line-clamp-1"
                      dangerouslySetInnerHTML={{
                        __html: task.description,
                      }}
                    ></div> */}
                        </div>
                      )}
                    </div>

                    {task.assignees.length > 0 && (
                      <div className="flex items-center justify-end gap-2 flex-grow">
                        {task.assignees.map((assignee) => (
                          <Image
                            key={assignee.id}
                            src={assignee.avatar_url || "/default_avatar.png"}
                            width={20}
                            height={20}
                            alt={assignee.name || "assignee"}
                            title={assignee.name}
                            className="rounded-lg object-cover max-w-5 max-h-5"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

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
            </div>
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

export default TaskItem;
