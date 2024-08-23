import { ProjectType, SectionType, TaskType } from "@/types/project";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ChevronRightIcon, MoreHorizontal } from "lucide-react";
import { Dispatch, Fragment, LegacyRef, SetStateAction, useState } from "react";
import SectionMoreOptions from "./SectionMoreOptions";
import { Droppable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";
import SectionAddTask from "./SectionAddTask";

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
  showShareOption,
  setShowShareOption,
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
  setTasks: (updatedTasks: TaskType[]) => void;
  tasks: TaskType[];
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
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
    <div>
      <div className="flex items-center gap-1 py-2">
        <button
          className={`p-1 hover:bg-gray-100 transition rounded-lg ${
            !section.is_collapsed && "rotate-90"
          }`}
          onClick={() => toggleSection(section.id, !section.is_collapsed)}
        >
          <ChevronRightIcon className="w-4 h-4 text-gray-700" />
        </button>

        <div className="flex items-center justify-between gap-8 border-b border-gray-200 w-full">
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
                className="font-bold rounded-lg px-[6px] outline-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-indigo-300"
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
              <p className="text-sm text-gray-600">
                {(groupedTasks[section.id] || []).length}
              </p>
            )}
          </div>

          <div className="relative">
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
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="pl-6"
            >
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
                        className={`border-b border-gray-200 p-1 pl-0 flex items-center gap-3 cursor-pointer ${
                          task.parent_task_id && "ml-8"
                        }`}
                      >
                        <TaskItem
                          task={task}
                          setTasks={setTasks}
                          subTasks={(groupedTasks[section.id] || []).filter(
                            (t) => t.parent_task_id == task.id
                          )}
                          showShareOption={showShareOption}
                          setShowShareOption={setShowShareOption}
                          index={index}
                          project={project}
                          tasks={tasks}
                          setShowModal={setShowTaskItemModal}
                          showModal={showTaskItemModal}
                          showDeleteConfirm={showTaskDeleteConfirm}
                          setShowDeleteConfirm={setShowTaskDeleteConfirm}
                        />
                      </li>

                      {(groupedTasks[section.id] || []).filter(
                        (t) => t.parent_task_id == task.id
                      ).length > 0 && (
                        <ul>
                          {(groupedTasks[section.id] || [])
                            .filter((t) => t.parent_task_id == task.id)
                            .map((childTask, childIndex) => (
                              <li
                                key={childTask.id}
                                className={`border-b border-gray-200 p-1 pl-0 flex items-center gap-3 cursor-pointer ${
                                  childTask.parent_task_id && "ml-8"
                                }`}
                              >
                                <TaskItem
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
                      )}
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
