import { ProjectType, TaskType } from "@/types/project";
import {
  EllipsisHorizontalIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import SidebarProjectMoreOptions from "./SidebarProjectMoreOptions";
import { supabaseBrowser } from "@/utils/supabase/client";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import CommentOrActivityModal from "../LayoutWrapper/CommentOrActivityModal";
import ExportCSVModal from "./SidebarProjectMoreOptions/ExportCSVModal";
import ImportCSVModal from "./SidebarProjectMoreOptions/ImportCSVModal";
import AddEditProject from "../AddEditProject";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";

const ProjectItem = ({
  project,
  pathname,
  isDragging,
}: {
  project: ProjectType;
  pathname: string;
  isDragging?: boolean;
}) => {
  const { projects, setProjects } = useTaskProjectDataProvider();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [showProjectMoreDropdown, setShowProjectMoreDropdown] =
    useState<boolean>(false);

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showProjectMoreDropdown && moreRef.current && dropdownRef.current) {
        const moreRect = moreRef.current.getBoundingClientRect();
        const dropDownRect = dropdownRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: moreRect.bottom - dropDownRect.height / 2,
          left: moreRect.right,
        });
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [showProjectMoreDropdown]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: tasksData, error: tasksError } = await supabaseBrowser
        .from("tasks")
        .select("*")
        .eq("project_id", project.id);

      if (!tasksError) {
        setTasks(tasksData || []);
      }
    };

    fetchTasks();
  }, [project.id]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState<boolean>(false);
  const [showCommentOrActivity, setShowCommentOrActivity] = useState<
    "comment" | "activity" | null
  >(null);
  const [exportAsCSV, setExportAsCSV] = useState<boolean>(false);
  const [importFromCSV, setImportFromCSV] = useState<boolean>(false);
  const [projectEdit, setProjectEdit] = useState<boolean>(false);
  const [aboveBellow, setAboveBellow] = useState<"above" | "below" | null>(
    null
  );

  const handleProjectDelete = async () => {
    const updatedProjects = projects.filter((proj) => proj.id !== project.id);
    setProjects(updatedProjects);

    // Delete tasks
    const { error } = await supabaseBrowser
      .from("tasks")
      .delete()
      .eq("project_id", project.id);
    if (error) {
      console.error(error);
    }

    // Delete sections
    const { error: deleteError } = await supabaseBrowser
      .from("sections")
      .delete()
      .eq("project_id", project.id);
    if (deleteError) {
      console.error(deleteError);
    }

    // Delete project
    const { error: projectError } = await supabaseBrowser
      .from("projects")
      .delete()
      .eq("id", project.id);
    if (projectError) {
      console.error(projectError);
    }
  };

  const handleArchive = async () => {
    const updatedProjects = projects.map((p) => {
      if (p.id === project.id) {
        return { ...p, is_archived: true };
      }
      return p;
    });
    setProjects(updatedProjects);

    const { error } = await supabaseBrowser
      .from("projects")
      .update({ is_archived: true })
      .eq("id", project.id);
    if (error) {
      console.error(error);
    }
  };

  return (
    <li>
      <div
        ref={moreRef}
        className={`relative sidebar_project_item flex-1 flex items-center justify-between  transition-colors `}
      >
        <Link
          href={`/app/project/${project.slug}`}
          className={`p-[1px] w-full rounded-md ${
            isDragging
              ? "bg-white shadow-[0_0_8px_1px_rgba(0,0,0,0.2)]"
              : pathname === `/app/project/${project.slug}`
              ? "bg-indigo-100 text-indigo-700"
              : "hover:bg-gray-200 text-gray-700"
          }`}
          draggable={false}
        >
          <div className="flex items-center">
            <div className="p-2">
              <HashtagIcon className="w-4 h-4" />
            </div>
            {project.name}
          </div>
        </Link>

        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <div className="relative w-7 h-7 flex items-center justify-center">
            {tasks.filter((task) => task.project_id == project.id).length >
              0 && (
              <p className="text-gray-400">
                {tasks.filter((task) => task.project_id == project.id).length}
              </p>
            )}

            <div
              onClick={(ev) => {
                ev.stopPropagation();
                setShowProjectMoreDropdown(true);
              }}
              className={`flex items-center justify-center absolute left-0 top-0 right-0 bottom-0 z-10 cursor-pointer ${
                pathname === `/app/project/${project.slug}`
                  ? "bg-gray-300"
                  : "bg-gray-200"
              } hover:bg-gray-100 rounded-md opacity-0 sidebar_project_item_options w-7 h-7`}
            >
              <EllipsisHorizontalIcon className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {showProjectMoreDropdown && (
        <SidebarProjectMoreOptions
          onClose={() => setShowProjectMoreDropdown(false)}
          project={project}
          dropdownPosition={dropdownPosition}
          dropdownRef={dropdownRef}
          stateActions={{
            setShowDeleteConfirm,
            setShowArchiveConfirm,
            setShowCommentOrActivity,
            setExportAsCSV,
            setImportFromCSV,
            setProjectEdit,
            setAboveBellow,
          }}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmAlert
          title="Delete project?"
          description={
            <>
              This will permanently delete{" "}
              <span className="font-semibold">&quot;{project.name}&quot;</span>{" "}
              and all its tasks. This can&apos;t be undone.
            </>
          }
          submitBtnText="Delete"
          onCancel={() => setShowDeleteConfirm(false)}
          onSubmit={handleProjectDelete}
        />
      )}

      {showArchiveConfirm && (
        <ConfirmAlert
          title="Archive?"
          description={
            <>
              This will archive{" "}
              <span className="font-semibold">&quot;{project.name}&quot;</span>{" "}
              and all its tasks.
            </>
          }
          submitBtnText="Archive"
          onCancel={() => setShowArchiveConfirm(false)}
          onSubmit={handleArchive}
        />
      )}

      {showCommentOrActivity && (
        <CommentOrActivityModal
          onClose={() => setShowCommentOrActivity(null)}
          showCommentOrActivity={showCommentOrActivity}
          setShowCommentOrActivity={setShowCommentOrActivity}
          project={project}
        />
      )}

      {exportAsCSV && <ExportCSVModal onClose={() => setExportAsCSV(false)} />}
      {importFromCSV && (
        <ImportCSVModal onClose={() => setImportFromCSV(false)} />
      )}

      {projectEdit && (
        <AddEditProject
          onClose={() => setProjectEdit(false)}
          project={project}
        />
      )}

      {aboveBellow && (
        <AddEditProject
          onClose={() => setAboveBellow(null)}
          aboveBellow={aboveBellow}
          project={project}
        />
      )}
    </li>
  );
};

export default ProjectItem;
