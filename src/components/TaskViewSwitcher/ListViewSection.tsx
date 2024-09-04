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
  setTasks: Dispatch<SetStateAction<TaskType[]>>;
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

  const handleUpdateColumnTitle = async () => {
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
  };

  return (
    <div className="pt-2">
      <div className="flex items-center gap-1 border-b border-text-200 mx-8">
        <button
          className={`p-1 hover:bg-text-100 transition rounded-full ${
            !section.is_collapsed && "rotate-90"
          }`}
          onClick={() => toggleSection(section.id, !section.is_collapsed)}
        >
          <ChevronRightIcon className="w-4 h-4 text-text-700" />
        </button>

        <div className="flex items-center gap-4 h-7 group">
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
                className="font-bold rounded-full px-[6px] outline-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-primary-300 bg-transparent"
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
              !editColumnTitle && "opacity-0 group-hover:opacity-100"
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
      </div>

      {!section.is_collapsed && (
        <Droppable
          key={section.id}
          type="task"
          droppableId={section.id.toString()}
        >
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <ul>
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
                    <Fragment key={task.id}>
                      <li
                        tabIndex={0}
                        className={`flex items-center gap-3 cursor-pointer w-full h-10 ring-1 mt-[1px] ${
                          showTaskItemModal === task.id.toString()
                            ? "ring-primary-300 bg-primary-10"
                            : "ring-transparent"
                        }`}
                      >
                        <TaskItemForListView
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
                      </li>

                      {/* {(groupedTasks[section.id] || []).filter(
                        (t) => t.parent_task_id == task.id
                      ).length > 0 && (
                        <ul>
                          {(groupedTasks[section.id] || [])
                            .filter((t) => t.parent_task_id == task.id)
                            .map((childTask, childIndex) => (
                              <li
                                key={childTask.id}
                                className={`border-b border-text-200 flex items-center gap-3 cursor-pointer ${
                                  childTask.parent_task_id && "ml-8"
                                }`}
                              >
                                <TaskItemForListView
                                  task={childTask}
                                  setTasks={setTasks}
                                  subTasks={(
                                    groupedTasks[section.id] || []
                                  ).filter(
                                    (t) => t.parent_task_id == childTask.id
                                  )}
                                  showShareOption={showShareOption}
                                  setShowShareOption={setShowShareOption}
                                  index={childIndex}
                                  project={project}
                                  tasks={tasks}
                                />
                              </li>
                            ))}
                        </ul>
                      )} */}
                    </Fragment>
                  ))}

                {provided.placeholder}
              </ul>

              <SectionAddTask
                section={section}
                showAddTask={showAddTask}
                setShowAddTask={setShowAddTask}
                project={project}
                setTasks={setTasks}
                tasks={tasks}
              />
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default ListViewSection;
