import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import {
  ArchiveBoxArrowDownIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  HeartIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { CopyPlusIcon, HeartOffIcon, LogsIcon } from "lucide-react";
import React, { useState } from "react";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import { useRouter } from "next/navigation";
import { ProjectType } from "@/types/project";

const ActiveProjectMoreOptions = ({
  onClose,
  project,
}: {
  onClose: () => void;
  project: ProjectType;
}) => {
  const {
    projects,
    // setProjects,
    // setTasks,
    // setSections,
  } = useTaskProjectDataProvider();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const router = useRouter();

  const handleProjectDelete = () => {
    // const updatedTasks = tasks.filter(
    //   (t) => t.project_id !== project?.id
    // );
    // setTasks(updatedTasks);

    // const updatedSections = sections.filter(
    //   (s) => s.project_id !== project?.id
    // );
    // setSections(updatedSections);

    // const updatedProjects = projects.filter(
    //   (proj) => proj.id !== project?.id
    // );
    // setProjects(updatedProjects);

    router.replace(`/app`);
  };

  const handleFavorite = () => {};

  return (
    <>
      <div className="absolute bg-white drop-shadow-md rounded-md border border-gray-200 top-full right-0 z-20 w-60 py-1">
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <PencilIcon className="w-4 h-4 mr-4" /> Edit
          </button>
          <button
            onClick={handleFavorite}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
          >
            {project?.is_favorite ? (
              <HeartOffIcon className="w-4 h-4 mr-4" />
            ) : (
              <HeartIcon className="w-4 h-4 mr-4" />
            )}{" "}
            {project?.is_favorite
              ? "Remove from favorites"
              : "Add to favorites"}
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <CopyPlusIcon className="w-4 h-4 mr-4" /> Duplicate
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
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
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <LinkIcon className="w-4 h-4 mr-4" /> Copy project link
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <ArrowDownTrayIcon className="w-4 h-4 mr-4" /> Import from CSV
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <ArrowUpTrayIcon className="w-4 h-4 mr-4" /> Export as CSV
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <LogsIcon className="w-4 h-4 mr-4" /> Activity log
          </button>
        </div>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
            <ArchiveBoxArrowDownIcon className="w-4 h-4 mr-4" /> Archive
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
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

      {showDeleteConfirm && (
        <ConfirmAlert
          title="Delete project?"
          description={
            <>
              This will permanently delete{" "}
              <span className="font-semibold">&quot;{project?.name}&quot;</span> and
              all its tasks. This can&apos;t be undone.
            </>
          }
          submitBtnText="Delete"
          onCancel={() => setShowDeleteConfirm(false)}
          onSubmit={handleProjectDelete}
        />
      )}
    </>
  );
};

export default ActiveProjectMoreOptions;
