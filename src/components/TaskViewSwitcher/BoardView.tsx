import { SectionType, Task } from "@/types/project";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";
import SectionAddTask from "./SectionAddTask";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import {
  ArchiveBoxArrowDownIcon,
  ArrowRightCircleIcon,
  EllipsisHorizontalIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { CopyPlusIcon } from "lucide-react";

const BoardView = ({
  activeProjectSections,
  groupedTasks,
  unGroupedTasks,
  onTaskUpdate,
  showAddTask,
  setShowAddTask,
  showUngroupedAddSection,
  setShowUngroupedAddSection,
  showUngroupedAddTask,
  setShowUngroupedAddTask,
  setShowShareOption,
  showShareOption,
}: {
  activeProjectSections: SectionType[];
  groupedTasks: Record<string, Task[]>;
  unGroupedTasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
  showAddTask: number | null;
  setShowAddTask: Dispatch<SetStateAction<number | null>>;
  showUngroupedAddTask: boolean;
  setShowUngroupedAddTask: Dispatch<SetStateAction<boolean>>;
  showUngroupedAddSection: boolean;
  setShowUngroupedAddSection: Dispatch<SetStateAction<boolean>>;
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [showAddSection, setShowAddSection] = useState<number | null>(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [mouseOnAddSection, setMouseOnAddSection] = useState<boolean>(false);
  const [showSectionMoreOptions, setShowSectionMoreOptions] = useState<
    SectionType | "ungrouped" | null
  >(null);
  const { sections, setSections, activeProject } = useTaskProjectDataProvider();

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceSection = source.droppableId;
    const destSection = destination.droppableId;

    if (sourceSection !== destSection) {
      const task = groupedTasks[sourceSection][source.index];
      const updatedTask = {
        ...task,
        section: {
          id: 0,
          name: destSection,
          project_id: task.project?.id || 0,
        },
      };
      // onTaskUpdate(updatedTask);
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
      };

      setSections((prevSections) => {
        if (positionIndex !== null) {
          // Insert the new section at the specified position
          const updatedSections = [...prevSections];
          updatedSections.splice(positionIndex, 0, newSection);
          return updatedSections;
        } else {
          // Add the new section at the beginning
          return [...prevSections, newSection];
        }
      });

      setNewSectionName("");
      setShowAddSection(null);
      setShowUngroupedAddSection(false);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={`flex overflow-x-auto space-x-2 p-8 pt-0 h-full`}>
        <>
          <Droppable droppableId={"ungrouped"}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 p-2 pl-4 rounded-lg min-w-[300px] h-fit"
              >
                <div className="mb-2 flex justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold ">(No section)</h3>

                    <p className="text-sm text-gray-600">
                      {(unGroupedTasks || []).length}
                    </p>
                  </div>

                  <div className="relative">
                    <button
                      className={`p-1 transition rounded-md ${
                        showSectionMoreOptions == "ungrouped"
                          ? "bg-gray-200"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={() => setShowSectionMoreOptions("ungrouped")}
                    >
                      <EllipsisHorizontalIcon className="w-5 h-5 text-gray-700" />
                    </button>

                    {showSectionMoreOptions == "ungrouped" && (
                      <>
                        <div className="absolute bg-white drop-shadow-md rounded-md border border-gray-200 top-full left-1/2 -translate-x-1/2 z-20 w-72 py-1">
                          <div>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                              <PencilIcon className="w-4 h-4 mr-4" /> Edit
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                              <ArrowRightCircleIcon className="w-5 h-5 mr-4" />{" "}
                              Move to...
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                              <CopyPlusIcon className="w-4 h-4 mr-4" />{" "}
                              Duplicate
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

                <div className="space-y-2">
                  {(unGroupedTasks || []).map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="rounded shadow-sm hover:shadow-md transition"
                        >
                          <TaskItem
                            task={task}
                            onCheckClick={() =>
                              onTaskUpdate({
                                ...task,
                                isCompleted: !task.isCompleted,
                              })
                            }
                            setShowShareOption={setShowShareOption}
                            showShareOption={showShareOption}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>

                <SectionAddTask
                  showUngroupedAddTask={showUngroupedAddTask}
                  setShowUngroupedAddTask={setShowUngroupedAddTask}
                  isSmall
                />
              </div>
            )}
          </Droppable>

          <div>
            {!showUngroupedAddSection && (
              <>
                {sections.length == 0 ? (
                  <div className="bg-gray-100 p-3 py-2 rounded-lg min-w-[300px] h-fit ml-5">
                    <button
                      className="text-gray-500 hover:text-gray-700 flex items-center gap-1 w-full group py-1 whitespace-nowrap"
                      onClick={() => setShowUngroupedAddSection(true)}
                      onMouseOver={() => setMouseOnAddSection(true)}
                      onMouseOut={() => setMouseOnAddSection(false)}
                    >
                      {mouseOnAddSection ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M19.5 20a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15zM18 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12zm-6 3a.5.5 0 0 0-.5.5v2h-2a.5.5 0 0 0-.492.41L9 12a.5.5 0 0 0 .5.5h2v2a.5.5 0 0 0 .41.492L12 15a.5.5 0 0 0 .5-.5v-2h2a.5.5 0 0 0 .492-.41L15 12a.5.5 0 0 0-.5-.5h-2v-2a.5.5 0 0 0-.41-.492zm7.5-6a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M19.5 20a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15zM18 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12zm0 1H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-6 2a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 12 9zm7.5-6a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15z"
                          ></path>
                        </svg>
                      )}

                      <span>Add section</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative w-3 h-full group cursor-pointer">
                    <div
                      className="absolute -left-[6px] flex-col items-center max-w-6 gap-2 hidden group-hover:flex cursor-pointer transition whitespace-nowrap h-full"
                      onClick={() => setShowUngroupedAddSection(true)}
                    >
                      <div className="flex-1 bg-gray-400 w-[1px]"></div>
                      <div className="font-bold text-gray-600 text-sm">
                        Add section
                      </div>
                      <div className="flex-1 bg-gray-500 w-[1px]"></div>
                    </div>
                  </div>
                )}
              </>
            )}

            {showUngroupedAddSection && (
              <form
                className="space-y-2 min-w-[300px] mx-5"
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
        </>

        {activeProjectSections.map((section, index) => (
          <>
            <Droppable key={section.id} droppableId={section.id.toString()}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-2 pl-4 rounded-lg min-w-[300px] h-fit"
                >
                  <div className="mb-2 flex justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold ">{section.name}</h3>

                      <p className="text-sm text-gray-600">
                        {(groupedTasks[section.id] || []).length}
                      </p>
                    </div>

                    <div className="relative">
                      <button
                        className={`p-1 transition rounded-md ${
                          (showSectionMoreOptions as SectionType)?.id ==
                          section.id
                            ? "bg-gray-200"
                            : "hover:bg-gray-200"
                        }`}
                        onClick={() => setShowSectionMoreOptions(section)}
                      >
                        <EllipsisHorizontalIcon className="w-5 h-5 text-gray-700" />
                      </button>

                      {(showSectionMoreOptions as SectionType)?.id ==
                        section.id && (
                        <>
                          <div className="absolute bg-white drop-shadow-md rounded-md border border-gray-200 top-full left-1/2 -translate-x-1/2 z-20 w-72 py-1">
                            <div>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                                <PencilIcon className="w-4 h-4 mr-4" /> Edit
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                                <ArrowRightCircleIcon className="w-5 h-5 mr-4" />{" "}
                                Move to...
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                                <CopyPlusIcon className="w-4 h-4 mr-4" />{" "}
                                Duplicate
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                                <LinkIcon className="w-4 h-4 mr-4" /> Copy link
                                to section
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
                  <div className="space-y-2">
                    {(groupedTasks[section.id] || []).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="rounded shadow-sm hover:shadow-md transition"
                          >
                            <TaskItem
                              task={task}
                              onCheckClick={() =>
                                onTaskUpdate({
                                  ...task,
                                  isCompleted: !task.isCompleted,
                                })
                              }
                              setShowShareOption={setShowShareOption}
                              showShareOption={showShareOption}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                  <SectionAddTask
                    section={section}
                    showAddTask={showAddTask}
                    setShowAddTask={setShowAddTask}
                    isSmall
                  />
                </div>
              )}
            </Droppable>

            <div>
              {showAddSection !== section.id && (
                <>
                  {activeProjectSections.length - 1 == index ? (
                    <div className="bg-gray-100 p-3 py-2 rounded-lg min-w-[300px] h-fit ml-5">
                      <button
                        className="text-gray-500 hover:text-gray-700 flex items-center gap-1 w-full group py-1 whitespace-nowrap"
                        onClick={() => setShowAddSection(section.id)}
                        onMouseOver={() => setMouseOnAddSection(true)}
                        onMouseOut={() => setMouseOnAddSection(false)}
                      >
                        {mouseOnAddSection ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M19.5 20a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15zM18 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12zm-6 3a.5.5 0 0 0-.5.5v2h-2a.5.5 0 0 0-.492.41L9 12a.5.5 0 0 0 .5.5h2v2a.5.5 0 0 0 .41.492L12 15a.5.5 0 0 0 .5-.5v-2h2a.5.5 0 0 0 .492-.41L15 12a.5.5 0 0 0-.5-.5h-2v-2a.5.5 0 0 0-.41-.492zm7.5-6a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M19.5 20a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15zM18 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12zm0 1H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-6 2a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 12 9zm7.5-6a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15z"
                            ></path>
                          </svg>
                        )}

                        <span>Add section</span>
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-3 h-full group cursor-pointer">
                      <div
                        className="absolute -left-[36px] flex-col items-center gap-2 hidden group-hover:flex cursor-pointer transition whitespace-nowrap h-full"
                        onClick={() => setShowAddSection(section.id)}
                      >
                        <div className="flex-1 bg-gray-400 w-[1px]"></div>
                        <div className="font-bold text-gray-600 text-sm">
                          Add section
                        </div>
                        <div className="flex-1 bg-gray-500 w-[1px]"></div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {showAddSection == section.id && (
                <form
                  className="space-y-2 min-w-[300px] mx-5"
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
          </>
        ))}
      </div>
    </DragDropContext>
  );
};

export default BoardView;
