import React, { Dispatch, SetStateAction } from "react";
import ConfirmAlert from "../../AlertBox/ConfirmAlert";
import { ProjectType } from "@/types/project";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useAuthProvider } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import { PageType } from "@/types/pageTypes";
import { ChannelType, ThreadType } from "@/types/channel";
import { canDeleteContent } from "@/utils/permissionUtils";
import { useQueryClient } from "@tanstack/react-query";

const DeleteConfirm = ({
  project,
  page,
  channel,
  thread,
  setShowDeleteConfirm,
}: {
  project?: ProjectType;
  page?: PageType;
  channel?: ChannelType;
  thread?: ThreadType | null;
  setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
}) => {
  const { projects, setProjects, pages, setPages, channels, setChannels } =
    useSidebarDataProvider();
  const { profile } = useAuthProvider();
  const queryClient = useQueryClient();

  const { role } = useRole();

  const table = project
    ? "projects"
    : page
    ? "pages"
    : channel
    ? "channels"
    : "threads";
  const id = project
    ? project.id
    : page
    ? page?.id
    : channel
    ? channel.id
    : thread?.id;

  const handleDelete = async () => {
    if (!profile?.id || !id) return;

    if (
      !canDeleteContent(
        role({
          project: project || null,
          page: page || null,
          team_id:
            channel?.team_id ||
            (thread
              ? channels.find((ch) => ch.id == thread?.channel_id)?.team_id
              : undefined),
        }),
        !!project?.team_id ||
          !!page?.team_id ||
          !!channel?.team_id ||
          (thread && channels.find((ch) => ch.id == thread.channel_id)?.team_id)
          ? true
          : false
      )
    ) {
      console.error("User doesn't have permission");
      return;
    }

    // Update the state for the deleted item
    if (project) {
      const updatedProjects = projects.filter((proj) => proj.id !== project.id);
      setProjects(updatedProjects);
    } else if (page) {
      const updatedPages = pages.filter((pg) => pg.id !== page?.id);
      setPages(updatedPages);
    } else if (channel) {
      const updatedChannels = channels.filter((ch) => ch.id !== channel.id);
      setChannels(updatedChannels);
    } else if (thread) {
      queryClient.setQueryData(
        ["channelDetails", thread.channel_id, profile.id],
        (oldData: {
          channel: ChannelType | null;
          threads: ThreadType[] | null;
        }) => ({
          ...oldData,
          threads: oldData.threads?.filter((th) => th.id != thread.id),
        })
      );
    }

    // Perform deletion from Supabase
    const { error: deleteError } = await supabaseBrowser
      .from(table)
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(deleteError);
      return;
    }

    // Log the deletion activity
    const activityLogDetails = {
      actor_id: profile.id,
      metadata: { old_data: project || page || channel || thread },
    };

    if (project) {
      createActivityLog({
        ...activityLogDetails,
        action: ActivityAction.DELETED_PROJECT,
        entity: { id, type: EntityType.PROJECT, name: project.name },
      });
    } else if (page) {
      createActivityLog({
        ...activityLogDetails,
        action: ActivityAction.DELETED_PAGE,
        entity: { id, type: EntityType.PAGE, name: page.title },
      });
    } else if (channel) {
      createActivityLog({
        ...activityLogDetails,
        action: ActivityAction.DELETED_CHANNEL,
        entity: { id, type: EntityType.CHANNEL, name: channel.name },
      });
    } else if (thread) {
      createActivityLog({
        ...activityLogDetails,
        action: ActivityAction.DELETED_THREAD,
        entity: {
          id,
          type: EntityType.THREAD,
          name: thread?.title || "Untitled Thread",
        },
      });
    }
  };

  return (
    <ConfirmAlert
      title={
        project
          ? "Delete project?"
          : page
          ? "Delete page?"
          : channel
          ? "Delete channel?"
          : "Delete thread?"
      }
      description={
        project ? (
          <>
            This will permanently delete{" "}
            <span className="font-semibold">{project.name}</span> and all its
            tasks. This can&apos;t be undone.
          </>
        ) : page ? (
          <>
            This will permanently delete{" "}
            <span className="font-semibold">{page.title}</span>. This can&apos;t
            be undone.
          </>
        ) : channel ? (
          <>
            This will permanently delete{" "}
            <span className="font-semibold">{channel.name}</span>. This
            can&apos;t be undone.
          </>
        ) : (
          <>
            This will permanently delete{" "}
            <span className="font-semibold">{thread?.title}</span>. This
            can&apos;t be undone.
          </>
        )
      }
      submitBtnText="Delete"
      onCancel={() => setShowDeleteConfirm(false)}
      onConfirm={handleDelete}
    />
  );
};

export default DeleteConfirm;
