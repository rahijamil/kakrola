import { ProjectType, TaskType } from "@/types/project";
import TaskItemModal from "../TaskItemModal";
import { Dispatch, SetStateAction, useState } from "react";
import TaskItemMoreDropdown from "../TaskItemMoreDropdown";
import { Draggable } from "@hello-pangea/dnd";
import ConfirmAlert from "../../AlertBox/ConfirmAlert";
import { ChevronRight, Workflow } from "lucide-react";
import { supabaseBrowser } from "@/utils/supabase/client";
import AddTask from "../../AddTask";
import { debounce } from "lodash";
import { getDateInfo } from "@/utils/getDateInfo";
import AnimatedCircleCheck from "../AnimatedCircleCheck";
import DueDateSelector from "@/components/AddTask/DueDateSelector";
import AssigneeSelector from "@/components/AddTask/AssigneeSelector";
import Priorities from "@/components/AddTask/Priorities";

const TaskItemForListView = ({
  task,
  subTasks,
  showShareOption,
  setShowShareOption,
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
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
  index: number;
  project: ProjectType | null;
  setTasks: (updatedTasks: TaskType[]) => void;
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

  const [taskData, setTaskData] = useState<TaskType>(task);

  const handleTaskDelete = async () => {
    const updatedTasks = tasks.filter((t) => t.id !== task.id);

    setTasks(updatedTasks);

    const { error } = await supabaseBrowser
      .from("tasks")
      .delete()
      .eq("id", task.id);

    if (error) {
      console.log(error);
    }
  };

  const handleCheckClickDebounced = debounce(async () => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }, 300);

  const [editTaskId, setEditTaskId] = useState<TaskType["id"] | null>(null);

  const dateInfo = getDateInfo(task.due_date);

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
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div className="group border-b border-text-200 mx-8 px-8 bg-transparent cursor-pointer flex items-center justify-between h-10">
                <div className="flex-1 flex items-center divide-x divide-text-200">
                  <div className="w-full max-w-[600px] flex items-center justify-between gap-4 group">
                    <div className="flex items-center gap-2 w-full">
                      <AnimatedCircleCheck
                        handleCheckSubmit={handleCheckClickDebounced}
                        priority={task.priority}
                        is_completed={task.is_completed}
                      />
                      <div
                        className="flex items-center gap-2 w-full"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setShowModal && setShowModal(task.id.toString());
                        }}
                      >
                        {!editTaskTitle ? (
                          <h2
                            onClick={(ev) => {
                              setEditTaskTitle(true);
                            }}
                            className={`${
                              task.is_completed
                                ? "line-through text-text-500"
                                : ""
                            } line-clamp-1 cursor-text h-10 flex items-center justify-center`}
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
                            className="outline-none w-full bg-surface rounded-full px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-primary-300 h-7"
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
                            className="flex items-center gap-[2px] text-text-500 hover:bg-text-100 rounded-2xl transition hover:text-text-700 p-0.5 px-1"
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
                        className={`p-1 transition rounded-full hover:bg-text-100 ${
                          !editTaskTitle && "hidden group-hover:block"
                        }`}
                      >
                        <ChevronRight strokeWidth={1.5} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="min-w-32">
                    <AssigneeSelector
                      task={taskData}
                      setTask={setTaskData}
                      forListView
                    />
                  </div>
                  <div className="min-w-32">
                    <div onClick={(ev) => ev.stopPropagation()}>
                      <DueDateSelector
                        task={taskData}
                        setTask={setTaskData}
                        forListView
                      />
                    </div>
                  </div>
                  <div className="min-w-32">
                    <Priorities
                      taskData={taskData}
                      setTaskData={setTaskData}
                      forListView
                    />
                  </div>
                  {/* <div className="min-w-32">
                    Status
                  </div> */}
                </div>

                <TaskItemMoreDropdown
                  setShowDeleteConfirm={setShowDeleteConfirm!}
                  setAddTaskAboveBellow={setAddTaskAboveBellow}
                  task={task}
                  column={column}
                  setEditTaskId={setEditTaskId}
                />
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

export default TaskItemForListView;
