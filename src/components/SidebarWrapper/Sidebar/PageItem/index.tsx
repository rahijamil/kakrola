import { ProjectType, TaskType } from "@/types/project";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import CommentOrActivityModal from "../../../LayoutWrapper/CommentOrActivityModal";
import ExportCSVModal from "../SidebarProjectMoreOptions/ExportCSVModal";
import ImportCSVModal from "../SidebarProjectMoreOptions/ImportCSVModal";
import AddEditProject from "../../../AddEditProject";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import {
  CheckCircle,
  Ellipsis,
  File,
  FileText,
  Hash,
  Users,
} from "lucide-react";
import DeleteConfirm from "../DeleteConfirm";
import ArchiveConfirm from "../ArchiveConfirm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "@tanstack/react-query";
import LeaveConfirm from "../LeaveConfirm";
import useScreen from "@/hooks/useScreen";
import { PageType } from "@/types/pageTypes";
import SidebarPageMoreOptions from "./SidebarPageMoreOptions";
import Rename from "../Rename";

const PageItem = ({
  page,
  pathname,
  isDragging,
  setIsDragDisabled,
  forFavorites
}: {
  page: PageType;
  pathname: string;
  isDragging?: boolean;
  setIsDragDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
  forFavorites?: boolean
}) => {
  const { sidebarLoading } = useSidebarDataProvider();

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
          onTouchStart={(ev) => ev.currentTarget.classList.add("bg-primary-50")}
          onTouchEnd={(ev) =>
            ev.currentTarget.classList.remove("bg-primary-50")
          }
          className={`sidebar_project_item flex items-center transition-colors duration-150 font-medium md:font-normal w-full border-l-4 relative ${
            isDragging
              ? "bg-surface shadow-[1px_1px_8px_1px_rgba(0,0,0,0.1)]"
              : pathname === `/app/page/${page.slug}`
              ? "bg-primary-100 text-text-900 border-primary-300"
              : "md:hover:bg-primary-50 border-transparent hover:border-primary-200 text-text-700"
          }`}
        >
          <div
            ref={triggerRef}
            className="absolute left-4 top-1/2 pointer-events-none opacity-0 -z-10"
          ></div>
          <Link
            href={`/app/page/${page.slug}`}
            className={`w-full p-2 ${(page.team_id && !forFavorites) ? "pl-7 pr-4" : "px-4"}`}
            draggable={false}
          >
            <div className="flex items-center gap-2">
              <FileText
                className={`w-5 h-5 min-w-5 min-h-5 text-${page.settings.color}`}
                strokeWidth={1.5}
              />

              <span className="truncate">{page.title}</span>

              {thisProjectAllMembers?.length! > 1 && (
                <Users
                  strokeWidth={1.5}
                  className="w-4 h-4 min-w-4 min-h-4 ml-2"
                />
              )}
            </div>
          </Link>

          <div className="w-7 h-7 flex items-center justify-center absolute right-1">
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
                }}
                setIsDragDisabled={setIsDragDisabled}
              />
            )}
          </div>
        </div>
      )}

      <Rename
        triggerRef={triggerRef}
        page={page}
        isOpen={projectEdit}
        setIsOpen={setProjectEdit}
        Icon={FileText}
      />

      {showLeaveConfirm && (
        <LeaveConfirm setShowLeaveConfirm={setShowLeaveConfirm} page={page} />
      )}

      {showDeleteConfirm && (
        <DeleteConfirm
          setShowDeleteConfirm={setShowDeleteConfirm}
          page={page}
        />
      )}

      {showArchiveConfirm && (
        <ArchiveConfirm
          setShowArchiveConfirm={setShowArchiveConfirm}
          page={page}
        />
      )}

      {showCommentOrActivity && (
        <CommentOrActivityModal
          onClose={() => setShowCommentOrActivity(null)}
          showCommentOrActivity={showCommentOrActivity}
          setShowCommentOrActivity={setShowCommentOrActivity}
          page={page}
        />
      )}

      {/* {exportAsCSV && <ExportCSVModal onClose={() => setExportAsCSV(false)} />}
      {importFromCSV && (
        <ImportCSVModal onClose={() => setImportFromCSV(false)} />
      )} */}

      {/* {projectEdit && (
        <AddEditProject
          onClose={() => setProjectEdit(false)}
          project={project}
        />
      )} */}
    </li>
  );
};

export default PageItem;
