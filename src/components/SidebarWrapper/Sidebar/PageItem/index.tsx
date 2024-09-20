import { ProjectType, TaskType } from "@/types/project";
import Link from "next/link";
import React, { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import CommentOrActivityModal from "../../../LayoutWrapper/CommentOrActivityModal";
import ExportCSVModal from "../SidebarProjectMoreOptions/ExportCSVModal";
import ImportCSVModal from "../SidebarProjectMoreOptions/ImportCSVModal";
import AddEditProject from "../../../AddEditProject";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { CheckCircle, Ellipsis, File, Hash, Users } from "lucide-react";
import ProjectDeleteConfirm from "../ProjectDeleteConfirm";
import ProjectArchiveConfirm from "../ProjectArchiveConfirm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "@tanstack/react-query";
import ProjectLeaveConfirm from "../ProjectLeaveConfirm";
import useScreen from "@/hooks/useScreen";
import { PageType } from "@/types/pageTypes";
import SidebarPageMoreOptions from "./SidebarPageMoreOptions";

const PageItem = ({
  page,
  pathname,
  isDragging,
  setIsDragDisabled,
}: {
  page: PageType;
  pathname: string;
  isDragging?: boolean;
  setIsDragDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { sidebarLoading } = useSidebarDataProvider();
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const { data: thisProjectAllMembers } = useQuery({
    queryKey: ["personal_members", page.id],
    queryFn: async () => {
      const { data, error } = await supabaseBrowser
        .from("personal_members")
        .select("id")
        .eq("project_id", page.id);
      if (error) console.error("Failed to fetch project members", error);
      if (!error) {
        return data;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!page.id,
  });

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     const { data: tasksData, error: tasksError } = await supabaseBrowser
  //       .from("tasks")
  //       .select("id")
  //       .eq("project_id", page.id);

  //     if (tasksError) console.error("Failed to fetch tasks", tasksError);

  //     if (!tasksError) {
  //       setTasks((tasksData as any) || []);
  //     }
  //   };

  //   fetchTasks();
  // }, [page.id]);

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

  return (
    <li>
      {sidebarLoading ? (
        <div className="flex items-center justify-between gap-2">
          <Skeleton height={20} width={20} borderRadius={9999} />
          <Skeleton height={20} borderRadius={9999} width={200} />
        </div>
      ) : (
        <div
          onTouchStart={(ev) => ev.currentTarget.classList.add("bg-primary-50")}
          onTouchEnd={(ev) =>
            ev.currentTarget.classList.remove("bg-primary-50")
          }
          className={`sidebar_project_item flex-1 flex items-center justify-between transition-colors rounded-lg text-text-900 pl-2 ${
            isDragging
              ? "bg-surface shadow-[0_0_8px_1px_rgba(0,0,0,0.2)]"
              : pathname === `/app/page/${page.slug}`
              ? "bg-primary-100"
              : "md:hover:bg-primary-50"
          }`}
        >
          <Link
            href={`/app/page/${page.slug}`}
            className={`py-1 md:py-0 p-px w-full`}
            draggable={false}
          >
            <div className="flex items-center">
              <div className="p-2">
                <File
                  className={`w-4 h-4 text-${page.settings.color}`}
                  strokeWidth={2}
                />
              </div>
              {page.title}

              {thisProjectAllMembers?.length! > 1 && (
                <Users strokeWidth={1.5} className="w-4 h-4 ml-2" />
              )}
            </div>
          </Link>

          <div className="relative mr-1">
            <div className="w-7 h-7 flex items-center justify-center">
              {tasks.filter((task) => task.project_id == page.id).length >
                0 && (
                <p className="text-text-500">
                  {tasks.filter((task) => task.project_id == page.id).length}
                </p>
              )}

              {screenWidth > 768 && (
                <SidebarPageMoreOptions
                  page={page}
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
        </div>
      )}

      {/* {showLeaveConfirm && (
        <ProjectLeaveConfirm
          setShowLeaveConfirm={setShowLeaveConfirm}
          project={project}
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
          workspaceId={page.team_id}
        />
      )} */}
    </li>
  );
};

export default PageItem;