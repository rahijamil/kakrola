import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import TaskItem from "./TaskItem";
import SectionAddTask from "./SectionAddTask";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import SectionMoreOptions from "./SectionMoreOptions";
import AddNewSectionBoardView from "./AddNewSectionBoardView";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import { supabaseBrowser } from "@/utils/supabase/client";

const BoardView: React.FC<{
  sections: SectionType[];
  groupedTasks: Record<string, TaskType[]>;
  unGroupedTasks: TaskType[];
  onTaskUpdate: (updatedTask: TaskType) => void;
  showAddTask: number | null;
  setShowAddTask: React.Dispatch<React.SetStateAction<number | null>>;
  showUngroupedAddTask: boolean;
  setShowUngroupedAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  showUngroupedAddSection: boolean;
  setShowUngroupedAddSection: React.Dispatch<React.SetStateAction<boolean>>;
  showShareOption?: boolean;
  setShowShareOption?: React.Dispatch<React.SetStateAction<boolean>>;
  project: ProjectType | null;
  setTasks: Dispatch<SetStateAction<TaskType[]>>;
}> = ({
  sections,
  groupedTasks,
  unGroupedTasks,
  onTaskUpdate,
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
      { id: string; title: string; tasks: TaskType[] }
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
    const { source, destination } = result;

    // If there's no destination, we don't need to do anything
    if (!destination) return;

    // If the source and destination are the same, we don't need to do anything
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the source and destination columns
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destColumn) return;

    // Create new arrays for the updated tasks
    const newSourceTasks = Array.from(sourceColumn.tasks);
    const newDestTasks =
      source.droppableId === destination.droppableId
        ? newSourceTasks
        : Array.from(destColumn.tasks);

    // Remove the task from the source array
    const [movedTask] = newSourceTasks.splice(source.index, 1);

    // Insert the task into the destination array
    newDestTasks.splice(destination.index, 0, movedTask);

    // Update the task's section if it was moved to a different column
    const updatedMovedTask: TaskType = {
      ...movedTask,
      section_id:
        destination.droppableId !== "ungrouped" && movedTask.section_id
          ? movedTask.section_id
          : null,
    };

    // Update the tasks state
    // setTasks((prevTasks) => {
    //   const updatedTasks: TaskType[] = prevTasks.map((task) =>
    //     task.id === updatedMovedTask.id ? updatedMovedTask : task
    //   );

    //   // Reorder tasks within the same section or between sections
    //   return updatedTasks.sort((a, b) => {
    //     if (a.section_id !== b.section_id) {
    //       return 0; // Different sections, maintain original order
    //     }
    //     const columnTasks = a.section_id ? newDestTasks : newSourceTasks;
    //     return (
    //       columnTasks.findIndex((t) => t.id === a.id) -
    //       columnTasks.findIndex((t) => t.id === b.id)
    //     );
    //   });
    // });
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleSectionDelete = async (section: { id: number } | null) => {
    if (section) {
      const { error } = await supabaseBrowser
        .from("tasks")
        .delete()
        .eq("section_id", section.id);
      if (error) {
        console.error(error);
        return;
      }

      const { error: sectionError } = await supabaseBrowser
        .from("sections")
        .delete()
        .eq("id", section.id);
      if (sectionError) {
        console.error(sectionError);
      }
    } else {
      const { error } = await supabaseBrowser
        .from("tasks")
        .delete()
        .eq("section_id", null);
      if (error) {
        console.error(error);
        return;
      }
    }

    setShowDeleteConfirm(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto space-x-2 p-8 pt-0 h-full">
        {columns.map((column, columnIndex) => (
          <React.Fragment key={column.id}>
            <div
              className={`bg-gray-100 p-2 pl-4 rounded-lg min-w-[300px] h-fit transition-colors`}
            >
              <div className="mb-2 flex justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{column.title}</h3>
                  <p className="text-sm text-gray-600">{column.tasks.length}</p>
                </div>

                <div className="relative">
                  <button
                    className={`p-1 transition rounded-md ${
                      showSectionMoreOptions == column.id
                        ? "bg-gray-200"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => setShowSectionMoreOptions(column.id)}
                  >
                    <EllipsisHorizontalIcon className="w-5 h-5 text-gray-700" />
                  </button>

                  {showSectionMoreOptions == column.id && (
                    <SectionMoreOptions
                      onClose={() => setShowSectionMoreOptions(null)}
                      column={column.id !== "ungrouped" ? column : null}
                      setShowDeleteConfirm={setShowDeleteConfirm}
                    />
                  )}

                  {showDeleteConfirm && (
                    <ConfirmAlert
                      title="Delete section?"
                      description={`This will permanently delete "${column.title}" and all of its tasks. This can't be undone.`}
                      submitBtnText="Delete"
                      onCancel={() => setShowDeleteConfirm(false)}
                      onSubmit={() =>
                        handleSectionDelete(
                          column.id == "ungrouped"
                            ? null
                            : { id: parseInt(column.id) }
                        )
                      }
                    />
                  )}
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[100px] space-y-2"
                  >
                    {column.tasks
                      .filter((t) => !t.parent_task_id)
                      .map((task, taskIndex) => (
                        <div
                          key={task.id}
                          className="rounded shadow-sm hover:shadow-md"
                        >
                          <TaskItem
                            key={task.id}
                            task={task}
                            setTasks={setTasks}
                            // section={column}
                            subTasks={column.tasks.filter(
                              (t) => t.parent_task_id == task.id
                            )}
                            setShowShareOption={setShowShareOption}
                            showShareOption={showShareOption}
                            index={taskIndex}
                            project={project}
                          />
                        </div>
                      ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

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
              />
            </div>

            <AddNewSectionBoardView
              sections={sections}
              setShowUngroupedAddSection={setShowUngroupedAddSection}
              columnId={column.id}
              columns={columns}
              index={columnIndex}
              project={project}
            />
          </React.Fragment>
        ))}

        <div>
          {columns.length == 0 && (
            <AddNewSectionBoardView
              sections={sections}
              setShowUngroupedAddSection={setShowUngroupedAddSection}
              showUngroupedAddSection={showUngroupedAddSection}
              project={project}
            />
          )}
        </div>
      </div>
    </DragDropContext>
  );
};

export default BoardView;
