"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Ellipsis,
  MessageSquare,
  SlidersHorizontal,
  UserPlus,
} from "lucide-react";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ProjectType, TaskType } from "@/types/project";
import { ViewTypes } from "@/types/viewTypes";
import DocsSidebar from "../SidebarWrapper/DocsSidebar";
import ShareOption from "./ShareOption";
import ViewOptions from "./ViewOptions";
import ActiveProjectMoreOptions from "./ActiveProjectMoreOptions";
import ProjectDeleteConfirm from "../SidebarWrapper/TasksSidebar/ProjectDeleteConfirm";
import ProjectArchiveConfirm from "../SidebarWrapper/TasksSidebar/ProjectArchiveConfirm";
import CommentOrActivityModal from "./CommentOrActivityModal";
import ExportCSVModal from "../SidebarWrapper/TasksSidebar/SidebarProjectMoreOptions/ExportCSVModal";
import ImportCSVModal from "../SidebarWrapper/TasksSidebar/SidebarProjectMoreOptions/ImportCSVModal";
import AddEditProject from "../AddEditProject";
import NoDueDate from "../TaskViewSwitcher/CalendarView/NoDueDate";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import SaveTemplateModal from "../SidebarWrapper/TasksSidebar/SidebarProjectMoreOptions/SaveTemplateModal";

const LayoutWrapper = ({
  children,
  headline,
  project,
  view,
  setView,
  showShareOption,
  setShowShareOption,
  hideCalendarView,
  setTasks,
  tasks,
  showNoDateTasks,
}: {
  children: React.ReactNode;
  headline: string;
  project?: ProjectType;
  view?: ViewTypes["view"];
  setView?: (value: ViewTypes["view"]) => void;
  showShareOption?: boolean;
  setShowShareOption?: Dispatch<SetStateAction<boolean>>;
  hideCalendarView?: boolean;
  setTasks?: (updatedTasks: TaskType[]) => void;
  tasks?: TaskType[];
  showNoDateTasks?: boolean;
}) => {
  const [modalState, setModalState] = useState({
    projectEdit: false,
    saveTemplate: false,
    showImportFromCSV: false,
    showExportAsCSV: false,
    showCommentOrActivity: null as "comment" | "activity" | null,
    showArchiveConfirm: false,
    showDeleteConfirm: false,
    editTitle: false,
    showViewOptions: false,
    showMoreOptions: false,
  });

  const [projectTitle, setProjectTitle] = useState<string>(
    project?.name || headline
  );

  const { setProjects, teams } = useTaskProjectDataProvider();

  const handleEditTitle = async () => {
    if (
      project &&
      projectTitle.trim().length &&
      project.name !== projectTitle.trim()
    ) {
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === project.id ? { ...p, name: projectTitle.trim() } : p
        )
      );

      const { error } = await supabaseBrowser
        .from("projects")
        .update({ name: projectTitle.trim() })
        .eq("id", project.id);

      if (error) console.log(error);
    }
    setModalState((prev) => ({ ...prev, editTitle: false }));
  };

  const toggleModal = (key: keyof typeof modalState, value: boolean | null) =>
    setModalState((prev) => ({ ...prev, [key]: value }));

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (tasks && setTasks && result.type == "calendarview_task") {
      if (result.source.droppableId == result.destination.droppableId) return;

      const reorderedTasks = Array.from(tasks);
      const [movedTask] = reorderedTasks.splice(result.source.index, 1);
      reorderedTasks.splice(result.destination.index, 0, movedTask);

      if (result.destination.droppableId == "no_date_tasks") {
        setTasks(
          reorderedTasks.map((t, index) =>
            t.id == result.draggableId
              ? { ...t, due_date: null, order: index }
              : { ...t, order: index }
          )
        );
      } else {
        setTasks(
          tasks.map((t, index) =>
            t.id == result.draggableId
              ? {
                  ...t,
                  due_date: result.destination?.droppableId as string,
                  order: index,
                }
              : { ...t, order: index }
          )
        );
      }
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className={`${view == "Calendar" && "flex overflow-x-hidden"} h-full`}
        >
          <div
            className={`flex flex-col h-full w-full flex-1 transition-all duration-300`}
          >
            {view && setView && (
              <div className="flex items-center justify-between p-4 py-3 sticky top-0 bg-backgrouond mb-1 z-10">
                {!["Today", "Inbox"].includes(headline) && (
                  <div>
                    {teams.find((t) => t.id === project?.team_id)?.name ??
                      "My Projects"}{" "}
                    / {project?.name}
                  </div>
                )}

                {/* {view == "List" && (
              <h1 className="font-bold text-base">{project?.name}</h1>
            )} */}

                <div className={`flex items-center justify-end flex-1`}>
                  <ul className="flex items-center">
                    {typeof setShowShareOption === "function" &&
                      headline !== "Today" && (
                        <li>
                          <button
                            className={`${
                              showShareOption
                                ? "bg-text-50"
                                : "hover:bg-primary-50"
                            } transition p-1 md:pr-3 rounded-lg cursor-pointer flex items-center gap-1`}
                            onClick={() => setShowShareOption(true)}
                          >
                            <UserPlus
                              strokeWidth={1.5}
                              className="w-5 h-5 text-text-500"
                            />
                            <span className="hidden md:inline-block">
                              Share
                            </span>
                          </button>
                        </li>
                      )}
                    <li>
                      <button
                        className={`${
                          modalState.showViewOptions
                            ? "bg-text-50"
                            : "hover:bg-primary-50"
                        } transition p-1 md:pr-3 rounded-lg cursor-pointer flex items-center gap-1`}
                        onClick={() => toggleModal("showViewOptions", true)}
                      >
                        <SlidersHorizontal
                          strokeWidth={1.5}
                          className="w-5 h-5 text-text-500"
                        />
                        <span className="hidden md:inline-block">View</span>
                      </button>
                    </li>
                    {headline !== "Today" && (
                      <li>
                        <button
                          className={`${
                            modalState.showMoreOptions
                              ? "bg-text-50"
                              : "hover:bg-primary-50"
                          } transition p-1 rounded-lg cursor-pointer`}
                          onClick={() => toggleModal("showMoreOptions", true)}
                        >
                          <Ellipsis
                            strokeWidth={1.5}
                            className="w-5 h-5 text-text-500"
                          />
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <div
              className={`flex-1 ${
                view === "List" && "max-w-4xl w-full mx-auto p-8 pt-0"
              }`}
            >
              <div className="flex flex-col h-full">
                <div
                  className={` ${
                    project && view !== "List" ? "pb-4" : "pl-3.5 pb-2"
                  } ${
                    view == "Board" ? "mx-8" : view == "Calendar" && "mx-3"
                  } ${!setView && "pt-8"}`}
                >
                  {project ? (
                    modalState.editTitle ? (
                      <input
                        type="text"
                        className="text-[26px] font-bold border border-text-300 w-full rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                        value={projectTitle}
                        onBlur={handleEditTitle}
                        autoFocus
                        onChange={(ev) => setProjectTitle(ev.target.value)}
                        onKeyDown={(ev) =>
                          ev.key === "Enter" && handleEditTitle()
                        }
                      />
                    ) : (
                      <h1
                        className="text-[26px] font-bold border border-transparent w-fit hover:w-full hover:border-text-200 rounded-lg p-1 py-[14px] cursor-text"
                        onClick={() => toggleModal("editTitle", true)}
                      >
                        {project.name}
                      </h1>
                    )
                  ) : (
                    <h1
                      className={`text-[26px] font-bold p-1 py-[14px] ${
                        (headline == "Filters & Labels" ||
                          headline == "Upcoming") &&
                        "mt-6"
                      }`}
                    >
                      {headline}
                    </h1>
                  )}
                </div>
                <div className={`flex-1`}>{children}</div>
              </div>
            </div>
          </div>

          {view == "Calendar" && project && tasks && setTasks && (
            <NoDueDate
              showNoDateTasks={showNoDateTasks}
              setTasks={setTasks}
              tasks={tasks}
              project={project}
            />
          )}
        </div>
      </DragDropContext>

      {showShareOption && setShowShareOption && (
        <ShareOption onClose={() => setShowShareOption(false)} />
      )}

      {modalState.showViewOptions && setView && (
        <ViewOptions
          onClose={() => toggleModal("showViewOptions", false)}
          hideCalendarView={hideCalendarView}
          view={view}
          setView={setView}
          setTasks={setTasks}
          tasks={tasks}
        />
      )}

      {modalState.showMoreOptions && project && (
        <ActiveProjectMoreOptions
          onClose={() => toggleModal("showMoreOptions", false)}
          project={project}
          stateActions={{
            setProjectEdit: (value) =>
              toggleModal("projectEdit", value as boolean),
            setSaveTemplate: (value) =>
              toggleModal("saveTemplate", value as boolean),
            setImportFromCSV: (value) =>
              toggleModal("showImportFromCSV", value as boolean),
            setExportAsCSV: (value) =>
              toggleModal("showExportAsCSV", value as boolean),
            setShowArchiveConfirm: (value) =>
              toggleModal("showArchiveConfirm", value as boolean),
            setShowDeleteConfirm: (value) =>
              toggleModal("showDeleteConfirm", value as boolean),
            setShowCommentOrActivity: (value) =>
              toggleModal("showCommentOrActivity", value as null),
          }}
        />
      )}

      {modalState.showDeleteConfirm && project && (
        <ProjectDeleteConfirm
          project={project}
          setShowDeleteConfirm={(value) =>
            toggleModal("showDeleteConfirm", value as boolean)
          }
        />
      )}

      {modalState.showArchiveConfirm && project && (
        <ProjectArchiveConfirm
          project={project}
          setShowArchiveConfirm={(value) =>
            toggleModal("showArchiveConfirm", value as boolean)
          }
        />
      )}

      {modalState.showCommentOrActivity && project && (
        <CommentOrActivityModal
          onClose={() => toggleModal("showCommentOrActivity", null)}
          showCommentOrActivity={modalState.showCommentOrActivity}
          setShowCommentOrActivity={(value) =>
            toggleModal("showCommentOrActivity", value as null)
          }
          project={project}
        />
      )}

      {modalState.saveTemplate && project && (
        <SaveTemplateModal
          onClose={() => toggleModal("saveTemplate", false)}
          project={project}
        />
      )}

      {modalState.showExportAsCSV && (
        <ExportCSVModal onClose={() => toggleModal("showExportAsCSV", false)} />
      )}
      {modalState.showImportFromCSV && (
        <ImportCSVModal
          onClose={() => toggleModal("showImportFromCSV", false)}
        />
      )}

      {modalState.projectEdit && (
        <AddEditProject
          onClose={() => toggleModal("projectEdit", false)}
          project={project}
        />
      )}
    </>
  );
};

export default LayoutWrapper;
