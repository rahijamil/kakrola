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

const BoardView: React.FC<{
  tasks: TaskType[];
  sections: SectionType[];
  setSections: Dispatch<SetStateAction<SectionType[]>>;
  groupedTasks: Record<string, TaskType[]>;
  unGroupedTasks: TaskType[];
  showAddTask: string | number | null;
  setShowAddTask: React.Dispatch<React.SetStateAction<string | number | null>>;
  showUngroupedAddTask: boolean;
  setShowUngroupedAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  showUngroupedAddSection: boolean;
  setShowUngroupedAddSection: React.Dispatch<React.SetStateAction<boolean>>;
  showShareOption?: boolean;
  setShowShareOption?: React.Dispatch<React.SetStateAction<boolean>>;
  project: ProjectType | null;
  setTasks: Dispatch<SetStateAction<TaskType[]>>;
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
  showShareOption,
  setShowShareOption,
  project,
  setTasks,
}) => {
  const [showSectionMoreOptions, setShowSectionMoreOptions] = useState<
    string | null
  >(null);

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
    const { source, destination, type } = result;

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

      // To store the updated tasks that need to be sent to the database
      let tasksToUpdate: TaskType[] = [];

      setTasks((prevTasks) => {
        // Find tasks in the source section
        const sourceTasks = prevTasks.filter(
          (task) => task.section_id === sourceSectionId
        );

        // Find the moved task
        const movedTask = sourceTasks[source.index];

        if (!movedTask) {
          console.error("Moved task not found");
          return prevTasks;
        }

        // Remove the moved task from the source section
        const tasksWithoutMoved = prevTasks.filter(
          (task) => task.id !== movedTask.id
        );

        // Update the moved task with new section and order
        const updatedMovedTask: TaskType = {
          ...movedTask,
          section_id: newSectionId,
          order: destination.index,
        };

        // Find tasks in the destination section
        const destinationTasks = tasksWithoutMoved.filter(
          (task) => task.section_id === newSectionId
        );

        // Insert the updated task at the new position
        const updatedDestinationTasks = [
          ...destinationTasks.slice(0, destination.index),
          updatedMovedTask,
          ...destinationTasks.slice(destination.index),
        ];

        // Combine all tasks back together, ensuring correct order
        const updatedTasks = [
          ...tasksWithoutMoved.filter(
            (task) => task.section_id !== newSectionId
          ),
          ...updatedDestinationTasks,
        ];

        // Reorder tasks in the affected sections
        const finalTasks = updatedTasks.map((task, index) => {
          if (
            task.section_id === newSectionId ||
            task.section_id === movedTask.section_id
          ) {
            const updatedTask = { ...task, order: index };
            tasksToUpdate.push(updatedTask); // Collect tasks to update in the database
            return updatedTask;
          }
          return task;
        });

        return finalTasks;
      });

      // Update tasks in the database with correct orders within their sections
      try {
        const promises = tasksToUpdate.map((task) =>
          supabaseBrowser
            .from("tasks")
            .update({
              section_id: task.section_id,
              order: task.order,
              updated_at: new Date().toISOString(),
            })
            .eq("id", task.id)
        );
        const results = await Promise.all(promises);
        results.forEach((result) => {
          if (result.error) throw result.error;
        });
      } catch (error) {
        console.error("Error updating tasks:", error);
        // Optionally, implement a way to revert the state if the database update fails
      }
    }
  };

  const handleSectionDelete = async (section: { id: number } | null) => {
    if (section) {
      // first update localstate
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.section_id !== section.id)
      );

      setSections((prevSections) =>
        prevSections.filter((s) => s.id !== section.id)
      );

      setShowDeleteConfirm(null);

      // delete all tasks in the section
      const { error } = await supabaseBrowser
        .from("tasks")
        .delete()
        .eq("section_id", section.id);
      if (error) {
        console.error(error);
        return;
      }

      // delete the section
      const { error: sectionError } = await supabaseBrowser
        .from("sections")
        .delete()
        .eq("id", section.id);
      if (sectionError) {
        console.error(sectionError);
      }
    } else {
      // update localstate
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.section_id !== null)
      );
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

  const handleSectionArchive = async (section: { id: number } | null) => {
    if (section) {
      if (showArchiveConfirm?.is_archived) {
        setSections((prevSections) =>
          prevSections.map((s) =>
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
      } else {
        // first update localstate
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.section_id == section.id ? { ...t, is_completed: true } : t
          )
        );

        setSections((prevSections) =>
          prevSections.map((s) =>
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

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(boardProvided) => (
            <div
              ref={boardProvided.innerRef}
              {...boardProvided.droppableProps}
              className="flex overflow-x-auto space-x-2 p-8 pt-0 h-full"
            >
              {columns.map((column, columnIndex) => (
                <BoardViewColumn
                  key={column.id}
                  tasks={tasks}
                  column={column}
                  columnIndex={columnIndex}
                  project={project}
                  setShowArchiveConfirm={setShowArchiveConfirm}
                  setShowDeleteConfirm={setShowDeleteConfirm}
                  setShowUngroupedAddSection={setShowUngroupedAddSection}
                  setSections={setSections}
                  sections={sections}
                  setTasks={setTasks}
                  setShowShareOption={setShowShareOption}
                  showShareOption={showShareOption}
                  setShowAddTask={setShowAddTask}
                  setShowSectionMoreOptions={setShowSectionMoreOptions}
                  setShowUngroupedAddTask={setShowUngroupedAddTask}
                  showAddTask={showAddTask}
                  showSectionMoreOptions={showSectionMoreOptions}
                  showUngroupedAddTask={showUngroupedAddTask}
                  columns={columns}
                />
              ))}

              <div>
                {columns.length == 0 && (
                  <AddNewSectionBoardView
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
              and all of its tasks. This can't be undone.
            </>
          }
          submitBtnText="Delete"
          onCancel={() => setShowDeleteConfirm(null)}
          onSubmit={() =>
            handleSectionDelete(
              showDeleteConfirm.id == "ungrouped"
                ? null
                : { id: parseInt(showDeleteConfirm.id) }
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
          onSubmit={() =>
            handleSectionArchive(
              showArchiveConfirm.id == "ungrouped"
                ? null
                : { id: parseInt(showArchiveConfirm.id) }
            )
          }
        />
      )}
    </>
  );
};

export default BoardView;
