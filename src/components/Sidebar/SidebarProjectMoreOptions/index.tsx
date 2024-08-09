import React, { Dispatch, RefObject, SetStateAction, useState } from "react";
import {
  ArrowDownIcon,
  ArrowDownTrayIcon,
  ArrowUpIcon,
  ArrowUpTrayIcon,
  HeartIcon,
  LinkIcon,
  PencilIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { CopyPlusIcon, HeartOffIcon, LogsIcon } from "lucide-react";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType } from "@/types/project";
import DeleteOption from "./DeleteOption";
import ArchiveOption from "./ArchiveOption";
import ActivityLogOption from "./ActivityLogOption";
import ExportCSVOption from "./ExportCSVOption";
import ImportCSVOption from "./ImportCSVOption";
import CopyProjectLinkOption from "./CopyProjectLinkOption";
import { supabaseBrowser } from "@/utils/supabase/client";

const SidebarProjectMoreOptions = ({
  onClose,
  project,
  dropdownRef,
  dropdownPosition,
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
  dropdownRef: RefObject<HTMLDivElement>;
  dropdownPosition: {
    top: number;
    left: number;
  };

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
  const { projects, setProjects } = useTaskProjectDataProvider();

  const handleFavorite = async () => {
    const updatedProjects = projects.map((p) => {
      if (p.id === project.id) {
        return { ...p, is_favorite: !p.is_favorite };
      }
      return p;
    });

    setProjects(updatedProjects);

    const { error } = await supabaseBrowser
      .from("projects")
      .update({ is_favorite: !project.is_favorite })
      .eq("id", project.id);

    if (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div
        ref={dropdownRef}
        className="fixed z-20 w-60 bg-white rounded-md drop-shadow-md border border-gray-200 py-1"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
        }}
      >
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <ArrowUpIcon className="w-4 h-4 mr-2" /> Add project above
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <ArrowDownIcon className="w-4 h-4 mr-2" /> Add project bellow
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button
            onClick={() => {
              setProjectEdit(true);
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
          >
            <PencilIcon className="w-4 h-4 mr-2" /> Edit
          </button>
          <button
            onClick={handleFavorite}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
          >
            {project.is_favorite ? (
              <HeartOffIcon className="w-4 h-4 mr-4" />
            ) : (
              <HeartIcon className="w-4 h-4 mr-4" />
            )}{" "}
            {project?.is_favorite
              ? "Remove from favorites"
              : "Add to favorites"}
          </button>
          {/* <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <CopyPlusIcon className="w-4 h-4 mr-2" /> Duplicate
          </button> */}
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        {/* <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <UserPlusIcon className="w-4 h-4 mr-2" /> Share
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div> */}
        <div>
          <CopyProjectLinkOption
            onClose={onClose}
            project_slug={project.slug}
          />
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
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
        </div>
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
    </div>
  );
};

export default SidebarProjectMoreOptions;
