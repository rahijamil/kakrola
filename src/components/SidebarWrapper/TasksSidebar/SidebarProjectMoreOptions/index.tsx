import React, { Dispatch, RefObject, SetStateAction } from "react";
import { ArrowDown, ArrowUp, Heart, HeartOffIcon, Pencil } from "lucide-react";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType } from "@/types/project";
import DeleteOption from "./DeleteOption";
import ArchiveOption from "./ArchiveOption";
import ActivityLogOption from "./ActivityLogOption";
import ExportCSVOption from "./ExportCSVOption";
import ImportCSVOption from "./ImportCSVOption";
import CopyProjectLinkOption from "./CopyProjectLinkOption";
import { supabaseBrowser } from "@/utils/supabase/client";
import FavoriteOption from "./FavoriteOption";

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
    setAboveBellow,
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
    setAboveBellow: Dispatch<SetStateAction<"above" | "below" | null>>;
  };
}) => {
  return (
    <div>
      <div
        ref={dropdownRef}
        className="fixed z-20 w-60 bg-surface rounded-lg shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)] border border-text-200 py-1"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
        }}
      >
        <div>
          <button
            onClick={() => {
              setAboveBellow("above");
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-sm text-text-700 hover:bg-text-100 transition flex items-center"
          >
            <ArrowUp strokeWidth={1.5} className="w-4 h-4 mr-2" /> Add project
            above
          </button>
          <button
            onClick={() => {
              setAboveBellow("below");
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-sm text-text-700 hover:bg-text-100 transition flex items-center"
          >
            <ArrowDown strokeWidth={1.5} className="w-4 h-4 mr-2" /> Add project
            below
          </button>
        </div>
        <div className="h-[1px] bg-text-200 my-1"></div>
        <div>
          <button
            onClick={() => {
              setProjectEdit(true);
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-sm text-text-700 hover:bg-text-100 transition flex items-center"
          >
            <Pencil strokeWidth={1.5} className="w-4 h-4 mr-2" /> Edit
          </button>
          <FavoriteOption project={project} />
          {/* <button className="w-full text-left px-4 py-2 text-sm text-text-700 hover:bg-text-100 transition flex items-center">
            <CopyPlusIcon className="w-4 h-4 mr-2" /> Duplicate
          </button> */}
        </div>
        <div className="h-[1px] bg-text-200 my-1"></div>
        {/* <div>
          <button className="w-full text-left px-4 py-2 text-sm text-text-700 hover:bg-text-100 transition flex items-center">
            <UserPlusIcon className="w-4 h-4 mr-2" /> Share
          </button>
        </div>
        <div className="h-[1px] bg-text-200 my-1"></div> */}
        <div>
          <CopyProjectLinkOption
            onClose={onClose}
            project_slug={project.slug}
          />
        </div>
        {/* <div className="h-[1px] bg-text-200 my-1"></div>
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
        <div className="h-[1px] bg-text-200 my-1"></div>
        <div>
          <ActivityLogOption
            onClick={() => {
              setShowCommentOrActivity("activity");
              onClose();
            }}
          />
        </div>
        <div className="h-[1px] bg-text-200 my-1"></div> */}
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
