import { ProjectType, SectionType, TaskType } from "@/types/project";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import AddNewSectionListView from "../AddNewSectionListView";
import ConfirmAlert from "../../AlertBox/ConfirmAlert";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useAuthProvider } from "@/context/AuthContext";
import ListViewSection from "../ListViewSection";
import UngroupedTasks from "../UngroupedTasks";
import { v4 as uuidv4 } from "uuid";
import { useGlobalOption } from "@/context/GlobalOptionContext";
import {
  AlignLeft,
  AtSign,
  CalendarRange,
  CircleChevronUp,
  MapPin,
  Tag,
  UserPlus,
} from "lucide-react";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useRole } from "@/context/RoleContext";
import {
  canCreateSection,
  canEditSection,
  canEditTask,
} from "@/types/hasPermission";
import useScreen from "@/hooks/useScreen";

interface ListViewProps {
  groupedTasks: Record<string, TaskType[]>;
  unGroupedTasks: TaskType[];
  sections: SectionType[];
  setSections: (updatedSections: SectionType[]) => void;
  showAddTask: string | number | null;
  setShowAddTask: Dispatch<SetStateAction<string | number | null>>;
  showUngroupedAddTask: boolean;
  setShowUngroupedAddTask: Dispatch<SetStateAction<boolean>>;
  showUngroupedAddSection: boolean;
  setShowUngroupedAddSection: Dispatch<SetStateAction<boolean>>;
  project: ProjectType | null;
  setTasks: (tasks: TaskType[]) => void;
  tasks: TaskType[];
}

const ListView: React.FC<ListViewProps> = ({
  groupedTasks,
  unGroupedTasks,
  sections,
  setSections,
  showAddTask,
  setShowAddTask,
  showUngroupedAddTask,
  setShowUngroupedAddSection,
  setShowUngroupedAddTask,
  project,
  setTasks,
  tasks,
}) => {
  const [showSectionMoreOptions, setShowSectionMoreOptions] =
    useState<SectionType | null>(null);
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

  const [newSectionName, setNewSectionName] = useState("");
  const [showAddSection, setShowAddSection] = useState<string | number | null>(
    null
  );

  const [showTaskItemModal, setShowTaskItemModal] = useState<string | null>(
    null
  );

  const { profile } = useAuthProvider();
  const { role } = useRole();
  const [sectionAddLoading, setSectionAddLoading] = useState(false);

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

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      if (!profile?.id || !project?.id) return;

      const userRole = role(project.id);
      const canUpdateSection = userRole ? canEditSection(userRole) : false;
      if (!canUpdateSection) return;

      const { source, destination, type } = result;

      if (!destination) return;

      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      // Handle section reordering
      if (type === "column") {
        const reorderedSections = Array.from(sections);
        const [movedSection] = reorderedSections.splice(source.index, 1);
        reorderedSections.splice(destination.index, 0, movedSection);

        // Update section order based on new positions
        const updatedSections = reorderedSections.map((section, index) => ({
          ...section,
          order: index,
        }));

        setSections(updatedSections);

        // Update section order in Supabase
        try {
          for (const section of updatedSections) {
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

      // Handle task reordering or moving between sections
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

        const updateTasks = (prevTasks: TaskType[]) => {
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
        };

        setTasks(updateTasks(tasks));

        // Update tasks in the database with correct orders within their sections
        try {
          const userRole = role(project.id);

          const canUpdateTask = userRole ? canEditTask(userRole) : false;
          if (!canUpdateTask) return;

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
    },
    [sections, setSections, tasks, setTasks]
  );

  const toggleSection = async (
    section_id: string | number,
    is_collapsed: boolean
  ) => {
    if (!profile?.id || !project?.id) return;

    setSections(
      sections.map((section) =>
        section.id === section_id
          ? { ...section, is_collapsed: !section.is_collapsed }
          : section
      )
    );

    const { error: sectionsError } = await supabaseBrowser
      .from("sections")
      .update({
        is_collapsed,
      })
      .eq("id", section_id);

    if (sectionsError) {
      console.error(sectionsError);
    }
  };

  const handleAddSection = async (
    ev: FormEvent<HTMLFormElement>,
    index: number
  ) => {
    ev.preventDefault();

    if (!profile?.id || !newSectionName.trim()) {
      return;
    }

    setSectionAddLoading(true);

    let newOrder: number;

    if (sections.length > 0) {
      if (index !== undefined && index < sections.length) {
        // If inserting after an existing section
        const currentOrder = sections[index].order;
        const nextOrder =
          index < sections.length - 1
            ? sections[index + 1].order
            : currentOrder + 1;
        newOrder = (currentOrder + nextOrder) / 2;
      } else {
        // If adding to the end
        newOrder = Math.max(...sections.map((s) => s.order)) + 1;
      }
    } else {
      // If it's the first section
      newOrder = 1;
    }

    console.log("Calculated newOrder:", newOrder);

    const newSection: SectionType = {
      id: uuidv4(), // temporary placeholder ID
      name: newSectionName.trim(),
      project_id: project?.id || null,
      profile_id: profile.id,
      is_collapsed: false,
      is_inbox: project ? false : true,
      is_archived: false,
      order: newOrder,
      updated_at: new Date().toISOString(),
    };

    // Optimistically update the state
    const updatedSections = [
      ...sections.slice(0, index ?? sections.length),
      newSection,
      ...sections.slice(index ?? sections.length),
    ].sort((a, b) => a.order - b.order);

    setSections(updatedSections);
    setSectionAddLoading(false);
    setShowAddSection(null);

    try {
      if (!project?.id) return;
      const userRole = role(project.id);
      const canCreate = userRole ? canCreateSection(userRole) : false;
      if (!canCreate) return;

      const { data, error } = await supabaseBrowser
        .from("sections")
        .insert([
          {
            name: newSection.name,
            project_id: newSection.project_id,
            profile_id: newSection.profile_id,
            is_collapsed: newSection.is_collapsed,
            is_inbox: newSection.is_inbox,
            order: newOrder,
            updated_at: newSection.updated_at,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update section with actual ID from database
      setSections(
        updatedSections
          .map((s) => {
            return s.id == newSection.id ? { ...newSection, id: data.id } : s;
          })
          .sort((a, b) => a.order - b.order)
      );

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.CREATED_SECTION,
        entity_id: data.id,
        entity_type: EntityType.SECTION,
        metadata: {},
      });
    } catch (error) {
      console.error("Error inserting section:", error);
      // Revert the optimistic update if there's an error
      setSections(sections);
    } finally {
      setNewSectionName("");
      setShowAddSection(null);
      setShowUngroupedAddSection(false);
      setSectionAddLoading(false);
    }
  };

  const handleSectionDelete = async (section: { id: number } | null) => {
    if (section && profile?.id) {
      setTasks(tasks.filter((task) => task.section_id !== section.id));
      setSections(sections.filter((s) => s.id !== section.id));
      setShowDeleteConfirm(null);

      const { error } = await supabaseBrowser
        .from("tasks")
        .delete()
        .eq("section_id", section.id);
      if (!error) {
        await supabaseBrowser.from("sections").delete().eq("id", section.id);

        createActivityLog({
          actor_id: profile.id,
          action: ActivityAction.DELETED_SECTION,
          entity_id: section.id,
          entity_type: EntityType.SECTION,
          metadata: {
            old_data: section,
          },
        });
      }
    } else {
      setTasks(tasks.filter((task) => task.section_id !== null));
      setShowDeleteConfirm(null);

      await supabaseBrowser.from("tasks").delete().is("section_id", null);
    }
  };

  const handleSectionArchive = async (section: { id: number } | null) => {
    if (section && profile?.id) {
      if (showArchiveConfirm?.is_archived) {
        setSections(
          sections.map((s) =>
            s.id === section.id ? { ...s, is_archived: false } : s
          )
        );

        setShowArchiveConfirm(null);

        await supabaseBrowser
          .from("sections")
          .update({ is_archived: false })
          .eq("id", section.id);

        createActivityLog({
          actor_id: profile.id,
          action: ActivityAction.UNARCHIVED_SECTION,
          entity_id: section.id,
          entity_type: EntityType.SECTION,
          metadata: {
            old_data: section,
            new_data: { ...section, is_archived: false },
          },
        });
      } else {
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

        await supabaseBrowser
          .from("tasks")
          .update({ is_completed: true })
          .eq("section_id", section.id);

        await supabaseBrowser
          .from("sections")
          .update({ is_archived: true })
          .eq("id", section.id);

        createActivityLog({
          actor_id: profile.id,
          action: ActivityAction.ARCHIVED_SECTION,
          entity_id: section.id,
          entity_type: EntityType.SECTION,
          metadata: {
            old_data: section,
            new_data: { ...section, is_archived: true },
          },
        });
      }
    }
  };

  const { screenWidth } = useScreen();

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list" type="column" direction="vertical">
          {(listProvided) => (
            <div
              className="overflow-auto w-full h-[calc(100vh-110px)] md:px-6 md:mt-4"
              ref={listProvided.innerRef}
              {...listProvided.droppableProps}
            >
              <table className="w-full min-w-[1000px] border-collapse">
                <tr className="border-y border-text-200 text-xs divide-x divide-text-200 whitespace-nowrap flex sticky top-0 z-10 bg-background">
                  <th className="p-2 text-left w-[30%] md:w-[40%] font-medium flex items-center gap-2 pl-4 md:pl-8">
                    <AlignLeft strokeWidth={2} className="w-4 h-4" />
                    <span>Task name</span>
                  </th>
                  <th className="p-2 text-left w-[15%] font-medium flex items-center gap-2">
                    <UserPlus strokeWidth={2} className="w-4 h-4" />
                    <span>Assignee</span>
                  </th>
                  <th className="p-2 text-left w-[15%] font-medium flex items-center gap-2">
                    <CalendarRange strokeWidth={2} className="w-4 h-4" />
                    <span>Dates</span>
                  </th>
                  <th className="p-2 text-left w-[15%] font-medium flex items-center gap-2">
                    <CircleChevronUp strokeWidth={2} className="w-4 h-4" />
                    <span>Priority</span>
                  </th>
                  <th className="p-2 text-left w-[15%] font-medium flex items-center gap-2">
                    <Tag strokeWidth={2} className="w-4 h-4" />
                    <span>Labels</span>
                  </th>
                  <th className="p-2 text-left w-[15%] font-medium flex items-center gap-2">
                    <MapPin strokeWidth={2} className="w-4 h-4" />
                    <span>Location</span>
                  </th>
                </tr>

                <tbody>
                  {columns.filter((c) => c.id !== "ungrouped").length == 0 && (
                    <tr>
                      <td colSpan={5} className="p-0">
                        <UngroupedTasks
                          tasks={unGroupedTasks}
                          showUngroupedAddTask={showUngroupedAddTask}
                          setShowUngroupedAddTask={setShowUngroupedAddTask}
                          project={project}
                          setTasks={setTasks}
                          showTaskItemModal={showTaskItemModal}
                          setShowTaskItemModal={setShowTaskItemModal}
                        />

                        {screenWidth > 768 && (
                          <AddNewSectionListView
                            section={{
                              id: "ungrouped",
                              title: "Ungrouped",
                              tasks: [],
                            }}
                            index={0}
                            newSectionName={newSectionName}
                            setNewSectionName={setNewSectionName}
                            handleAddSection={handleAddSection}
                            setShowAddSection={setShowAddSection}
                            showAddSection={showAddSection}
                            sectionAddLoading={sectionAddLoading}
                          />
                        )}
                      </td>
                    </tr>
                  )}

                  {columns
                    .filter((c) => c.id !== "ungrouped")
                    .map((column, columnIndex) => (
                      <Draggable
                        key={column.id}
                        draggableId={column.id}
                        index={columnIndex}
                        isDragDisabled={!!showTaskItemModal}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <td colSpan={5} className="p-0 pb-4 md:pb-0">
                              <ListViewSection
                                section={
                                  sections.find(
                                    (s) => s.id.toString() === column.id
                                  )!
                                }
                                sections={sections}
                                setSections={setSections}
                                toggleSection={toggleSection}
                                groupedTasks={groupedTasks}
                                showSectionMoreOptions={showSectionMoreOptions}
                                setShowSectionMoreOptions={
                                  setShowSectionMoreOptions
                                }
                                setShowDeleteConfirm={setShowDeleteConfirm}
                                setShowArchiveConfirm={setShowArchiveConfirm}
                                setShowAddTask={setShowAddTask}
                                setTasks={setTasks}
                                showAddTask={showAddTask}
                                tasks={tasks}
                                project={project}
                                showTaskItemModal={showTaskItemModal}
                                setShowTaskItemModal={setShowTaskItemModal}
                              />
                              {screenWidth > 768 && (
                                <AddNewSectionListView
                                  section={column}
                                  index={columnIndex}
                                  newSectionName={newSectionName}
                                  setNewSectionName={setNewSectionName}
                                  handleAddSection={handleAddSection}
                                  setShowAddSection={setShowAddSection}
                                  showAddSection={showAddSection}
                                  sectionAddLoading={sectionAddLoading}
                                />
                              )}
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}

                  {listProvided.placeholder}
                </tbody>
              </table>
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
          onConfirm={() =>
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

export default ListView;