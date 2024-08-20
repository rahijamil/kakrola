import { CopyPlusIcon, Heart, HeartOffIcon, PencilLine } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import { ProjectType } from "@/types/project";
import DeleteOption from "../Sidebar/SidebarProjectMoreOptions/DeleteOption";
import ArchiveOption from "../Sidebar/SidebarProjectMoreOptions/ArchiveOption";
import ActivityLogOption from "../Sidebar/SidebarProjectMoreOptions/ActivityLogOption";
import ImportCSVOption from "../Sidebar/SidebarProjectMoreOptions/ImportCSVOption";
import ExportCSVOption from "../Sidebar/SidebarProjectMoreOptions/ExportCSVOption";
import CopyProjectLinkOption from "../Sidebar/SidebarProjectMoreOptions/CopyProjectLinkOption";
import CommentOrActivityModal from "./CommentOrActivityModal";
import ExportCSVModal from "../Sidebar/SidebarProjectMoreOptions/ExportCSVModal";
import ImportCSVModal from "../Sidebar/SidebarProjectMoreOptions/ImportCSVModal";
import AddEditProject from "../AddEditProject";
import ProjectDeleteConfirm from "../Sidebar/ProjectDeleteConfirm";
import ProjectArchiveConfirm from "../Sidebar/ProjectArchiveConfirm";
import FavoriteOption from "../Sidebar/SidebarProjectMoreOptions/FavoriteOption";

const ActiveProjectMoreOptions = ({
  onClose,
  project,
  stateActions: {
    setShowDeleteConfirm,
    setShowArchiveConfirm,
    setShowCommentOrActivity,
    setExportAsCSV,
    setImportFromCSV,
    setProjectEdit,
  },
}: {
  onClose: () => void;
  project: ProjectType;
  stateActions: {
    setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
    setShowArchiveConfirm: Dispatch<SetStateAction<boolean>>;
    setShowCommentOrActivity: Dispatch<
      SetStateAction<"comment" | "activity" | null>
    >;
    setExportAsCSV: Dispatch<SetStateAction<boolean>>;
    setImportFromCSV: Dispatch<SetStateAction<boolean>>;
    setProjectEdit: Dispatch<SetStateAction<boolean>>;
  };
}) => {
  return (
    <>
      <div className="absolute bg-white rounded-lg border border-gray-200 top-11 right-4 z-20 w-60 py-1 shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)]">
        <div>
          <button
            onClick={() => {
              setProjectEdit(true);
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
          >
            <PencilLine strokeWidth={1.5} className="w-4 h-4 mr-2" /> Edit
          </button>
          <FavoriteOption project={project} />
          {/* <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <CopyPlusIcon className="w-4 h-4 mr-4" /> Duplicate
          </button> */}
          {/* <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <span className="w-5 h-5 mr-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19.5 20a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15zM18 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12zm0 1H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-6 2a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 12 9zm7.5-6a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15z"
                ></path>
              </svg>
            </span>{" "}
            Add section
          </button> */}
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <CopyProjectLinkOption
            onClose={onClose}
            project_slug={project.slug}
          />
        </div>
        {/* <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <ImportCSVOption
            onClick={() => {
              setImportFromCSV(true);
              onClose();
            }}
          />
          <ExportCSVOption
            onClick={() => {
              setExportAsCSV(true);
              onClose();
            }}
          />
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <ActivityLogOption
            onClick={() => {
              setShowCommentOrActivity("activity");
              onClose();
            }}
          />
        </div> */}
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <ArchiveOption
            onClick={() => {
              setShowArchiveConfirm(true);
              onClose();
            }}
          />
          <DeleteOption
            onClick={() => {
              setShowDeleteConfirm(true);
              onClose();
            }}
          />
        </div>
      </div>

      <div
        className="fixed top-0 left-0 bottom-0 right-0 z-10"
        onClick={onClose}
      ></div>
    </>
  );
};

export default ActiveProjectMoreOptions;
