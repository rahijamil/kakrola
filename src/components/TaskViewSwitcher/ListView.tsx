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
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import SectionAddTask from "./SectionAddTask";
import { CopyPlusIcon, MoreHorizontal } from "lucide-react";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

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
  const [newSectionName, setNewSectionName] = useState("");
  const [showAddSection, setShowAddSection] = useState<number | null>(null);
  const { sections, setSections, activeProject, setTasks } =
    useTaskProjectDataProvider();

  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  const ListViewSection = ({ section }: { section: SectionType }) => {
    const isOpen = openSections[section.id];

    return (
      <div>
        <div className="flex items-center gap-1 py-2">
          <button
            className={`p-1 hover:bg-gray-100 transition rounded-md ${
              isOpen && "rotate-90"
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
                <>
                  <div className="absolute bg-white drop-shadow-md rounded-md border border-gray-200 top-full right-0 z-20 w-72 py-1">
                    <div>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                        <PencilIcon className="w-4 h-4 mr-4" /> Edit
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                        <ArrowRightCircleIcon className="w-5 h-5 mr-4" /> Move
                        to...
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                        <CopyPlusIcon className="w-4 h-4 mr-4" /> Duplicate
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                        <LinkIcon className="w-4 h-4 mr-4" /> Copy link to
                        section
                      </button>
                    </div>
                    <div className="h-[1px] bg-gray-100 my-1"></div>
                    <div>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                        <ArchiveBoxArrowDownIcon className="w-4 h-4 mr-4" />{" "}
                        Archive
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition flex items-center">
                        <TrashIcon className="w-4 h-4 mr-4" /> Delete
                      </button>
                    </div>
                  </div>

                  <div
                    className="fixed top-0 left-0 bottom-0 right-0 z-10"
                    onClick={() => setShowSectionMoreOptions(null)}
                  ></div>
                </>
              )}
            </div>
          </div>
        </div>

        {isOpen && (
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
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
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

      setOpenSections((prevOpenSections) => ({
        ...prevOpenSections,
        [newSection.id]: true,
      }));

      setNewSectionName("");
      setShowAddSection(null);
      setShowUngroupedAddSection(false);
    }
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

        const updatedTask = {
          ...movedTask,
          section: {
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
            <ul>
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
                    className="px-2 py-[6px] text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-600 disabled:cursor-not-allowed transition disabled:opacity-50"
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
          <div className="space-y-1">
            <ListViewSection key={section.id} section={section} />

            <div>
              {!showAddSection && (
                <div
                  className="flex items-center gap-2 pl-7 opacity-0 hover:opacity-100 cursor-pointer transition"
                  onClick={() => setShowAddSection(section.id)}
                >
                  <div className="flex-1 bg-gray-400 h-[1px]"></div>
                  <div className="font-bold text-gray-600 text-sm">
                    Add section
                  </div>
                  <div className="flex-1 bg-gray-500 h-[1px]"></div>
                </div>
              )}

              {showAddSection == section.id && (
                <form
                  className="space-y-2 pl-7"
                  onSubmit={(ev) => handleAddSection(ev, index + 1)}
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
                      className="px-2 py-[6px] text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-600 disabled:cursor-not-allowed transition disabled:opacity-50"
                      disabled={!newSectionName.trim()}
                    >
                      Add section
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAddSection(null)}
                      className="px-3 py-[6px] text-xs text-gray-600 transition bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default ListView;
