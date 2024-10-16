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
  const { projects, setProjects, pages, setPages } = useSidebarDataProvider();
  const { profile } = useAuthProvider();

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

  const handleProjectDelete = async () => {
    if (!profile?.id || !id) return;

    if (
      !canDeleteContent(
        role({
          project: project || null,
          page: page || null,
        }),
        !!project?.team_id || !!page?.team_id
      )
    ) {
      console.error("User doesn't have permission");
      return;
    }
    

    if (project) {
      const updatedProjects = projects.filter((proj) => proj.id !== project.id);
      setProjects(updatedProjects);
    } else {
      const updatedPages = pages.filter((pg) => pg.id !== page?.id);
      setPages(updatedPages);
    }

    // Delete project
    const { error: projectError } = await supabaseBrowser
      .from(table)
      .delete()
      .eq("id", id);
    if (projectError) {
      console.error(projectError);
    }

    if (project) {
      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.DELETED_PROJECT,
        entity: {
          id,
          type: EntityType.PROJECT,
          name: project.name,
        },
        metadata: {
          old_data: project,
        },
      });
    } else if (page) {
      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.DELETED_PAGE,
        entity: {
          id,
          type: EntityType.PAGE,
          name: page.title,
        },
        metadata: {
          old_data: page,
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
            <span className="font-semibold">{channel.name}</span>. This can&apos;t
            be undone.
          </>
        ) : (
          <>
            This will permanently delete{" "}
            <span className="font-semibold">{thread?.title}</span>. This can&apos;t
            be undone.
          </>
        )
      }
      submitBtnText="Delete"
      onCancel={() => setShowDeleteConfirm(false)}
      onConfirm={handleProjectDelete}
    />
  );
};

export default DeleteConfirm;
