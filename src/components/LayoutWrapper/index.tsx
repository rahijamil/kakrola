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
import DocsSidebar from "../DocsSidebar";
import ShareOption from "./ShareOption";
import ViewOptions from "./ViewOptions";
import ActiveProjectMoreOptions from "./ActiveProjectMoreOptions";
import ProjectDeleteConfirm from "../Sidebar/ProjectDeleteConfirm";
import ProjectArchiveConfirm from "../Sidebar/ProjectArchiveConfirm";
import CommentOrActivityModal from "./CommentOrActivityModal";
import ExportCSVModal from "../Sidebar/SidebarProjectMoreOptions/ExportCSVModal";
import ImportCSVModal from "../Sidebar/SidebarProjectMoreOptions/ImportCSVModal";
import AddEditProject from "../AddEditProject";

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
}) => {
  const [modalState, setModalState] = useState({
    projectEdit: false,
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

  return (
    <>
      {headline === "Docs" && <DocsSidebar />}

      <div className="flex flex-col h-full w-full">
        {view && setView && (
          <div className="flex items-center justify-between p-4">
            {!["Today", "Inbox"].includes(headline) && (
              <div>
                {teams.find((t) => t.id === project?.team_id)?.name ??
                  "My Projects"}{" "}
                /
              </div>
            )}
            <div className="flex-1 flex items-center justify-end">
              <ul className="flex items-center relative">
                {typeof setShowShareOption === "function" &&
                  headline !== "Today" && (
                    <li>
                      <button
                        className={`${
                          showShareOption ? "bg-gray-100" : "hover:bg-gray-100"
                        } transition p-1 pr-3 rounded-md cursor-pointer flex items-center gap-1`}
                        onClick={() => setShowShareOption(true)}
                      >
                        <UserPlus
                          strokeWidth={1.5}
                          className="w-5 h-5 text-gray-500"
                        />
                        Share
                      </button>
                      {showShareOption && (
                        <ShareOption
                          onClose={() => setShowShareOption(false)}
                        />
                      )}
                    </li>
                  )}
                <li>
                  <button
                    className={`${
                      modalState.showViewOptions
                        ? "bg-gray-100"
                        : "hover:bg-gray-100"
                    } transition p-1 pr-3 rounded-md cursor-pointer flex items-center gap-1`}
                    onClick={() => toggleModal("showViewOptions", true)}
                  >
                    <SlidersHorizontal
                      strokeWidth={1.5}
                      className="w-5 h-5 text-gray-500"
                    />
                    View
                  </button>
                  {modalState.showViewOptions && (
                    <ViewOptions
                      onClose={() => toggleModal("showViewOptions", false)}
                      hideCalendarView={hideCalendarView}
                      view={view}
                      setView={setView}
                      setTasks={setTasks}
                      tasks={tasks}
                    />
                  )}
                </li>
                {headline !== "Today" && (
                  <li>
                    <button
                      className={`${
                        modalState.showMoreOptions
                          ? "bg-gray-100"
                          : "hover:bg-gray-100"
                      } transition p-1 rounded-md cursor-pointer`}
                      onClick={() => toggleModal("showMoreOptions", true)}
                    >
                      <Ellipsis
                        strokeWidth={1.5}
                        className="w-5 h-5 text-gray-500"
                      />
                    </button>
                    {modalState.showMoreOptions && project && (
                      <ActiveProjectMoreOptions
                        onClose={() => toggleModal("showMoreOptions", false)}
                        project={project}
                        stateActions={{
                          setProjectEdit: (value) =>
                            toggleModal("projectEdit", value as boolean),
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
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        <div
          className={`flex-1 ${
            view !== "Board" && "max-w-4xl w-full mx-auto p-8 pt-0"
          }`}
        >
          <div className="flex flex-col h-full">
            <div
              className={`${project && view === "Board" ? "pb-4" : "pl-3.5"} ${
                view === "Board" && "mx-8"
              } ${!setView && "pt-8"}`}
            >
              {project ? (
                modalState.editTitle ? (
                  <input
                    type="text"
                    className="text-[26px] font-bold border border-gray-300 w-full rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                    value={projectTitle}
                    onBlur={handleEditTitle}
                    autoFocus
                    onChange={(ev) => setProjectTitle(ev.target.value)}
                    onKeyDown={(ev) => ev.key === "Enter" && handleEditTitle()}
                  />
                ) : (
                  <h1
                    className="text-[26px] font-bold border border-transparent w-fit hover:w-full hover:border-gray-200 rounded-md p-1 py-[14px] cursor-text"
                    onClick={() => toggleModal("editTitle", true)}
                  >
                    {project.name}
                  </h1>
                )
              ) : (
                <h1 className="text-[26px] font-bold p-1 py-[14px]">
                  {headline}
                </h1>
              )}
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>

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
