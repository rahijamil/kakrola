import { ProjectType, SectionType, TaskType } from "@/types/project";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ChevronRightIcon, MoreHorizontal } from "lucide-react";
import {
  Dispatch,
  Fragment,
  LegacyRef,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import SectionMoreOptions from "./SectionMoreOptions";
import { Droppable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";
import SectionAddTask from "./SectionAddTask";
import TaskItemForListView from "./ListView/TaskItemForListView";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useAuthProvider } from "@/context/AuthContext";
import useFoundFixedDropdown from "@/hooks/useFoundFixedDropdown";
import useScreen from "@/hooks/useScreen";

const ListViewSection = ({
  section,
  sections,
  setSections,
  toggleSection,
  groupedTasks,
  showSectionMoreOptions,
  setShowSectionMoreOptions,
  setShowDeleteConfirm,
  setShowArchiveConfirm,
  setTasks,
  project,
  tasks,
  showAddTask,
  setShowAddTask,
  showTaskItemModal,
  setShowTaskItemModal,
}: {
  section: SectionType;
  sections: SectionType[];
  setSections: (updatedSections: SectionType[]) => void;
  toggleSection: (
    section_id: string | number,
    is_collapsed: boolean
  ) => Promise<void>;
  groupedTasks: Record<string, TaskType[]>;
  showSectionMoreOptions: SectionType | null;
  setShowSectionMoreOptions: Dispatch<SetStateAction<SectionType | null>>;
  setShowDeleteConfirm: Dispatch<
    SetStateAction<{
      id: string;
      title: string;
    } | null>
  >;
  setShowArchiveConfirm: Dispatch<
    SetStateAction<{
      id: string;
      title: string;
      tasks: TaskType[];
      is_archived?: boolean;
    } | null>
  >;
  setTasks: (tasks: TaskType[]) => void;
  tasks: TaskType[];
  project: ProjectType | null;
  showAddTask: string | number | null;
  setShowAddTask: Dispatch<SetStateAction<string | number | null>>;
  showTaskItemModal: string | null;
  setShowTaskItemModal: Dispatch<SetStateAction<string | null>>;
}) => {
  const [editColumnTitle, setEditColumnTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(section.name);

  const [showTaskDeleteConfirm, setShowTaskDeleteConfirm] = useState<
    string | null
  >(null);

  const { profile } = useAuthProvider();

  const handleUpdateColumnTitle = async () => {
    if (!profile?.id) return;
    if (columnTitle.trim().length && columnTitle.trim() !== section.name) {
      setSections(
        sections.map((s) => {
          if (s.id === section.id) {
            return {
              ...s,
              name: columnTitle.trim(),
            };
          }
          return s;
        })
      );

      setEditColumnTitle(false);

      const { error } = await supabaseBrowser
        .from("sections")
        .update({ name: columnTitle.trim() })
        .eq("id", section.id);

      if (error) {
        console.log(error);
      }
    }

    setEditColumnTitle(false);
    setColumnTitle(section.name);

    createActivityLog({
      actor_id: profile.id,
      action: ActivityAction.UPDATED_SECTION,
      entity: {
        id: section.id,
        type: EntityType.SECTION,
        name: section.name,
      },
      metadata: {
        old_data: section,
        new_data: {
          ...section,
          name: columnTitle.trim(),
        },
      },
    });
  };

  const { foundFixedDropdown } = useFoundFixedDropdown();
  const { screenWidth } = useScreen();

  return (
    <>
      <tr className="border-b border-text-100 block pt-2">
        <td
          onTouchStart={(ev) => ev.currentTarget.classList.add("bg-text-100")}
          onTouchEnd={(ev) => ev.currentTarget.classList.remove("bg-text-100")}
          colSpan={5}
          className={`flex items-center gap-1 w-[100vw] md:w-full px-2 md:px-0 transition ${
            !foundFixedDropdown && "sticky"
          } md:static left-0`}
          onClick={() =>
            screenWidth <= 768 &&
            toggleSection(section.id, !section.is_collapsed)
          }
        >
          <button
            className={`p-1 hover:bg-text-100 transition rounded-lg ${
              !section.is_collapsed && "rotate-90"
            }`}
            onClick={() => toggleSection(section.id, !section.is_collapsed)}
          >
            <ChevronRightIcon className="w-4 h-4 text-text-700" />
          </button>

          <div className="flex items-center gap-4 h-7 group justify-between md:justify-start w-full">
            <div className="flex items-center gap-2">
              {!editColumnTitle ? (
                <h3
                  className="font-bold cursor-pointer"
                  onClick={() => setEditColumnTitle(true)}
                >
                  {section.name}
                </h3>
              ) : (
                <input
                  value={columnTitle}
                  onChange={(ev) => setColumnTitle(ev.target.value)}
                  className="font-bold rounded-lg px-[6px] outline-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-primary-300 bg-transparent"
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter") {
                      handleUpdateColumnTitle();
                    }
                  }}
                  onBlur={handleUpdateColumnTitle}
                  autoFocus
                  onFocus={(ev) => ev.target.select()}
                />
              )}

              {(groupedTasks[section.id] || []).length > 0 && (
                <p className="text-sm text-text-600">
                  {(groupedTasks[section.id] || []).length}
                </p>
              )}
            </div>

            <div
              className={`${
                !editColumnTitle && "md:opacity-0 md:group-hover:opacity-100"
              }`}
            >
              <SectionMoreOptions
                column={{
                  id: section.id.toString(),
                  title: section.name,
                  tasks: groupedTasks[section.id] || [],
                  is_archived: section.is_archived,
                }}
                setShowDeleteConfirm={setShowDeleteConfirm}
                setEditColumnTitle={setEditColumnTitle}
                setShowArchiveConfirm={setShowArchiveConfirm}
                sections={sections}
                setSections={setSections}
              />
            </div>
          </div>
        </td>
      </tr>

      {!section.is_collapsed && (
        <Droppable
          key={section.id}
          type="task"
          droppableId={section.id.toString()}
          direction="vertical"
        >
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {(groupedTasks[section.id] || [])
                .filter((t) => !t.parent_task_id)
                .sort((a, b) => {
                  // Sort by is_completed: false (incomplete) comes before true (completed)
                  if (a.is_completed !== b.is_completed) {
                    return a.is_completed ? 1 : -1;
                  }
                  // Then sort by order within each completion status
                  return a.order - b.order;
                })
                .map((task, index) => (
                  <TaskItemForListView
                    key={task.id}
                    task={task}
                    setTasks={setTasks}
                    subTasks={(groupedTasks[section.id] || []).filter(
                      (t) => t.parent_task_id == task.id
                    )}
                    index={index}
                    project={project}
                    tasks={tasks}
                    setShowModal={setShowTaskItemModal}
                    showModal={showTaskItemModal}
                    showDeleteConfirm={showTaskDeleteConfirm}
                    setShowDeleteConfirm={setShowTaskDeleteConfirm}
                    setShowAddTask={setShowAddTask}
                  />
                ))}

              {provided.placeholder}

              {screenWidth > 768 && (
                <SectionAddTask
                  section={section}
                  showAddTask={showAddTask}
                  setShowAddTask={setShowAddTask}
                  project={project}
                  setTasks={setTasks}
                  tasks={tasks}
                  view={"List"}
                />
              )}
            </div>
          )}
        </Droppable>
      )}
    </>
  );
};

export default ListViewSection;
