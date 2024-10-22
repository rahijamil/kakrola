import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import {
  AtSignIcon,
  Bell,
  Ellipsis,
  MapPin,
  MapPinIcon,
  PanelRight,
  SendHorizonal,
  Tag,
  TagIcon,
  User,
  X,
} from "lucide-react";
import Priorities from "./Priorities";
import { useAuthProvider } from "@/context/AuthContext";
import Spinner from "../ui/Spinner";
import { supabaseBrowser } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import ProjectsSelector from "./ProjectsSelector";
import DateSelector from "./DateSelector";
import AssigneeSelector from "./AssigneeSelector";
import { TaskInput } from "./TaskInput";
import DescriptionInput from "./DescriptionInput";
import { getInitialTaskData } from "@/lib/getInitialTaskData";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useRole } from "@/context/RoleContext";
import { format } from "date-fns";
import useScreen from "@/hooks/useScreen";
import LabelSelector from "./LabelSelector";
import { PersonalRoleType } from "@/types/role";
import { canEditContent } from "@/utils/permissionUtils";
import StatusSelector from "./StatusSelector";

const AddTaskForm = ({
  onClose,
  isSmall,
  section_id,
  parentTaskIdForSubTask,
  project,
  addTaskAboveBellow,
  taskForEdit,
  biggerTitle,
  endDate,
  tasks,
  setTasks,
  setShowModal,
  forTaskModal,
}: {
  onClose: () => void;
  isSmall?: boolean;
  section_id?: SectionType["id"] | null;
  parentTaskIdForSubTask?: string | number;
  project: ProjectType | null;
  addTaskAboveBellow?: { position: "above" | "below"; task: TaskType } | null;
  taskForEdit?: TaskType;
  biggerTitle?: boolean;
  endDate?: Date | null;
  tasks?: TaskType[];
  setTasks?: (tasks: TaskType[]) => void;
  setShowModal?: Dispatch<SetStateAction<string | null>>;
  forTaskModal?: boolean;
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

  const { role } = useRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile?.id) return;

    if (!taskData.title) {
      return;
    }

    setLoading(true);
    setError(null);

    const isEditing = !!taskForEdit;
    let updatedTasks: TaskType[] = [];

    try {
      if (isEditing && taskData.project_id) {
        if (
          !canEditContent(
            role({
              project,
              page: null,
            }),
            !!project?.team_id
          )
        ) {
          console.error("User doesn't have permission");
          return;
        }

        if (tasks && setTasks) {
          // Optimistically update the task in the UI
          updatedTasks = tasks.map((t) =>
            t.id === taskData.id ? { ...t, ...taskData } : t
          );
          setTasks(updatedTasks);
        }
        setLoading(false);

        // Update the existing task in Supabase
        const { data, error } = await supabaseBrowser
          .from("tasks")
          .update(taskData)
          .eq("id", taskData.id)
          .select()
          .single();

        if (error) throw error;
        if (tasks) {
          // Ensure UI reflects any updates from the database
          updatedTasks = tasks.map((t) => (t.id === taskData.id ? data : t));

          createActivityLog({
            actor_id: profile.id,
            action: ActivityAction.CREATED_TASK,
            entity: {
              id: data.id,
              type: EntityType.TASK,
              name: taskData.title,
            },
            metadata: {
              new_data: data,
            },
          });
        }
      } else {
        // Create a temporary task with a UUID
        const newTask: TaskType = {
          ...taskData,
          id: uuidv4(), // temporary ID
          updated_at: new Date().toISOString(),
          parent_task_id: parentTaskIdForSubTask || null,
        };

        if (tasks && setTasks) {
          if (addTaskAboveBellow) {
            const { position, task: existingTask } = addTaskAboveBellow;
            const currentIndex = tasks.findIndex(
              (t) => t.id === existingTask.id
            );
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
        }
        // Reset form and close
        resetTaskData();

        if (!taskData.project_id) return;
        if (
          !canEditContent(
            role({
              project,
              page: null,
            }),
            !!project?.team_id
          )
        ) {
          console.error("User doesn't have permission");
          return;
        }

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

        createActivityLog({
          actor_id: profile.id,
          action: ActivityAction.CREATED_TASK,
          entity: {
            type: EntityType.TASK,
            id: data.id,
            name: taskData.title,
          },
          metadata: {
            new_data: data,
          },
        });
      }

      if (setTasks) {
        // Update state with new/updated tasks
        setTasks(updatedTasks);
      }
      setLoading(false);

      if (isEditing) {
        onClose();
      }
    } catch (error: any) {
      setError(error.message);

      if (setTasks && tasks) {
        // Revert the optimistic update on error
        setTasks(tasks); // Revert to the original state
      }
    } finally {
      setLoading(false);
    }
  };

  const { screenWidth } = useScreen();

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-2 p-2">
        <div>
          <TaskInput
            projects={projects}
            taskData={taskData}
            setTaskData={setTaskData}
            biggerTitle={biggerTitle}
            handleSubmit={handleSubmit}
            titleEditableRef={titleEditableRef}
          />

          {!taskForEdit && (
            <DescriptionInput taskData={taskData} setTaskData={setTaskData} />
          )}
        </div>

        <div className="flex items-center overflow-x-auto scrollbar-hide gap-2 whitespace-nowrap">
          <DateSelector
            task={taskData}
            setTask={setTaskData}
            endDate={endDate}
            isSmall={screenWidth <= 768 ? true : isSmall}
          />

          <AssigneeSelector
            task={taskData}
            setTask={setTaskData}
            isSmall={screenWidth <= 768 ? true : isSmall}
            project={project}
          />

          <Priorities
            taskData={taskData}
            setTaskData={setTaskData}
            isSmall={screenWidth <= 768 ? true : isSmall}
          />

          <StatusSelector
            taskData={taskData}
            setTaskData={setTaskData}
            isSmall={screenWidth <= 768 ? true : isSmall}
          />

          <LabelSelector
            task={taskData}
            setTask={setTaskData}
            isSmall={screenWidth <= 768 ? true : isSmall}
          />

          {taskForEdit && setShowModal && (
            <button
              onClick={() => {
                setShowModal && setShowModal(taskData.id.toString());
                onClose();
              }}
              className={`px-2 py-1 transition rounded-lg hover:bg-text-100 items-center gap-1 text-text-500 flex`}
            >
              <PanelRight strokeWidth={1.5} className="w-4 h-4" />
              <span className="text-[11px] uppercase font-medium">Open</span>
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-text-100">
        {error && (
          <p className="text-red-500 pt-3 text-center text-xs">{error}</p>
        )}

        <div className="flex items-center justify-between gap-2 p-2 whitespace-nowrap">
          {!forTaskModal && (
            <ProjectsSelector
              setTask={setTaskData}
              task={taskData}
              isInbox
              isSmall={isSmall}
            />
          )}

          <div className="flex flex-1 justify-end gap-2 select-none">
            {screenWidth > 768 && (
              <button
                type="button"
                onClick={() => {
                  resetTaskData();
                  onClose();
                }}
                className="px-3 py-[6px] text-[13px] text-text-600 transition bg-text-100 hover:bg-text-100 rounded-lg"
                disabled={loading}
              >
                {isSmall ? (
                  <X strokeWidth={1.5} className="w-5 h-5" />
                ) : (
                  "Cancel"
                )}
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-[6px] text-[13px] text-surface bg-primary-500 rounded-lg hover:bg-primary-700 disabled:bg-primary-600 disabled:cursor-not-allowed transition disabled:opacity-50"
              disabled={!taskData.title.trim() || loading}
            >
              {loading ? (
                <>
                  {isSmall || screenWidth <= 768 ? (
                    <Spinner color="white" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Spinner color="white" />
                      <span>Adding...</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {isSmall || screenWidth <= 768 ? (
                    <SendHorizonal strokeWidth={1.5} className="w-5 h-5" />
                  ) : (
                    "Add task"
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;
