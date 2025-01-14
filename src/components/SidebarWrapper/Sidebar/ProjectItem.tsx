import { ProjectType, TaskType } from "@/types/project";
import Link from "next/link";
import React, { useRef, useState } from "react";
import SidebarProjectMoreOptions from "./SidebarProjectMoreOptions";
import { supabaseBrowser } from "@/utils/supabase/client";
import CommentOrActivityModal from "../../LayoutWrapper/CommentOrActivityModal";
import ExportCSVModal from "./SidebarProjectMoreOptions/ExportCSVModal";
import ImportCSVModal from "./SidebarProjectMoreOptions/ImportCSVModal";
import AddEditProject from "../../AddEditProject";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { CheckCircle, Users } from "lucide-react";
import DeleteConfirm from "./DeleteConfirm";
import ArchiveConfirm from "./ArchiveConfirm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "@tanstack/react-query";
import ProjectLeaveConfirm from "./LeaveConfirm";
import useScreen from "@/hooks/useScreen";
import { AnimatePresence } from "framer-motion";
import Rename from "./Rename";

const ProjectItem = ({
  project,
  pathname,
  isDragging,
  setIsDragDisabled,
  forFavorites,
}: {
  project: ProjectType;
  pathname: string;
  isDragging?: boolean;
  setIsDragDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
  forFavorites?: boolean;
}) => {
  const { sidebarLoading, teams } = useSidebarDataProvider();
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const { data: thisProjectAllMembers } = useQuery({
    queryKey: ["personal_members", project.id],
    queryFn: async () => {
      const { data, error } = await supabaseBrowser
        .from("personal_members")
        .select("id")
        .eq("project_id", project.id);
      if (error) console.error("Failed to fetch project members", error);
      if (!error) {
        return data;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!project.id,
  });

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     const { data: tasksData, error: tasksError } = await supabaseBrowser
  //       .from("tasks")
  //       .select("id")
  //       .eq("project_id", project.id);

  //     if (tasksError) console.error("Failed to fetch tasks", tasksError);

  //     if (!tasksError) {
  //       setTasks((tasksData as any) || []);
  //     }
  //   };

  //   fetchTasks();
  // }, [project.id]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState<boolean>(false);
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

  const { screenWidth } = useScreen();
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <li>
      {sidebarLoading ? (
        <div className="flex items-center justify-between gap-2">
          <Skeleton height={20} width={20} borderRadius={9999} />
          <Skeleton height={20} borderRadius={9999} width={200} />
        </div>
      ) : (
        <div
          className={`sidebar_project_item flex items-center transition-colors duration-150 font-medium md:font-normal w-full md:border-l-4 relative active:bg-text-100 ${
            isDragging
              ? "bg-surface shadow-[1px_1px_8px_1px_rgba(0,0,0,0.1)]"
              : pathname === `/app/project/${project.slug}`
              ? "bg-primary-100 text-text-900 border-primary-300"
              : "md:hover:bg-primary-50 border-transparent hover:border-primary-200 text-text-700"
          }`}
          onTouchStart={(ev) =>
            ev.currentTarget.classList.add("bg-text-100")
          }
          onTouchEnd={(ev) =>
            ev.currentTarget.classList.remove("bg-text-100")
          }
        >
          <div
            ref={triggerRef}
            className="absolute left-4 top-1/2 pointer-events-none opacity-0 -z-10"
          ></div>
          <Link
            href={`/app/project/${project.slug}`}
            className={`w-full p-2 h-9 ${
              project.team_id && !forFavorites ? "pl-7 pr-4" : "px-4"
            }`}
            draggable={false}
          >
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`w-5 h-5 min-w-5 min-h-5 text-${project.settings.color}`}
                strokeWidth={1.5}
              />

              <span className="truncate">{project.name}</span>

              {thisProjectAllMembers?.length! > 1 && (
                <Users strokeWidth={1.5} className="w-4 h-4 min-w-4 min-h-4" />
              )}
            </div>
          </Link>

          <div className="w-7 h-7 flex items-center justify-center absolute right-1">
            {tasks.filter((task) => task.project_id == project.id).length >
              0 && (
              <p className="text-text-500">
                {tasks.filter((task) => task.project_id == project.id).length}
              </p>
            )}

            {screenWidth > 768 && (
              <SidebarProjectMoreOptions
                project={project}
                stateActions={{
                  setShowDeleteConfirm,
                  setShowLeaveConfirm,
                  setShowArchiveConfirm,
                  setShowCommentOrActivity,
                  setExportAsCSV,
                  setImportFromCSV,
                  setProjectEdit,
                  setAboveBellow,
                }}
                setIsDragDisabled={setIsDragDisabled}
              />
            )}
          </div>
        </div>
      )}

      <Rename
        triggerRef={triggerRef}
        project={project}
        isOpen={projectEdit}
        setIsOpen={setProjectEdit}
        Icon={CheckCircle}
      />

      {showLeaveConfirm && (
        <ProjectLeaveConfirm
          setShowLeaveConfirm={setShowLeaveConfirm}
          project={project}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirm
          setShowDeleteConfirm={setShowDeleteConfirm}
          project={project}
        />
      )}

      {showArchiveConfirm && (
        <ArchiveConfirm
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

      <AnimatePresence>
        {aboveBellow && (
          <AddEditProject
            onClose={() => setAboveBellow(null)}
            aboveBellow={aboveBellow}
            project={project}
            team_id={project.team_id}
          />
        )}
      </AnimatePresence>
    </li>
  );
};

export default ProjectItem;
