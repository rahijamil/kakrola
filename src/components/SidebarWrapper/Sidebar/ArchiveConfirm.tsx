import React, { Dispatch, SetStateAction } from "react";
import ConfirmAlert from "../../AlertBox/ConfirmAlert";
import { ProjectType } from "@/types/project";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useAuthProvider } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import { PageType } from "@/types/pageTypes";
import { ChannelType, ThreadType } from "@/types/channel";
import { TeamType } from "@/types/team";
import { canEditContent } from "@/utils/permissionUtils";
import { useQueryClient } from "@tanstack/react-query";

const ArchiveConfirm = ({
  project,
  setShowArchiveConfirm,
  page,
  channel,
  thread,
  team,
  handleArchive: handleArchiveMethod,
}: {
  project?: ProjectType;
  setShowArchiveConfirm: Dispatch<SetStateAction<boolean>>;
  page?: PageType;
  channel?: ChannelType;
  thread?: ThreadType | null;
  team?: TeamType;
  handleArchive?: () => void;
}) => {
  const { projects, setProjects, pages, setPages, channels, setChannels } =
    useSidebarDataProvider();
  const { profile } = useAuthProvider();
  const { role } = useRole();
  const queryClient = useQueryClient();

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

  const handleArchive = async () => {
    if (handleArchiveMethod) {
      handleArchiveMethod();
      return;
    }

    if (!profile?.id || !id) return;

    if (
      !canEditContent(
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
    )
      return;

    // Update the state for the deleted item
    if (project) {
      const updatedProjects = projects.map((p) => {
        if (p.id === project.id) {
          return { ...p, is_archived: true };
        }
        return p;
      });
      setProjects(updatedProjects);
    } else if (page) {
      const updatedPages = pages.map((p) => {
        if (p.id === page.id) {
          return { ...p, is_archived: true };
        }
        return p;
      });
      setPages(updatedPages);
    } else if (channel) {
      const updatedChannels = channels.map((ch) =>
        ch.id == channel.id ? { ...ch, is_archived: true } : ch
      );
      setChannels(updatedChannels);
    } else if (thread) {
      queryClient.setQueryData(
        ["channelDetails", thread.channel_id, profile.id],
        (oldData: {
          channel: ChannelType | null;
          threads: ThreadType[] | null;
        }) => ({
          ...oldData,
          threads: oldData.threads?.map((th) =>
            th.id == thread.id ? { ...th, is_archived: true } : th
          ),
        })
      );
    }

    const { error } = await supabaseBrowser
      .from(table)
      .update({ is_archived: true })
      .eq("id", id);
    if (error) {
      console.error(error);
    }

    // createActivityLog({
    //   actor_id: profile.id,
    //   action: project ? ActivityAction.UPDATED_PROJECT : ActivityAction.UPDATED_PAGE,
    //   entity_id: id,
    //   entity_type: project ? EntityType.PROJECT : EntityType.PAGE,
    //   metadata: {
    //     old_data: project,
    //     new_data: { ...project, is_archived: true },
    //   },
    // });
  };

  return (
    <ConfirmAlert
      title={
        project
          ? "Archive project?"
          : page
          ? "Archive page?"
          : channel
          ? "Archive channel?"
          : thread
          ? "Archive thread?"
          : "Archive team?"
      }
      description={
        project ? (
          <>
            This will archive{" "}
            <span className="font-semibold">&quot;{project.name}&quot;</span>{" "}
            and all its tasks.
          </>
        ) : page ? (
          <>
            This will archive{" "}
            <span className="font-semibold">&quot;{page.title}&quot;</span>.
          </>
        ) : channel ? (
          <>
            This will archive{" "}
            <span className="font-semibold">&quot;{channel.name}&quot;</span>.
          </>
        ) : thread ? (
          <>
            This will archive{" "}
            <span className="font-semibold">&quot;{thread?.title}&quot;</span>.
          </>
        ) : (
          <>
            This will archive{" "}
            <span className="font-semibold">&quot;{team?.name}&quot;</span>.
          </>
        )
      }
      submitBtnText="Archive"
      onCancel={() => setShowArchiveConfirm(false)}
      onConfirm={handleArchive}
    />
  );
};

export default ArchiveConfirm;
