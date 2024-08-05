import {
  ArchiveBoxArrowDownIcon,
  ArrowRightCircleIcon,
  ChevronRightIcon,
  HeartIcon,
  LinkIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import TaskItem from "./TaskItem";
import { SectionType, Task } from "@/types/project";
import { Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react";
import SectionAddTask from "./SectionAddTask";
import { CopyPlusIcon, MoreHorizontal } from "lucide-react";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import AddNewSectionListView from "./AddNewSectionListView";
import SectionMoreOptions from "./SectionMoreOptions";
import ConfirmAlert from "../AlertBox/ConfirmAlert";

interface ListViewProps {
  groupedTasks: Record<string, Task[]>;
  unGroupedTasks: Task[];
  activeProjectSections?: SectionType[];
  onTaskUpdate: (updatedTask: Task) => void;
  showAddTask: number | null;
  setShowAddTask: Dispatch<SetStateAction<number | null>>;
  showUngroupedAddTask: boolean;
  setShowUngroupedAddTask: Dispatch<SetStateAction<boolean>>;
  showUngroupedAddSection: boolean;
  setShowUngroupedAddSection: Dispatch<SetStateAction<boolean>>;
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
}

const ListView: React.FC<ListViewProps> = ({
  groupedTasks,
  unGroupedTasks,
  activeProjectSections,
  onTaskUpdate,
  showAddTask,
  setShowAddTask,
  showUngroupedAddSection,
  showUngroupedAddTask,
  setShowUngroupedAddSection,
  setShowUngroupedAddTask,
  setShowShareOption,
  showShareOption,
}) => {
  const [showSectionMoreOptions, setShowSectionMoreOptions] =
    useState<SectionType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const { sections, setSections, activeProject, setTasks } =
    useTaskProjectDataProvider();

  const [newSectionName, setNewSectionName] = useState("");
  const [showAddSection, setShowAddSection] = useState<number | null>(null);

  const rows = useMemo(() => {
    const columnsObj: Record<
      string,
      { id: string; title: string; tasks: Task[] }
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

    const orderedColumns = [
      columnsObj.ungrouped,
      ...sections.map((section) => columnsObj[section.id]),
    ];

    return orderedColumns;
  }, [sections, groupedTasks, unGroupedTasks]);

  const ListViewSection = ({ section }: { section: SectionType }) => {
    const { tasks, setTasks, sections, setSections } =
      useTaskProjectDataProvider();

    const handleSectionDelete = () => {
      if (section) {
        const updatedTasks = tasks.filter((t) => t.section?.id !== section.id);
        setTasks(updatedTasks);

        const updatedSections = sections.filter((s) => s.id !== section.id);

        setSections(updatedSections);
      } else {
        const updatedTasks = tasks.filter((t) => t.section !== null);
        setTasks(updatedTasks);
      }

      setShowDeleteConfirm(false);
    };

    return (
      <div>
        <div className="flex items-center gap-1 py-2">
          <button
            className={`p-1 hover:bg-gray-100 transition rounded-md ${
              !section.isCollapsed && "rotate-90"
            }`}
            onClick={() => toggleSection(section.id)}
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

        {!section.isCollapsed && (
          <Droppable key={section.id} droppableId={section.id.toString()}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="pl-8"
              >
                <ul>
                  {(groupedTasks[section.id] || []).map((task, index) => (
                    <li
                      key={task.id}
                      className="border-b border-gray-200 p-1 pl-0 flex items-center gap-3 cursor-pointer"
                    >
                      <TaskItem
                        task={task}
                        onCheckClick={() =>
                          onTaskUpdate({
                            ...task,
                            isCompleted: !task.isCompleted,
                          })
                        }
                        showShareOption={showShareOption}
                        setShowShareOption={setShowShareOption}
                        index={index}
                      />
                    </li>
                  ))}

                  {provided.placeholder}
                </ul>

                <SectionAddTask
                  section={section}
                  showAddTask={showAddTask}
                  setShowAddTask={setShowAddTask}
                />
              </div>
            )}
          </Droppable>
        )}
      </div>
    );
  };

  const toggleSection = (sectionId: number) => {
    setSections((prevSections) =>
      prevSections.map((s) =>
        s.id == sectionId ? { ...s, isCollapsed: !s.isCollapsed } : s
      )
    );
  };

  const onDragEnd = (result: DropResult) => {
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
      const newSections = Array.from(sections);
      const [reorderedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, reorderedSection);
      setSections(newSections);
    } else if (type === "task") {
      const sourceSection = source.droppableId;
      const destinationSection = destination.droppableId;

      if (sourceSection === destinationSection) {
        const newTasks = Array.from(groupedTasks[sourceSection]);
        const [reorderedTask] = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, reorderedTask);

        const newGroupedTasks = {
          ...groupedTasks,
          [sourceSection]: newTasks,
        };

        setTasks(Object.values(newGroupedTasks).flat());
      } else {
        const sourceTasks = Array.from(groupedTasks[sourceSection]);
        const destinationTasks = Array.from(groupedTasks[destinationSection]);
        const [movedTask] = sourceTasks.splice(source.index, 1);

        const updatedTask: Task = {
          ...movedTask,
          section: {
            ...movedTask.section!,
            id: parseInt(destinationSection),
            name:
              sections.find((s) => s.id.toString() === destinationSection)
                ?.name || "",
            project: movedTask.project!,
          },
        };

        destinationTasks.splice(destination.index, 0, updatedTask);

        const newGroupedTasks = {
          ...groupedTasks,
          [sourceSection]: sourceTasks,
          [destinationSection]: destinationTasks,
        };

        setTasks(Object.values(newGroupedTasks).flat());
      }
    }
  };

  const handleAddSection = (
    ev: FormEvent<HTMLFormElement>,
    positionIndex: number | null
  ) => {
    ev.preventDefault();

    if (activeProject && newSectionName.trim()) {
      const newSection: SectionType = {
        name: newSectionName.trim(),
        id: sections.length + 1,
        project: activeProject,
        isCollapsed: false,
      };

      setSections((prevSections) => {
        if (positionIndex !== null) {
          // Insert the new section at the specified position
          const updatedSections = [...prevSections];
          updatedSections.splice(positionIndex, 0, newSection);
          return updatedSections;
        } else {
          // Add the new section at the beginning
          return [newSection, ...prevSections];
        }
      });

      setNewSectionName("");
      setShowAddSection(null);
      setShowUngroupedAddSection(false);
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
                  {unGroupedTasks.map((task, index) => (
                    <li
                      key={task.id}
                      className="border-b border-gray-200 p-1 pl-0 flex items-center gap-3 cursor-pointer"
                    >
                      <TaskItem
                        task={task}
                        onCheckClick={() =>
                          onTaskUpdate({
                            ...task,
                            isCompleted: !task.isCompleted,
                          })
                        }
                        showShareOption={showShareOption}
                        setShowShareOption={setShowShareOption}
                        index={index}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </Droppable>

            <SectionAddTask
              showUngroupedAddTask={showUngroupedAddTask}
              setShowUngroupedAddTask={setShowUngroupedAddTask}
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

        {activeProjectSections?.map((section, index) => (
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
