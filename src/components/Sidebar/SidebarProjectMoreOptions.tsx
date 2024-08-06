import React, { RefObject, useState } from "react";
import {
  ArchiveBoxArrowDownIcon,
  ArrowDownIcon,
  ArrowDownTrayIcon,
  ArrowUpIcon,
  ArrowUpTrayIcon,
  HeartIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { CopyPlusIcon, HeartOffIcon, LogsIcon } from "lucide-react";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType } from "@/types/project";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import { useRouter } from "next/navigation";

const SidebarProjectMoreOptions = ({
  onClose,
  project,
  dropdownRef,
  dropdownPosition,
}: {
  onClose: () => void;
  project: ProjectType;
  dropdownRef: RefObject<HTMLDivElement>;
  dropdownPosition: {
    top: number;
    left: number;
  };
}) => {
  const {
    tasks,
    projects,
    setProjects,
    setTasks,
    sections,
    setSections,
    activeProject,
  } = useTaskProjectDataProvider();

  const router = useRouter();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleProjectDelete = () => {
    const updatedTasks = tasks.filter((t) => t.project?.id !== project.id);
    setTasks(updatedTasks);

    const updatedSections = sections.filter((s) => s.projectId !== project.id);
    setSections(updatedSections);

    const updatedProjects = projects.filter((proj) => proj.id !== project.id);
    setProjects(updatedProjects);

    if (activeProject?.id == project.id) {
      router.replace(`/app`);
    }
  };

  const handleFavorite = () => {
    const updatedProjects = projects.map((p) => {
      if (p.id === activeProject?.id) {
        return { ...p, isFavorite: !p.isFavorite };
      }
      return p;
    });
    setProjects(updatedProjects);
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
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <PencilIcon className="w-4 h-4 mr-2" /> Edit
          </button>
          <button
            onClick={handleFavorite}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
          >
            {activeProject?.isFavorite ? (
              <HeartOffIcon className="w-4 h-4 mr-4" />
            ) : (
              <HeartIcon className="w-4 h-4 mr-4" />
            )}{" "}
            {activeProject?.isFavorite
              ? "Remove from favorites"
              : "Add to favorites"}
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <CopyPlusIcon className="w-4 h-4 mr-2" /> Duplicate
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <UserPlusIcon className="w-4 h-4 mr-2" /> Share
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <LinkIcon className="w-4 h-4 mr-2" /> Copy project link
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Import from CSV
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <ArrowUpTrayIcon className="w-4 h-4 mr-2" /> Export as CSV
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <LogsIcon className="w-4 h-4 mr-2" /> Activity log
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <ArchiveBoxArrowDownIcon className="w-4 h-4 mr-2" /> Archive
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition flex items-center"
          >
            <TrashIcon className="w-4 h-4 mr-2" /> Delete
          </button>
        </div>
      </div>

      <div
        className="fixed top-0 left-0 bottom-0 right-0 z-10"
        onClick={onClose}
      ></div>

      {showDeleteConfirm && (
        <ConfirmAlert
          title="Delete project?"
          description={
            <>
              This will permanently delete{" "}
              <span className="font-semibold">"{project?.name}"</span> and all
              its tasks. This can't be undone.
            </>
          }
          submitBtnText="Delete"
          onCancel={() => setShowDeleteConfirm(false)}
          onSubmit={handleProjectDelete}
        />
      )}
    </div>
  );
};

export default SidebarProjectMoreOptions;
