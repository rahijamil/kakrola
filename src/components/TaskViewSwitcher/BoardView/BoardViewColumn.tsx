import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Ellipsis, FoldHorizontal, UnfoldHorizontal } from "lucide-react";
import React, {
  Dispatch,
  LegacyRef,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import TaskItem from "../TaskItem";
import SectionAddTask from "../SectionAddTask";
import AddNewSectionBoardView from "../AddNewSectionBoardView";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import { supabaseBrowser } from "@/utils/supabase/client";
import SectionMoreOptions from "../SectionMoreOptions";
import useTheme from "@/hooks/useTheme";
import useFoundFixedDropdown from "@/hooks/useFoundFixedDropdown";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useAuthProvider } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import { usePathname, useSearchParams } from "next/navigation";
import { ThemeMode } from "@/lib/theme.types";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { PermissionName } from "@/types/role";
import withPermission from "@/utils/withPermission";
import { canCreateContent } from "@/utils/permissionUtils";

const BoardViewColumn = ({
  column,
  columnIndex,
  setShowArchiveConfirm,
  setShowDeleteConfirm,
  project,
  setTasks,
  sections,
  setShowUngroupedAddSection,
  showAddTask,
  setShowAddTask,
  showUngroupedAddTask,
  setShowUngroupedAddTask,
  columns,
  setSections,
  tasks,
  setIndex,
  setColumnId,
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
  setIndex?: Dispatch<SetStateAction<number>>;
  setColumnId?: Dispatch<SetStateAction<any>>;
  tasks: TaskType[];
  project: ProjectType | null;
  setTasks: (tasks: TaskType[]) => void;
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
  const [collapseColumn, setCollapseColumn] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  const [showTaskItemModal, setShowTaskItemModal] = useState<string | null>(
    null
  );
  const [showTaskDeleteConfirm, setShowTaskDeleteConfirm] = useState<
    string | null
  >(null);
  const { profile } = useAuthProvider();
  const { role } = useRole();

  useEffect(() => {
    if (setIndex && setColumnId) {
      setIndex(columnIndex);
      setColumnId(column.id);
    }
  }, [columnIndex, setIndex, sections]);

  const handleUpdateColumnTitle = async () => {
    if (!profile?.id) return;

    const findSection = sections.find((s) => s.id == column.id);

    if (!findSection?.is_inbox && findSection?.project_id) {
      if (
        !canCreateContent(
          role({
            project,
            page: null,
          }),
          !!project?.team_id
        )
      ) {
        console.error("User doesn't have permission to create a section");
        return;
      }
    }

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

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.UPDATED_SECTION,
        entity: {
          id: column.id,
          type: EntityType.SECTION,
          name: columnTitle.trim(),
        },
        metadata: {
          old_data: column,
          new_data: {
            ...column,
            name: columnTitle.trim(),
          },
        },
      });
    }

    setEditColumnTitle(false);
    setColumnTitle(column.title);
  };

  const { foundFixedDropdown } = useFoundFixedDropdown();

  const { themeMode } = useTheme();

  const sectionColor = sections.find((s) => s.id == column.id)?.color || "gray";

  // Tailwind doesn't generate all color classes by default, so we need to explicitly define them
  const bgColorClass =
    themeMode == ThemeMode.DARK
      ? `${sectionColor == "gray" ? `bg-surface` : `bg-${sectionColor}-500/20`}`
      : `bg-${sectionColor}-25`;
  const hoverBgColorClass =
    themeMode == ThemeMode.DARK
      ? `hover:bg-${sectionColor}-800`
      : `hover:bg-${sectionColor}-200`;

  const searchParams = useSearchParams();
  const searchTask = searchParams.get("task");

  useEffect(() => {
    if (searchTask) {
      setShowTaskItemModal(searchTask);
    } else {
      setShowTaskItemModal(null);
    }
  }, [searchTask]);

  const AddNewSection = withPermission(AddNewSectionBoardView, {
    permissionName: project?.team_id
      ? PermissionName.CREATE_TEAM_CONTENT
      : PermissionName.CREATE_PERSONAL_CONTENT,
    project: project,
    page: null,
  });

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
          <>
            {collapseColumn ? (
              <div
                ref={boardDraggaleProvided.innerRef}
                {...boardDraggaleProvided.draggableProps}
                {...boardDraggaleProvided.dragHandleProps}
                onClick={() => setCollapseColumn(false)}
                className={`${bgColorClass} ${hoverBgColorClass} flex flex-col py-4 px-2 h-fit items-center justify-center gap-4 rounded-lg hover:transition-colors cursor-pointer ${
                  column.is_archived && "opacity-70"
                }`}
              >
                <button className={`p-1 pointer-events-none`}>
                  <UnfoldHorizontal
                    strokeWidth={1.5}
                    className="w-5 h-5 text-text-700"
                  />
                </button>

                <h3 className="font-bold vertical-text">{column.title}</h3>

                <p className="text-sm text-text-600 vertical-text">
                  {column.tasks.length}
                </p>
              </div>
            ) : (
              <div
                ref={boardDraggaleProvided.innerRef}
                {...boardDraggaleProvided.draggableProps}
                {...boardDraggaleProvided.dragHandleProps}
              >
                <Droppable droppableId={column.id} type="task" key={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-lg w-[calc(100vw-50px)] min-w-[calc(100vw-50px)] md:w-[300px] md:min-w-[300px] cursor-default flex flex-col h-full ${bgColorClass} ${
                        column.is_archived && "opacity-70"
                      }`}
                    >
                      <div className={`flex justify-between p-2 pb-1`}>
                        {!editColumnTitle && (
                          <div
                            className={`flex items-center gap-2 w-full ${
                              column.is_archived
                                ? ""
                                : column.id !== "ungrouped" && "cursor-pointer"
                            }`}
                            onClick={() =>
                              !column.is_archived &&
                              column.id !== "ungrouped" &&
                              setEditColumnTitle(true)
                            }
                          >
                            <h3 className="font-bold pl-[6px]">
                              {column.title}
                            </h3>
                            <p className="text-sm text-text-600">
                              {column.tasks.length}
                            </p>
                          </div>
                        )}

                        {editColumnTitle && (
                          <input
                            value={columnTitle}
                            onChange={(ev) => setColumnTitle(ev.target.value)}
                            className="font-bold rounded-lg px-[6px] outline-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-primary-300 w-full bg-transparent"
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

                        <div className="flex items-center">
                          <button
                            className={`p-1 hover:transition rounded-lg ${hoverBgColorClass}`}
                            onClick={() => setCollapseColumn(true)}
                          >
                            <FoldHorizontal
                              strokeWidth={1.5}
                              className="w-5 h-5 text-text-700"
                            />
                          </button>

                          {column.id !== "ungrouped" && (
                            <SectionMoreOptions
                              key={column.id}
                              column={column}
                              setShowDeleteConfirm={setShowDeleteConfirm}
                              setEditColumnTitle={setEditColumnTitle}
                              setShowArchiveConfirm={setShowArchiveConfirm}
                              setSections={setSections}
                              sections={sections}
                            />
                          )}
                        </div>
                      </div>

                      <div
                        className={`space-y-2 px-2 py-1 overflow-auto w-full`}
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
                                className={`rounded-lg hover:ring-2 hover:ring-primary-300 hover:transition ring-1 ring-text-200`}
                              >
                                <TaskItem
                                  key={task.id}
                                  task={task}
                                  setTasks={setTasks}
                                  tasks={tasks}
                                  subTasks={column.tasks.filter(
                                    (t) => t.parent_task_id == task.id
                                  )}
                                  sections={sections}
                                  index={taskIndex}
                                  project={project}
                                  setShowDeleteConfirm={
                                    setShowTaskDeleteConfirm
                                  }
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

                      {!column.is_archived && (
                        <div className="p-2 pt-0">
                          <SectionAddTask
                            section={
                              column.id === "ungrouped"
                                ? undefined
                                : sections.find(
                                    (s) => s.id.toString() === column.id
                                  )
                            }
                            showAddTask={showAddTask}
                            setShowAddTask={setShowAddTask}
                            isSmall
                            showUngroupedAddTask={showUngroupedAddTask}
                            setShowUngroupedAddTask={setShowUngroupedAddTask}
                            project={project}
                            setTasks={setTasks}
                            tasks={tasks}
                            view={"Board"}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            )}
          </>
        )}
      </Draggable>

      {columns && columns?.length - 1 != columnIndex && (
        <AddNewSection
          setShowUngroupedAddSection={setShowUngroupedAddSection}
          columnId={column.id}
          columns={columns}
          index={columnIndex}
          project={project}
          setSections={setSections}
          sections={sections}
        />
      )}
    </>
  );
};

export default BoardViewColumn;
