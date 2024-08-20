import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Ellipsis } from "lucide-react";
import React, { Dispatch, LegacyRef, SetStateAction, useEffect, useState } from "react";
import TaskItem from "../TaskItem";
import SectionAddTask from "../SectionAddTask";
import AddNewSectionBoardView from "../AddNewSectionBoardView";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import { supabaseBrowser } from "@/utils/supabase/client";
import SectionMoreOptions from "../SectionMoreOptions";

const BoardViewColumn = ({
  column,
  columnIndex,
  setShowArchiveConfirm,
  setShowDeleteConfirm,
  showSectionMoreOptions,
  setShowSectionMoreOptions,
  project,
  setTasks,
  setShowShareOption,
  showShareOption,
  sections,
  setShowUngroupedAddSection,
  showAddTask,
  setShowAddTask,
  showUngroupedAddTask,
  setShowUngroupedAddTask,
  columns,
  setSections,
  tasks,
}: {
  column: {
    id: string;
    title: string;
    tasks: TaskType[];
    is_archived?: boolean;
  };
  columnIndex: number;
  setShowArchiveConfirm: Dispatch<
    SetStateAction<{
      id: string;
      title: string;
      tasks: TaskType[];
      is_archived?: boolean;
    } | null>
  >;
  setShowDeleteConfirm: Dispatch<
    SetStateAction<{
      id: string;
      title: string;
    } | null>
  >;
  tasks: TaskType[];
  showSectionMoreOptions: string | null;
  setShowSectionMoreOptions: Dispatch<SetStateAction<string | null>>;
  project: ProjectType | null;
  setTasks: (updatedTasks: TaskType[]) => void;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
  showShareOption?: boolean;
  sections: SectionType[];
  setShowUngroupedAddSection: Dispatch<SetStateAction<boolean>>;
  showAddTask: string | number | null;
  setShowAddTask: Dispatch<SetStateAction<string | number | null>>;
  showUngroupedAddTask: boolean;
  setShowUngroupedAddTask: Dispatch<SetStateAction<boolean>>;
  columns:
    | {
        id: string;
        title: string;
        tasks: TaskType[];
      }[]
    | undefined;
  setSections: (updatedSections: SectionType[]) => void;
}) => {
  const [editColumnTitle, setEditColumnTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  const [showTaskItemModal, setShowTaskItemModal] = useState<string | null>(
    null
  );
  const [showTaskDeleteConfirm, setShowTaskDeleteConfirm] = useState<
    string | null
  >(null);

  const handleUpdateColumnTitle = async () => {
    if (columnTitle.trim().length && columnTitle.trim() !== column.title) {
      setSections(
        sections.map((section) => {
          if (section.id === column.id) {
            return {
              ...section,
              name: columnTitle.trim(),
            };
          }
          return section;
        })
      );

      setEditColumnTitle(false);

      const { error } = await supabaseBrowser
        .from("sections")
        .update({ name: columnTitle.trim() })
        .eq("id", column.id);

      if (error) {
        console.log(error);
      }
    }

    setEditColumnTitle(false);
    setColumnTitle(column.title);
  };

  const [foundFixedDropdown, setFoundFixedDropdwon] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const fixedDropdown = document.getElementById("fixed_dropdown");
      setFoundFixedDropdwon(!!fixedDropdown);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const fixedDropdown = document.getElementById("fixed_dropdown");
    setFoundFixedDropdwon(!!fixedDropdown);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Draggable
        key={column.id?.toString()!}
        draggableId={column.id?.toString()!}
        index={columnIndex}
        isDragDisabled={
          (showTaskItemModal ? true : false) ||
          (showTaskDeleteConfirm ? true : false) ||
          (showAddTask ? true : false) ||
          showUngroupedAddTask
        }
      >
        {(boardDraggaleProvided) => (
          <div
            ref={boardDraggaleProvided.innerRef}
            {...boardDraggaleProvided.draggableProps}
            {...boardDraggaleProvided.dragHandleProps}
            className={`bg-gray-100 rounded-lg min-w-72 md:min-w-80 w-80 h-fit max-h-[93%] overflow-y-auto transition-colors cursor-default ${
              column.is_archived && "opacity-70"
            }`}
          >
            <div className={`flex justify-between ${!foundFixedDropdown && "sticky"} top-0 z-10 bg-gray-100 p-2 pb-1`}>
              {!editColumnTitle && (
                <div
                  className={`flex items-center gap-2 w-full ${
                    column.is_archived ? "" : "cursor-pointer"
                  }`}
                  onClick={() =>
                    !column.is_archived &&
                    column.id !== "ungrouped" &&
                    setEditColumnTitle(true)
                  }
                >
                  <h3 className="font-bold pl-[6px]">{column.title}</h3>
                  <p className="text-sm text-gray-600">{column.tasks.length}</p>
                </div>
              )}

              {editColumnTitle && (
                <input
                  value={columnTitle}
                  onChange={(ev) => setColumnTitle(ev.target.value)}
                  className="font-bold rounded-lg px-[6px] outline-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-indigo-300 w-full"
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

              <div>
                <SectionMoreOptions
                  key={column.id}
                  column={column}
                  setShowDeleteConfirm={setShowDeleteConfirm}
                  setEditColumnTitle={setEditColumnTitle}
                  setShowArchiveConfirm={setShowArchiveConfirm}
                />
              </div>
            </div>

            <Droppable droppableId={column.id} type="task">
              {(provided, snapshot) => (
                <div
                  key={column.id}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2 min-h-1 p-2 pt-1"
                >
                  {column.tasks
                    .filter((t) => !t.parent_task_id)
                    .sort((a, b) => {
                      // Sort by is_completed: false (incomplete) comes before true (completed)
                      if (a.is_completed !== b.is_completed) {
                        return a.is_completed ? 1 : -1;
                      }
                      // Then sort by order within each completion status
                      return a.order - b.order;
                    })
                    .map((task, taskIndex) => (
                      <>
                        <div
                          key={task.id}
                          className={`rounded shadow-sm hover:ring-2 hover:ring-indigo-300 transition ring-1 ring-gray-200`}
                        >
                          <TaskItem
                            key={task.id}
                            task={task}
                            setTasks={setTasks}
                            tasks={tasks}
                            subTasks={column.tasks.filter(
                              (t) => t.parent_task_id == task.id
                            )}
                            setShowShareOption={setShowShareOption}
                            showShareOption={showShareOption}
                            index={taskIndex}
                            project={project}
                            setShowDeleteConfirm={setShowTaskDeleteConfirm}
                            setShowModal={setShowTaskItemModal}
                            showModal={showTaskItemModal}
                            showDeleteConfirm={showTaskDeleteConfirm}
                            column={column}
                            smallAddTask
                          />
                        </div>
                      </>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {!column.is_archived && (
              <div className={`${!foundFixedDropdown && "sticky"} bottom-0 bg-gray-100 p-2`}>
                <SectionAddTask
                  section={
                    column.id === "ungrouped"
                      ? undefined
                      : sections.find((s) => s.id.toString() === column.id)
                  }
                  showAddTask={showAddTask}
                  setShowAddTask={setShowAddTask}
                  isSmall
                  showUngroupedAddTask={showUngroupedAddTask}
                  setShowUngroupedAddTask={setShowUngroupedAddTask}
                  project={project}
                  setTasks={setTasks}
                  tasks={tasks}
                />
              </div>
            )}
          </div>
        )}
      </Draggable>

      <AddNewSectionBoardView
        setShowUngroupedAddSection={setShowUngroupedAddSection}
        columnId={column.id}
        columns={columns}
        index={columnIndex}
        project={project}
        setSections={setSections}
        sections={sections}
      />
    </>
  );
};

export default BoardViewColumn;
