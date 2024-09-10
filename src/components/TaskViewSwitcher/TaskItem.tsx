import { ProjectType, TaskType } from "@/types/project";
import TaskItemModal from "./TaskItemModal";
import {
  Dispatch,
  LegacyRef,
  MouseEvent,
  SetStateAction,
  useState,
} from "react";
import TaskItemMoreDropdown from "./TaskItemMoreDropdown";
import { Draggable } from "@hello-pangea/dnd";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import { User, Workflow } from "lucide-react";
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
}) => {
  const [showMoreDropdown, setShowMoreDropdown] = useState<boolean>(false);
  const [addTaskAboveBellow, setAddTaskAboveBellow] = useState<{
    position: "above" | "below";
    task: TaskType;
  } | null>(null);

  const { setShowShareOption, showShareOption } = useGlobalOption();
  const { profile } = useAuthProvider();
  const {role} = useRole()

  const handleTaskDelete = async () => {
    if (!profile?.id) return;

    if (!task.is_inbox && task.project_id) {
      const userRole = role(task.project_id);
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
      entity_id: task.id,
      entity_type: EntityType.TASK,
      metadata: {
        old_data: task,
      },
    });
  };

  const handleCheckClickDebounced = debounce(async () => {
    try {
      if (!profile?.id) return;

      if (!task.is_inbox && task.project_id) {
        const userRole = role(task.project_id);
        const canEdit = userRole ? canEditTask(userRole) : false;
  
        if (!canEdit) return;
      }


      // Update local tasks
      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
        )
      );

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
        entity_id: task.id,
        entity_type: EntityType.TASK,
        metadata: {
          old_data: task,
          new_data: {
            ...task,
            is_completed: !task.is_completed,
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, 300);

  const [editTaskId, setEditTaskId] = useState<TaskType["id"] | null>(null);

  const dateInfo = getDateInfo(task.dates.end_date);

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
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="transition w-full"
            >
              <div
                className="flex items-start justify-between gap-2 taskitem_group bg-background p-1 pl-2 w-full rounded-lg cursor-pointer relative"
                onClick={() => setShowModal && setShowModal(task.id.toString())}
              >
                <div className="flex gap-2">
                  <div className="pt-1">
                    <AnimatedCircleCheck
                      handleCheckSubmit={handleCheckClickDebounced}
                      priority={task.priority}
                      is_completed={task.is_completed}
                    />
                  </div>

                  <div className="space-y-2 py-1 pr-1 flex-1">
                    <div className="space-y-[2px]">
                      <p
                        className={`text-sm ${
                          task.is_completed ? "line-through text-text-500" : ""
                        } line-clamp-3`}
                      >
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="text-xs text-text-500 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {(subTasks.length > 0 || dateInfo) && (
                      <div className="flex items-center gap-2">
                        {subTasks.length > 0 ? (
                          <div className="flex items-center gap-[2px] text-text-500">
                            <Workflow strokeWidth={1.5} className="w-3 h-3" />
                            <span className="text-xs">
                              {subTasks.filter((t) => t.is_completed).length}/
                              {subTasks.length}
                            </span>
                          </div>
                        ) : null}

                        {dateInfo && (
                          <div className="flex items-center gap-1 text-xs">
                            {dateInfo?.icon}
                            <span className={dateInfo?.color}>
                              {dateInfo?.label}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`flex items-center gap-[2px] taskitem_group_hover transition absolute top-1 right-1 bg-background ${
                    !showMoreDropdown ? "opacity-0" : ""
                  }`}
                >
                  <div
                    className="relative cursor-default"
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    <TaskItemMoreDropdown
                      setShowDeleteConfirm={setShowDeleteConfirm!}
                      setAddTaskAboveBellow={setAddTaskAboveBellow}
                      task={task}
                      column={column}
                      setEditTaskId={setEditTaskId}
                    />
                  </div>

                  <button
                    className="p-1 hover:bg-text-100 transition rounded-lg"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      typeof setShowShareOption == "function" &&
                        setShowShareOption(true);
                    }}
                  >
                    <User strokeWidth={1.5} className="w-5 h-5" />
                  </button>
                </div>
              </div>
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
          onClose={() => setShowModal(null)}
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
