"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ProjectType, TaskType } from "@/types/project";
import { ViewTypes } from "@/types/viewTypes";
import DocsSidebar from "../SidebarWrapper/DocsSidebar";
import ShareOption from "./ShareOption";
import ViewOptions from "./ViewOptions";
import ActiveProjectMoreOptions from "./ActiveProjectMoreOptions";
import ProjectDeleteConfirm from "../SidebarWrapper/Sidebar/ProjectDeleteConfirm";
import ProjectArchiveConfirm from "../SidebarWrapper/Sidebar/ProjectArchiveConfirm";
import CommentOrActivityModal from "./CommentOrActivityModal";
import ExportCSVModal from "../SidebarWrapper/Sidebar/SidebarProjectMoreOptions/ExportCSVModal";
import ImportCSVModal from "../SidebarWrapper/Sidebar/SidebarProjectMoreOptions/ImportCSVModal";
import AddEditProject from "../AddEditProject";
import NoDueDate from "../TaskViewSwitcher/CalendarView/NoDueDate";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import SaveTemplateModal from "../SidebarWrapper/Sidebar/SidebarProjectMoreOptions/SaveTemplateModal";
import LayoutView from "../LayoutView";
import Link from "next/link";
import { useGlobalOption } from "@/context/GlobalOptionContext";

const LayoutWrapper = ({
  children,
  headline,
  project,
  view,
  setView,
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
    editTitleInListView: false,
  });

  const [projectTitle, setProjectTitle] = useState<string>(
    project?.name || headline
  );

  const { setProjects, teams } = useTaskProjectDataProvider();
  const { setShowShareOption, showShareOption } = useGlobalOption();

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
    setModalState((prev) => ({
      ...prev,
      editTitle: false,
      editTitleInListView: false,
    }));
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
              <div className="flex items-center justify-between p-4 py-3 sticky top-0 bg-background mb-1 z-10">
                {!["Today", "Inbox"].includes(headline) && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center w-64 whitespace-nowrap">
                      <Link
                        href={`/app/projects`}
                        className="hover:bg-text-100 p-1 py-0.5 rounded-full transition-colors"
                      >
                        {teams.find((t) => t.id === project?.team_id)?.name ??
                          "My Projects"}
                      </Link>
                      <span className="text-text-400">/</span>
                      {project ? (
                        modalState.editTitle ? (
                          <input
                            type="text"
                            className="font-semibold border border-text-300 rounded-full p-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 bg-transparent"
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
                            className="font-semibold border border-transparent hover:border-text-200 rounded-full w-full p-1 py-0.5 cursor-text inline-block overflow-hidden text-ellipsis"
                            onClick={() => toggleModal("editTitle", true)}
                          >
                            {project.name}
                          </h1>
                        )
                      ) : (
                        <h1
                          className={`font-semibold inline-block overflow-hidden text-ellipsis p-1 py-0.5 ${
                            (headline == "Filters & Labels" ||
                              headline == "Upcoming") &&
                            "mt-6"
                          }`}
                        >
                          {headline}
                        </h1>
                      )}
                    </div>

                    <div>
                      {project && (
                        <LayoutView
                          view={view}
                          setView={setView}
                          project={project}
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className={`flex items-center justify-end flex-1`}>
                  <ul className="flex items-center">
                    {typeof setShowShareOption === "function" &&
                      headline !== "Today" && (
                        <li>
                          <ShareOption
                            showShareOption={showShareOption!}
                            setShowShareOption={setShowShareOption}
                            projectId={project?.id}
                            teamId={project?.team_id}
                          />
                        </li>
                      )}
                    <li>
                      <ViewOptions
                        hideCalendarView={hideCalendarView}
                        view={view}
                        setView={setView}
                        setTasks={setTasks}
                        tasks={tasks}
                      />
                    </li>
                    {headline !== "Today" && (
                      <li>
                        {project && (
                          <ActiveProjectMoreOptions
                            project={project}
                            stateActions={{
                              setProjectEdit: (value) =>
                                toggleModal("projectEdit", value as boolean),
                              setSaveTemplate: (value) =>
                                toggleModal("saveTemplate", value as boolean),
                              setImportFromCSV: (value) =>
                                toggleModal(
                                  "showImportFromCSV",
                                  value as boolean
                                ),
                              setExportAsCSV: (value) =>
                                toggleModal(
                                  "showExportAsCSV",
                                  value as boolean
                                ),
                              setShowArchiveConfirm: (value) =>
                                toggleModal(
                                  "showArchiveConfirm",
                                  value as boolean
                                ),
                              setShowDeleteConfirm: (value) =>
                                toggleModal(
                                  "showDeleteConfirm",
                                  value as boolean
                                ),
                              setShowCommentOrActivity: (value) =>
                                toggleModal(
                                  "showCommentOrActivity",
                                  value as null
                                ),
                            }}
                          />
                        )}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <div
              className={`flex-1 ${
                view === "List" && !project && "max-w-4xlw-fullmx-auto p-8 pt-0"
              }`}
            >
              <div className="flex flex-col h-full">
                {view == "List" && (
                  <div
                    className={`${
                      project && view !== "List" ? "pb-4 mt-4" : "pl-3.5 pb-2"
                    } ${!setView && "pt-8"}`}
                  >
                    {project ? (
                      <>
                        {/* {modalState.editTitleInListView ? (
                          <input
                            type="text"
                            className="text-[26px] font-bold border border-text-300 w-full rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
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
                            className="text-[26px] font-bold border border-transparent w-fit hover:w-full hover:border-text-200 rounded-full p-1 py-[14px] cursor-text"
                            onClick={() =>
                              toggleModal("editTitleInListView", true)
                            }
                          >
                            {project.name}
                          </h1>
                        )} */}
                      </>
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
                )}
                <div className={`flex-1 ${view !== "List" && "pt-4"}`}>
                  {children}
                </div>
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
