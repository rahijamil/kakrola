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
import { canDeleteProject } from "@/types/hasPermission";
import { PageType } from "@/types/pageTypes";

const DeleteConfirm = ({
  project,
  page,
  setShowDeleteConfirm,
}: {
  project?: ProjectType;
  page?: PageType;
  setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
}) => {
  const { projects, setProjects, pages, setPages } = useSidebarDataProvider();
  const { profile } = useAuthProvider();

  const { role } = useRole();

  const table = project ? "projects" : "pages";
  const id = project ? project.id : page?.id;

  const handleProjectDelete = async () => {
    if (!profile?.id) return;

    const userRole = role({
      _project_id: project?.id,
      _page_id: page?.id,
    });
    const canUpdateSection = userRole ? canDeleteProject(userRole) : false;
    if (!canUpdateSection || !id) return;

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

    createActivityLog({
      actor_id: profile.id,
      action: ActivityAction.DELETED_PROJECT,
      entity_id: id,
      entity_type: EntityType.PROJECT,
      metadata: {
        old_data: project,
      },
    });
  };

  return (
    <ConfirmAlert
      title={project ? "Delete project?" : "Delete page?"}
      description={
        project ? (
          <>
            This will permanently delete{" "}
            <span className="font-semibold">{project.name}</span>{" "}
            and all its tasks. This can&apos;t be undone.
          </>
        ) : (
          page && (
            <>
              This will permanently delete{" "}
              <span className="font-semibold">{page.title}</span>.
              This can&apos;t be undone.
            </>
          )
        )
      }
      submitBtnText="Delete"
      onCancel={() => setShowDeleteConfirm(false)}
      onConfirm={handleProjectDelete}
    />
  );
};

export default DeleteConfirm;
