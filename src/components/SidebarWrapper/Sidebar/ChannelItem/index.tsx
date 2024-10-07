import { ProjectType, TaskType } from "@/types/project";
import Link from "next/link";
import React, { useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import CommentOrActivityModal from "../../../LayoutWrapper/CommentOrActivityModal";
import ExportCSVModal from "../SidebarProjectMoreOptions/ExportCSVModal";
import ImportCSVModal from "../SidebarProjectMoreOptions/ImportCSVModal";
import AddEditProject from "../../../AddEditProject";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { CheckCircle, Ellipsis, Hash, Users } from "lucide-react";
import DeleteConfirm from "../DeleteConfirm";
import ArchiveConfirm from "../ArchiveConfirm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "@tanstack/react-query";
import ProjectLeaveConfirm from "../LeaveConfirm";
import useScreen from "@/hooks/useScreen";
import { PageType } from "@/types/pageTypes";
import SidebarChannelMoreOptions from "./SidebarChannelMoreOptions";
import { ChannelType } from "@/types/channel";

const ChannelItem = ({
  channel,
  pathname,
  isDragging,
  setIsDragDisabled,
}: {
  channel: ChannelType;
  pathname: string;
  isDragging?: boolean;
  setIsDragDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { sidebarLoading } = useSidebarDataProvider();

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     const { data: tasksData, error: tasksError } = await supabaseBrowser
  //       .from("tasks")
  //       .select("id")
  //       .eq("project_id", channel.id);

  //     if (tasksError) console.error("Failed to fetch tasks", tasksError);

  //     if (!tasksError) {
  //       setTasks((tasksData as any) || []);
  //     }
  //   };

  //   fetchTasks();
  // }, [channel.id]);

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
          className={`sidebar_project_item flex items-center transition-colors duration-150 font-medium md:font-normal w-full border-l-4 relative ${
            isDragging
              ? "bg-surface shadow-[1px_1px_8px_1px_rgba(0,0,0,0.1)]"
              : pathname === `/app/ch/${channel.slug}`
              ? "bg-primary-100 text-text-900 border-primary-300"
              : "md:hover:bg-primary-50 border-transparent hover:border-primary-200 text-text-700"
          }`}
        >
          <Link
            href={`/app/ch/${channel.slug}`}
            className={`w-full p-2 ${channel.team_id ? "pl-7 pr-4" : "px-4"}`}
            draggable={false}
          >
            <div className="flex items-center gap-2">
              <Hash
                className={`w-4 h-4 min-w-4 min-h-4 text-${channel.settings.color}`}
                strokeWidth={2}
              />

              <span className="truncate">{channel.name}</span>
            </div>
          </Link>

          <div className="w-7 h-7 flex items-center justify-center absolute right-1">
            {screenWidth > 768 && (
              <SidebarChannelMoreOptions
                channel={channel}
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

      {/* {showLeaveConfirm && (
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
          workspaceId={channel.team_id}
        />
      )} */}
    </li>
  );
};

export default ChannelItem;
