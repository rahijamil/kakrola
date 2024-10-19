import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import AddNewSectionBoardView from "../AddNewSectionBoardView";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { supabaseBrowser } from "@/utils/supabase/client";
import BoardViewColumn from "./BoardViewColumn";
import ConfirmAlert from "@/components/AlertBox/ConfirmAlert";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useAuthProvider } from "@/context/AuthContext";
import useTheme from "@/hooks/useTheme";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQueryClient } from "@tanstack/react-query";
import withPermission from "@/utils/withPermission";
import { PermissionName } from "@/types/role";

const BoardView: React.FC<{
  tasks: TaskType[];
  sections: SectionType[];
  setSections: (updatedSections: SectionType[]) => void;
  groupedTasks: Record<string, TaskType[]>;
  unGroupedTasks: TaskType[];
  showAddTask: string | number | null;
  setShowAddTask: React.Dispatch<React.SetStateAction<string | number | null>>;
  showUngroupedAddTask: boolean;
  setShowUngroupedAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  showUngroupedAddSection: boolean;
  setShowUngroupedAddSection: React.Dispatch<React.SetStateAction<boolean>>;
  project: ProjectType | null;
  setTasks: (tasks: TaskType[]) => void;
  isLoading: boolean;
}> = ({
  tasks,
  sections,
  setSections,
  groupedTasks,
  unGroupedTasks,
  showAddTask,
  setShowAddTask,
  showUngroupedAddTask,
  setShowUngroupedAddTask,
  showUngroupedAddSection,
  setShowUngroupedAddSection,
  project,
  setTasks,
  isLoading,
}) => {
  const { profile } = useAuthProvider();
  const queryClient = useQueryClient();

  const columns = useMemo(() => {
    const columnsObj: Record<
      string,
      { id: string; title: string; tasks: TaskType[]; is_archived?: boolean }
    > = {
      ungrouped: {
        id: "ungrouped",
        title: "(No section)",
        tasks: unGroupedTasks,
      },
      ...sections.reduce(
        (acc, section) => ({
          ...acc,
          [section.id]: {
            id: section.id.toString(),
            title: section.name,
            tasks: groupedTasks[section.id] || [],
            is_archived: section.is_archived,
          },
        }),
        {}
      ),
    };

    const orderedColumns =
      unGroupedTasks.length > 0
        ? [
            columnsObj.ungrouped,
            ...sections.map((section) => columnsObj[section.id]),
          ]
        : [...sections.map((section) => columnsObj[section.id])];

    return orderedColumns;
  }, [sections, groupedTasks, unGroupedTasks]);

  useEffect(() => {
    setShowUngroupedAddSection(columns.length < 1);
  }, [columns.length, setShowUngroupedAddSection]);

  const onDragEnd = async (result: DropResult) => {
    if (!profile?.id || !project?.id) {
      return;
    }

    const { source, destination, type, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumns = Array.from(columns);
      const [reorderedColumn] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, reorderedColumn);

      // Update sections order
      const newSections: SectionType[] = newColumns
        .filter((col) => col.id !== "ungrouped")
        .map((col, index) => ({
          ...sections.find((s) => s.id.toString() === col.id)!,
          order: index,
        }));

      setSections(newSections);

      // Update sections order in the database
      try {
        for (const section of newSections) {
          const { error } = await supabaseBrowser
            .from("sections")
            .update({ order: section.order })
            .eq("id", section.id);

          if (error) throw error;

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
                order: section.order,
              },
            },
          });
        }
      } catch (error) {
        console.error("Error updating section order:", error);
      }

      return;
    }

    if (type === "task") {
      const newSectionId =
        destination.droppableId !== "ungrouped"
          ? parseInt(destination.droppableId)
          : null;
      const sourceSectionId =
        source.droppableId !== "ungrouped"
          ? parseInt(source.droppableId)
          : null;

      queryClient.setQueryData(
        ["projectDetails", project.id],
        (
          oldData: { sections: SectionType[]; tasks: TaskType[] } | undefined
        ) => {
          if (!oldData) return oldData;

          let updatedTasks = [...oldData.tasks];
          const movedTaskIndex = updatedTasks.findIndex(
            (t) => t.id.toString() === draggableId
          );

          if (movedTaskIndex === -1) return oldData;

          const [movedTask] = updatedTasks.splice(movedTaskIndex, 1);
          const updatedMovedTask = { ...movedTask, section_id: newSectionId };

          // Reorder tasks in the source section
          if (sourceSectionId !== null) {
            updatedTasks = updatedTasks.map((task) => {
              if (
                task.section_id === sourceSectionId &&
                task.order > movedTask.order
              ) {
                return { ...task, order: task.order - 1 };
              }
              return task;
            });
          }

          // Insert the moved task and update orders in the destination section
          const tasksInDestSection = updatedTasks.filter(
            (t) => t.section_id === newSectionId
          );
          tasksInDestSection.splice(destination.index, 0, updatedMovedTask);

          const updatedDestTasks = tasksInDestSection.map((task, index) => ({
            ...task,
            order: index,
          }));

          // Merge the updated destination tasks back into the main array
          updatedTasks = updatedTasks
            .filter((t) => t.section_id !== newSectionId)
            .concat(updatedDestTasks);

          return { ...oldData, tasks: updatedTasks };
        }
      );

      // Update tasks in the database
      try {
        const tasksToUpdate = queryClient
          .getQueryData<{ tasks: TaskType[] }>(["projectDetails", project.id])
          ?.tasks.filter(
            (t) =>
              t.section_id === newSectionId || t.section_id === sourceSectionId
          );

        if (tasksToUpdate) {
          const { data, error } = await supabaseBrowser.from("tasks").upsert(
            tasksToUpdate.map((task) => ({
              ...task,
              section_id: task.section_id,
              order: task.order,
              updated_at: new Date().toISOString(),
            }))
          );

          if (error) throw error;
        }
      } catch (error) {
        console.error("Error updating tasks:", error);
        // Optionally, invalidate the query to refetch the correct data
        queryClient.invalidateQueries({
          queryKey: ["projectDetails", project.id],
        });
      }
    }
  };

  const handleSectionDelete = async (
    section: { id: number; name: string } | null
  ) => {
    if (!profile?.id) return;

    if (section) {
      // first update localstate
      setTasks(tasks.filter((task) => task.section_id !== section.id));

      setSections(sections.filter((s) => s.id !== section.id));

      setShowDeleteConfirm(null);

      // delete the section
      const { error: sectionError } = await supabaseBrowser
        .from("sections")
        .delete()
        .eq("id", section.id);
      if (sectionError) {
        console.error(sectionError);
      }

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.DELETED_SECTION,
        entity: {
          id: section.id,
          type: EntityType.SECTION,
          name: section.name,
        },
        metadata: {
          old_data: section,
        },
      });
    } else {
      // update localstate
      setTasks(tasks.filter((task) => task.section_id !== null));
      setShowDeleteConfirm(null);

      // delete all tasks in null sections
      const { error } = await supabaseBrowser
        .from("tasks")
        .delete()
        .is("section_id", null);
      if (error) {
        console.error(error);
        return;
      }
    }
  };

  const handleSectionArchive = async (
    section: { id: number; name: string } | null
  ) => {
    if (!profile?.id) return;

    if (section) {
      if (showArchiveConfirm?.is_archived) {
        setSections(
          sections.map((s) =>
            s.id === section.id ? { ...s, is_archived: false } : s
          )
        );

        setShowArchiveConfirm(null);

        // unarchive the section
        const { error: sectionError } = await supabaseBrowser
          .from("sections")
          .update({ is_archived: false })
          .eq("id", section.id);
        if (sectionError) {
          console.error(sectionError);
        }

        createActivityLog({
          actor_id: profile?.id,
          action: ActivityAction.UNARCHIVED_SECTION,
          entity: {
            id: section.id,
            type: EntityType.SECTION,
            name: section.name,
          },
          metadata: {
            old_data: section,
            new_data: { ...section, is_archived: false },
          },
        });
      } else {
        // first update localstate
        setTasks(
          tasks.map((t) =>
            t.section_id == section.id ? { ...t, is_completed: true } : t
          )
        );

        setSections(
          sections.map((s) =>
            s.id === section.id ? { ...s, is_archived: true } : s
          )
        );

        setShowArchiveConfirm(null);

        // delete all tasks in the section
        const { error } = await supabaseBrowser
          .from("tasks")
          .update({ is_completed: true })
          .eq("section_id", section.id);

        if (error) {
          console.error(error);
          return;
        }

        // archive the section
        const { error: sectionError } = await supabaseBrowser
          .from("sections")
          .update({ is_archived: true })
          .eq("id", section.id);
        if (sectionError) {
          console.error(sectionError);
        }

        createActivityLog({
          actor_id: profile?.id,
          action: ActivityAction.ARCHIVED_SECTION,
          entity: {
            id: section.id,
            type: EntityType.SECTION,
            name: section.name,
          },
          metadata: {
            old_data: section,
            new_data: { ...section, is_archived: true },
          },
        });
      }
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [showArchiveConfirm, setShowArchiveConfirm] = useState<{
    id: string;
    title: string;
    tasks: TaskType[];
    is_archived?: boolean;
  } | null>(null);

  const [columnId, setColumnId] = useState<any>(null);
  const [index, setIndex] = useState(0);

  const AddNewSection = withPermission(AddNewSectionBoardView, {
    permissionName: project?.team_id
      ? PermissionName.CREATE_TEAM_CONTENT
      : PermissionName.CREATE_PERSONAL_CONTENT,
    project,
    page: null,
  });

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(boardProvided) => (
            <div
              ref={boardProvided.innerRef}
              {...boardProvided.droppableProps}
              className="flex gap-1 h-[calc(100vh-120px)] overflow-auto px-4 md:px-6 py-4 pb-20 scroll-smooth w-screen md:w-auto"
            >
              {isLoading ? (
                <div className="space-x-5 flex">
                  <div className="bg-gray-25 dark:bg-surface p-2 rounded-lg w-[calc(100vw-50px)] min-w-[calc(100vw-50px)] md:w-[300px] md:min-w-[300px] space-y-2">
                    <h3 className="font-bold pl-[6px]">
                      <Skeleton width={50} />
                    </h3>

                    <div className="space-y-2">
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"70%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"70%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-25 dark:bg-surface p-2 rounded-lg w-[calc(100vw-50px)] min-w-[calc(100vw-50px)] md:w-[300px] md:min-w-[300px] space-y-2">
                    <h3 className="font-bold pl-[6px]">
                      <Skeleton width={50} />
                    </h3>

                    <div className="space-y-2">
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"70%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"70%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"70%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-25 dark:bg-surface p-2 rounded-lg w-[calc(100vw-50px)] min-w-[calc(100vw-50px)] md:w-[300px] md:min-w-[300px] space-y-2">
                    <h3 className="font-bold pl-[6px]">
                      <Skeleton width={50} />
                    </h3>

                    <div className="space-y-2">
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"70%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"70%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-25 dark:bg-surface p-2 rounded-lg w-[calc(100vw-50px)] min-w-[calc(100vw-50px)] md:w-[300px] md:min-w-[300px] space-y-2">
                    <h3 className="font-bold pl-[6px]">
                      <Skeleton width={50} />
                    </h3>

                    <div className="space-y-2">
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"70%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"70%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-full">
                          <Skeleton width={"60%"} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {columns.map((column, columnIndex) => (
                    <BoardViewColumn
                      key={column.id}
                      tasks={tasks}
                      setIndex={setIndex}
                      setColumnId={setColumnId}
                      column={column}
                      columnIndex={columnIndex}
                      project={project}
                      setShowArchiveConfirm={setShowArchiveConfirm}
                      setShowDeleteConfirm={setShowDeleteConfirm}
                      setShowUngroupedAddSection={setShowUngroupedAddSection}
                      setSections={setSections}
                      sections={sections}
                      setTasks={setTasks}
                      setShowAddTask={setShowAddTask}
                      setShowUngroupedAddTask={setShowUngroupedAddTask}
                      showAddTask={showAddTask}
                      showUngroupedAddTask={showUngroupedAddTask}
                      columns={columns}
                    />
                  ))}

                  <div>
                    {columns.length == 0 && (
                      <AddNewSection
                        setShowUngroupedAddSection={setShowUngroupedAddSection}
                        showUngroupedAddSection={showUngroupedAddSection}
                        project={project}
                        setSections={setSections}
                        sections={sections}
                        index={columns.length}
                      />
                    )}
                  </div>

                  {boardProvided.placeholder}

                  {columns.length - 1 == index && (
                    <AddNewSection
                      setShowUngroupedAddSection={setShowUngroupedAddSection}
                      columnId={columnId}
                      columns={columns}
                      index={index}
                      project={project}
                      setSections={setSections}
                      sections={sections}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showDeleteConfirm && (
        <ConfirmAlert
          title="Delete section?"
          description={
            <>
              This will permanently delete{" "}
              <span className="font-semibold">
                &quot;{showDeleteConfirm.title}
                &quot;
              </span>{" "}
              and all of its tasks. This can&apos;t be undone.
            </>
          }
          submitBtnText="Delete"
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() =>
            handleSectionDelete(
              showDeleteConfirm.id == "ungrouped"
                ? null
                : {
                    id: parseInt(showDeleteConfirm.id),
                    name: showDeleteConfirm.title,
                  }
            )
          }
        />
      )}

      {showArchiveConfirm && (
        <ConfirmAlert
          title={
            showArchiveConfirm.is_archived
              ? "Unarchive section?"
              : "Archive section?"
          }
          description={
            <div className="space-y-2">
              <p>
                Are you sure you want to{" "}
                {showArchiveConfirm.is_archived ? "unarchive" : "archive"}{" "}
                <span className="font-semibold">
                  &quot;{showArchiveConfirm.title}
                  &quot;
                </span>
                {showArchiveConfirm.tasks.filter((t) => !t.is_completed)
                  .length > 0 && (
                  <>
                    with its{" "}
                    <span className="font-semibold">
                      {showArchiveConfirm.tasks.length}
                    </span>{" "}
                    tasks
                  </>
                )}
                ?
              </p>

              {showArchiveConfirm.tasks.filter((t) => !t.is_completed).length >
                0 && (
                <p>
                  When archived, uncompleted tasks will be marked as complete.
                </p>
              )}
            </div>
          }
          submitBtnText={
            showArchiveConfirm.is_archived ? "Unarchive" : "Archive"
          }
          onCancel={() => setShowArchiveConfirm(null)}
          onConfirm={() =>
            handleSectionArchive(
              showArchiveConfirm.id == "ungrouped"
                ? null
                : {
                    id: parseInt(showArchiveConfirm.id),
                    name: showArchiveConfirm.title,
                  }
            )
          }
        />
      )}
    </>
  );
};

export default BoardView;