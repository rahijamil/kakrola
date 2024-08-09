import { ChevronRightIcon } from "@heroicons/react/24/outline";
import TaskItem from "./TaskItem";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import {
  Dispatch,
  FormEvent,
  Fragment,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import SectionAddTask from "./SectionAddTask";
import { CopyPlusIcon, MoreHorizontal } from "lucide-react";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import AddNewSectionListView from "./AddNewSectionListView";
import SectionMoreOptions from "./SectionMoreOptions";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useAuthProvider } from "@/context/AuthContext";

interface ListViewProps {
  groupedTasks: Record<string, TaskType[]>;
  unGroupedTasks: TaskType[];
  sections: SectionType[];
  setSections: Dispatch<SetStateAction<SectionType[]>>;
  showAddTask: number | null;
  setShowAddTask: Dispatch<SetStateAction<number | null>>;
  showUngroupedAddTask: boolean;
  setShowUngroupedAddTask: Dispatch<SetStateAction<boolean>>;
  showUngroupedAddSection: boolean;
  setShowUngroupedAddSection: Dispatch<SetStateAction<boolean>>;
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
  project: ProjectType | null;
}

const ListView: React.FC<ListViewProps> = ({
  groupedTasks,
  unGroupedTasks,
  sections,
  setSections,
  showAddTask,
  setShowAddTask,
  showUngroupedAddSection,
  showUngroupedAddTask,
  setShowUngroupedAddSection,
  setShowUngroupedAddTask,
  setShowShareOption,
  showShareOption,
  project,
}) => {
  const [showSectionMoreOptions, setShowSectionMoreOptions] =
    useState<SectionType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [showAddSection, setShowAddSection] = useState<number | null>(null);

  // const rows = useMemo(() => {
  //   const columnsObj: Record<
  //     string,
  //     { id: string; title: string; tasks: TaskType[] }
  //   > = {
  //     ungrouped: {
  //       id: "ungrouped",
  //       title: "(No section)",
  //       tasks: unGroupedTasks,
  //     },
  //     ...sections.reduce(
  //       (acc, section) => ({
  //         ...acc,
  //         [section.id]: {
  //           id: section.id.toString(),
  //           title: section.name,
  //           tasks: groupedTasks[section.id] || [],
  //         },
  //       }),
  //       {}
  //     ),
  //   };

  //   const orderedColumns = [
  //     columnsObj.ungrouped,
  //     ...sections.map((section) => columnsObj[section.id]),
  //   ];

  //   return orderedColumns;
  // }, [sections, groupedTasks, unGroupedTasks]);

  const ListViewSection = ({ section }: { section: SectionType }) => {
    const handleSectionDelete = () => {
      // if (section) {
      //   const updatedTasks = tasks.filter((t) => t.section_id !== section.id);
      //   setTasks(updatedTasks);

      //   const updatedSections = sections.filter((s) => s.id !== section.id);

      //   setSections(updatedSections);
      // } else {
      //   const updatedTasks = tasks.filter((t) => t.section_id !== null);
      //   setTasks(updatedTasks);
      // }

      setShowDeleteConfirm(false);
    };

    return (
      <div>
        <div className="flex items-center gap-1 py-2">
          <button
            className={`p-1 hover:bg-gray-100 transition rounded-md ${
              !section.is_collapsed && "rotate-90"
            }`}
            onClick={() => toggleSection(section.id, !section.is_collapsed)}
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-700" />
          </button>

          <div className="flex items-center justify-between gap-8 border-b border-gray-200 w-full">
            <div className="flex items-center gap-2">
              <h3 className="font-bold ">{section.name}</h3>

              {(groupedTasks[section.id] || []).length > 0 && (
                <p className="text-sm text-gray-600">
                  {(groupedTasks[section.id] || []).length}
                </p>
              )}
            </div>

            <div className="relative">
              <button
                className={`p-1 hover:bg-gray-100 transition rounded-md ${
                  showSectionMoreOptions?.id == section.id
                    ? "bg-gray-200"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setShowSectionMoreOptions(section)}
              >
                <MoreHorizontal className="w-5 h-5 text-gray-700" />
              </button>

              {showSectionMoreOptions?.id == section.id && (
                <SectionMoreOptions
                  onClose={() => setShowSectionMoreOptions(null)}
                  column={{
                    id: section.id.toString(),
                    title: section.name,
                  }}
                  setShowDeleteConfirm={setShowDeleteConfirm}
                />
              )}

              {showDeleteConfirm && (
                <ConfirmAlert
                  title="Delete section?"
                  description={`This will permanently delete "${section.name}" and all of its tasks. This can't be undone.`}
                  submitBtnText="Delete"
                  onCancel={() => setShowDeleteConfirm(false)}
                  onSubmit={handleSectionDelete}
                />
              )}
            </div>
          </div>
        </div>

        {!section.is_collapsed && (
          <Droppable key={section.id} droppableId={section.id.toString()}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="pl-8"
              >
                <ul>
                  {(groupedTasks[section.id] || [])
                    .filter((t) => !t.parent_task_id)
                    .map((task, index) => (
                      <Fragment key={task.id}>
                        <li
                          className={`border-b border-gray-200 p-1 pl-0 flex items-center gap-3 cursor-pointer ${
                            task.parent_task_id && "ml-8"
                          }`}
                        >
                          <TaskItem
                            task={task}
                            subTasks={(groupedTasks[section.id] || []).filter(
                              (t) => t.parent_task_id == task.id
                            )}
                            showShareOption={showShareOption}
                            setShowShareOption={setShowShareOption}
                            index={index}
                            project={project}
                          />
                        </li>

                        {(groupedTasks[section.id] || []).filter(
                          (t) => t.parent_task_id == task.id
                        ).length > 0 && (
                          <ul className="ml-8">
                            {(groupedTasks[section.id] || [])
                              .filter((t) => t.parent_task_id == task.id)
                              .map((childTask, childIndex) => (
                                <li
                                  className={`border-b border-gray-200 p-1 pl-0 flex items-center gap-3 cursor-pointer ${
                                    childTask.parent_task_id && "ml-8"
                                  }`}
                                >
                                  <TaskItem
                                    task={childTask}
                                    subTasks={(
                                      groupedTasks[section.id] || []
                                    ).filter(
                                      (t) => t.parent_task_id == childTask.id
                                    )}
                                    showShareOption={showShareOption}
                                    setShowShareOption={setShowShareOption}
                                    index={childIndex}
                                    project={project}
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
                />
              </div>
            )}
          </Droppable>
        )}
      </div>
    );
  };

  const toggleSection = async (section_id: number, is_collapsed: boolean) => {
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

  const updateSectionOrder = async (sections: SectionType[]) => {
    for (let i = 0; i < sections.length; i++) {
      const { error } = await supabaseBrowser
        .from("sections")
        .update({
          order: i,
        })
        .eq("id", sections[i].id);

      if (error) {
        console.error(error);
      }
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "section") {
      const newSections = Array.from(sections || []);
      const [reorderedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, reorderedSection);

      // Update the order of the sections in the database
      await updateSectionOrder(newSections);

      // Update the state with the new section order
      // setActiveProjectSections(newSections);
    }

    // if (type === "section") {
    //   const newSections = Array.from(sections);
    //   const [reorderedSection] = newSections.splice(source.index, 1);
    //   newSections.splice(destination.index, 0, reorderedSection);
    //   setSections(newSections);
    // } else if (type === "task") {
    //   const sourceSection = source.droppableId;
    //   const destinationSection = destination.droppableId;

    //   if (sourceSection === destinationSection) {
    //     const newTasks = Array.from(groupedTasks[sourceSection]);
    //     const [reorderedTask] = newTasks.splice(source.index, 1);
    //     newTasks.splice(destination.index, 0, reorderedTask);

    //     const newGroupedTasks = {
    //       ...groupedTasks,
    //       [sourceSection]: newTasks,
    //     };

    //     setTasks(Object.values(newGroupedTasks).flat());
    //   } else {
    //     const sourceTasks = Array.from(groupedTasks[sourceSection]);
    //     const destinationTasks = Array.from(groupedTasks[destinationSection]);
    //     const [movedTask] = sourceTasks.splice(source.index, 1);

    //     const updatedTask: TaskType = {
    //       ...movedTask,
    //       sectionId: parseInt(destinationSection),
    //     };

    //     destinationTasks.splice(destination.index, 0, updatedTask);

    //     const newGroupedTasks = {
    //       ...groupedTasks,
    //       [sourceSection]: sourceTasks,
    //       [destinationSection]: destinationTasks,
    //     };

    //     setTasks(Object.values(newGroupedTasks).flat());
    //   }
    // }
  };

  const { profile } = useAuthProvider();

  const handleAddSection = async (
    ev: FormEvent<HTMLFormElement>,
    positionIndex: number | null
  ) => {
    ev.preventDefault();

    if (!newSectionName.trim()) {
      return;
    }

    if (project?.id) {
      // Get the current sections for the project
      const { data: sections, error: sectionsError } = await supabaseBrowser
        .from("sections")
        .select("*")
        .eq("project_id", project.id)
        .order("order", { ascending: true });

      if (sectionsError) {
        console.error(sectionsError);
        return;
      }

      let newOrder;
      if (positionIndex === null) {
        // Add the section at the end
        newOrder =
          sections.length > 0 ? sections[sections.length - 1].order + 1 : 0;
      } else {
        // Insert the section at the specified position
        newOrder = sections[positionIndex].order + 1;
        for (let i = positionIndex + 1; i < sections.length; i++) {
          await supabaseBrowser
            .from("sections")
            .update({
              order: sections[i].order + 1,
            })
            .eq("id", sections[i].id);
        }
      }

      const { error } = await supabaseBrowser.from("sections").insert([
        {
          name: newSectionName.trim(),
          project_id: project.id,
          profile_id: profile?.id,
          is_collapsed: false,
          is_inbox: false,
          order: newOrder,
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error(error);
      } else {
        setNewSectionName("");
        setShowAddSection(null);
        setShowUngroupedAddSection(false);
      }
    } else {
      // Get the current sections for the project
      const { data: sections, error: sectionsError } = await supabaseBrowser
        .from("sections")
        .select("*")
        .eq("project_id", null)
        .eq("is_inbox", true)
        .order("order", { ascending: true });

      if (sectionsError) {
        console.error(sectionsError);
        return;
      }

      let newOrder;
      if (positionIndex === null) {
        // Add the section at the end
        newOrder =
          sections.length > 0 ? sections[sections.length - 1].order + 1 : 0;
      } else {
        // Insert the section at the specified position
        newOrder = sections[positionIndex].order + 1;
        for (let i = positionIndex + 1; i < sections.length; i++) {
          await supabaseBrowser
            .from("sections")
            .update({
              order: sections[i].order + 1,
            })
            .eq("id", sections[i].id);
        }
      }

      const { error } = await supabaseBrowser.from("sections").insert([
        {
          name: newSectionName.trim(),
          project_id: null,
          profile_id: profile?.id,
          is_collapsed: false,
          is_inbox: true,
          order: newOrder,
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error(error);
      } else {
        setNewSectionName("");
        setShowAddSection(null);
        setShowUngroupedAddSection(false);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className={`space-y-2 ${
          unGroupedTasks.length > 0 &&
          Object.keys(groupedTasks).length > 0 &&
          "h-full"
        }`}
      >
        <div className="space-y-1">
          <div className="pl-8">
            <Droppable droppableId="ungrouped">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {unGroupedTasks
                    .filter((t) => !t.parent_task_id)
                    .map((task, index) => (
                      <Fragment key={task.id}>
                        <li
                          key={task.id}
                          className={`border-b border-gray-200 p-1 pl-0 flex items-center gap-3 cursor-pointer`}
                        >
                          <TaskItem
                            task={task}
                            subTasks={unGroupedTasks.filter(
                              (t) => t.parent_task_id === task.id
                            )}
                            showShareOption={showShareOption}
                            setShowShareOption={setShowShareOption}
                            index={index}
                            project={project}
                          />
                        </li>

                        {unGroupedTasks.filter(
                          (t) => t.parent_task_id === task.id
                        ).length > 0 && (
                          <ul className="ml-8">
                            {unGroupedTasks
                              .filter((t) => t.parent_task_id === task.id)
                              .map((childTask, childIndex) => (
                                <li
                                  key={childTask.id}
                                  className={`border-b border-gray-200 p-1 pl-0 flex items-center gap-3 cursor-pointer`}
                                >
                                  <TaskItem
                                    task={childTask}
                                    subTasks={unGroupedTasks.filter(
                                      (t) => t.parent_task_id === childTask.id
                                    )}
                                    showShareOption={showShareOption}
                                    setShowShareOption={setShowShareOption}
                                    index={childIndex}
                                    project={project}
                                  />
                                </li>
                              ))}
                          </ul>
                        )}
                      </Fragment>
                    ))}
                </ul>
              )}
            </Droppable>

            <SectionAddTask
              showUngroupedAddTask={showUngroupedAddTask}
              setShowUngroupedAddTask={setShowUngroupedAddTask}
              project={project}
            />
          </div>

          <div>
            {!showUngroupedAddSection && (
              <div
                className="flex items-center gap-2 pl-7 opacity-0 hover:opacity-100 cursor-pointer transition"
                onClick={() => setShowUngroupedAddSection(true)}
              >
                <div className="flex-1 bg-gray-400 h-[1px]"></div>
                <div className="font-bold text-gray-600 text-sm">
                  Add section
                </div>
                <div className="flex-1 bg-gray-500 h-[1px]"></div>
              </div>
            )}

            {showUngroupedAddSection && (
              <form
                className="space-y-2 pl-7 mt-3"
                onSubmit={(ev) => handleAddSection(ev, null)}
              >
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Name this section"
                  className="border border-gray-200 focus:outline-none focus:border-gray-400 w-full rounded px-2 py-1 font-semibold"
                  autoFocus
                />

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-2 py-[6px] text-xs text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-600 disabled:cursor-not-allowed transition disabled:opacity-50"
                    disabled={!newSectionName.trim()}
                  >
                    Add section
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUngroupedAddSection(false)}
                    className="px-3 py-[6px] text-xs text-gray-600 transition bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {sections?.map((section, index) => (
          <div className="space-y-1" key={section.id}>
            <ListViewSection key={section.id} section={section} />

            <AddNewSectionListView
              section={section}
              index={index}
              setShowUngroupedAddSection={setShowUngroupedAddSection}
              newSectionName={newSectionName}
              setNewSectionName={setNewSectionName}
              handleAddSection={handleAddSection}
              setShowAddSection={setShowAddSection}
              showAddSection={showAddSection}
            />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default ListView;
