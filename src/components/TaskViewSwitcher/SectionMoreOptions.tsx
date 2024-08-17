import {
  ArchiveBoxArrowDownIcon,
  ArrowRightCircleIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { CopyPlusIcon } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { TaskType } from "@/types/project";

const SectionMoreOptions = ({
  onClose,
  column,
  setEditColumnTitle,
  setShowDeleteConfirm,
  setShowArchiveConfirm,
}: {
  onClose: () => void;
  column: {
    id: string;
    title: string;
    tasks: TaskType[];
    is_archived?: boolean;
  } | null;
  setEditColumnTitle: Dispatch<SetStateAction<boolean>>;
  setShowDeleteConfirm: Dispatch<
    SetStateAction<{
      id: string;
      title: string;
    } | null>
  >;
  setShowArchiveConfirm: Dispatch<
    SetStateAction<{
      id: string;
      title: string;
      tasks: TaskType[];
    } | null>
  >;
}) => {
  return (
    <>
      <div className="absolute bg-white drop-shadow-md rounded-md border border-gray-200 top-full left-1/2 -translate-x-1/2 z-20 w-72 py-1">
        {!column?.is_archived && (
          <>
            <div>
              <button
                onClick={() => {
                  setEditColumnTitle(true);
                  onClose();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
              >
                <PencilIcon className="w-4 h-4 mr-4" /> Edit
              </button>
              {/* <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <ArrowRightCircleIcon className="w-5 h-5 mr-4" /> Move to...
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <CopyPlusIcon className="w-4 h-4 mr-4" /> Duplicate
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <LinkIcon className="w-4 h-4 mr-4" /> Copy link to section
          </button> */}
            </div>
            <div className="h-[1px] bg-gray-100 my-1"></div>
          </>
        )}
        <div>
          <button
            onClick={() => {
              setShowArchiveConfirm(column);
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
          >
            <ArchiveBoxArrowDownIcon className="w-4 h-4 mr-4" />{" "}
            {column?.is_archived ? "Unarchive" : "Archive"}
          </button>
          <button
            onClick={() => {
              setShowDeleteConfirm(column);
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition flex items-center"
          >
            <TrashIcon className="w-4 h-4 mr-4" /> Delete
          </button>
        </div>
      </div>

      <div
        className="fixed top-0 left-0 bottom-0 right-0 z-10"
        onClick={onClose}
      ></div>
    </>
  );
};

export default SectionMoreOptions;
