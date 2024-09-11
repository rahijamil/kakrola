import { ProjectType, TaskType } from "@/types/project";
import TaskItemModal from "../TaskItemModal";
import { Dispatch, SetStateAction, useState } from "react";
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
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useRole } from "@/context/RoleContext";
import { canDeleteTask, canEditTask } from "@/types/hasPermission";
import useCheckClick from "@/hooks/useCheckClick";

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
  const { handleCheckClickDebounced } = useCheckClick({ task, tasks, setTasks });

  const handleTaskDelete = async () => {
    if (!profile?.id) return;

    if (!task.is_inbox && task.project_id) {
      const userRole = role(task.project_id);

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
        entity_id: task.id,
        entity_type: EntityType.TASK,
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
        entity_id: task.id,
        entity_type: EntityType.TASK,
        metadata: {
          old_data: task,
        },
      });
    }
  };

  const [editTaskId, setEditTaskId] = useState<TaskType["id"] | null>(null);

  const [editTaskTitle, setEditTaskTitle] = useState(false);

  const handleUpdateTaskTitle = () => {
    setEditTaskTitle(false);
  };

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
            <tr
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`group border-b border-text-200 cursor-pointer flex items-center justify-between h-10 ring-1 divide-x divide-text-200 relative ${
                showModal === task.id.toString()
                  ? "ring-primary-300 bg-primary-10"
                  : "ring-transparent bg-transparent"
              }`}
            >
              <>
                <td
                  className={`w-[40%] pl-8 flex items-center justify-between gap-4 group ring-1 ring-transparent h-10 ${
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
                          className="outline-none w-full bg-surface rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-primary-300 h-7"
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
                      onClick={() =>
                        setShowModal && setShowModal(task.id.toString())
                      }
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
              </>

              <TaskItemMoreDropdown
                setShowDeleteConfirm={setShowDeleteConfirm!}
                setAddTaskAboveBellow={setAddTaskAboveBellow}
                task={task}
                column={column}
                setEditTaskId={setEditTaskId}
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

export default TaskItemForListView;
