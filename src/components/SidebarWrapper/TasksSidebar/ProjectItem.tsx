import { ProjectType, TaskType } from "@/types/project";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import SidebarProjectMoreOptions from "./SidebarProjectMoreOptions";
import { supabaseBrowser } from "@/utils/supabase/client";
import ConfirmAlert from "../../AlertBox/ConfirmAlert";
import CommentOrActivityModal from "../../LayoutWrapper/CommentOrActivityModal";
import ExportCSVModal from "./SidebarProjectMoreOptions/ExportCSVModal";
import ImportCSVModal from "./SidebarProjectMoreOptions/ImportCSVModal";
import AddEditProject from "../../AddEditProject";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { Ellipsis, Hash } from "lucide-react";
import ProjectDeleteConfirm from "./ProjectDeleteConfirm";
import ProjectArchiveConfirm from "./ProjectArchiveConfirm";

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

  return (
    <li>
      <div
        ref={moreRef}
        className={`relative sidebar_project_item flex-1 flex items-center justify-between transition-colors rounded-lg ${
          isDragging
            ? "bg-surface shadow-[0_0_8px_1px_rgba(0,0,0,0.2)]"
            : pathname === `/app/project/${project.slug}`
            ? "bg-primary-100 text-primary-700"
            : "hover:bg-primary-50 text-text-700"
        }`}
      >
        <Link
          href={`/app/project/${project.slug}`}
          className={`p-[1px] w-full`}
          draggable={false}
        >
          <div className="flex items-center">
            <div className="p-2">
              <Hash
                className={`w-4 h-4 text-${project.color}`}
                strokeWidth={1.5}
              />
            </div>
            {project.name}
          </div>
        </Link>

        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <div className="relative w-7 h-7 flex items-center justify-center">
            {tasks.filter((task) => task.project_id == project.id).length >
              0 && (
              <p className="text-text-400">
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
                  ? "bg-text-300"
                  : "bg-text-200"
              } hover:bg-primary-50 rounded-lg opacity-0 sidebar_project_item_options w-7 h-7`}
            >
              <Ellipsis className="w-5 h-5 text-text-700" strokeWidth={1.5} />
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
        <ProjectDeleteConfirm
          setShowDeleteConfirm={setShowDeleteConfirm}
          project={project}
        />
      )}

      {showArchiveConfirm && (
        <ProjectArchiveConfirm
          setShowArchiveConfirm={setShowArchiveConfirm}
          project={project}
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
          workspaceId={project.team_id}
        />
      )}
    </li>
  );
};

export default ProjectItem;
