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
import { CheckCircle, Ellipsis, Hash } from "lucide-react";
import ProjectDeleteConfirm from "./ProjectDeleteConfirm";
import ProjectArchiveConfirm from "./ProjectArchiveConfirm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProjectItem = ({
  project,
  pathname,
  isDragging,
}: {
  project: ProjectType;
  pathname: string;
  isDragging?: boolean;
}) => {
  const { projectsLoading } = useTaskProjectDataProvider();
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: tasksData, error: tasksError } = await supabaseBrowser
        .from("tasks")
        .select("id")
        .eq("project_id", project.id);

      if (!tasksError) {
        setTasks((tasksData as any) || []);
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
      {projectsLoading ? (
        <div className="flex items-center justify-between gap-2">
          <Skeleton height={20} width={20} borderRadius={9999} />
          <Skeleton height={20} borderRadius={9999} width={200} />
        </div>
      ) : (
        <div
          className={`sidebar_project_item flex-1 flex items-center justify-between transition-colors rounded-full text-text-900 ${
            isDragging
              ? "bg-surface shadow-[0_0_8px_1px_rgba(0,0,0,0.2)]"
              : pathname === `/app/project/${project.slug}`
              ? "bg-primary-100"
              : "hover:bg-primary-50"
          }`}
        >
          <Link
            href={`/app/project/${project.slug}`}
            className={`p-[1px] w-full`}
            draggable={false}
          >
            <div className="flex items-center">
              <div className="p-2">
                <CheckCircle
                  className={`w-4 h-4 text-${project.settings.color}`}
                  strokeWidth={2}
                />
              </div>
              {project.name}
            </div>
          </Link>

          <div className="relative mr-1">
            <div className="w-7 h-7 flex items-center justify-center">
              {tasks.filter((task) => task.project_id == project.id).length >
                0 && (
                <p className="text-text-500">
                  {tasks.filter((task) => task.project_id == project.id).length}
                </p>
              )}

              <SidebarProjectMoreOptions
                project={project}
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
            </div>
          </div>
        </div>
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
