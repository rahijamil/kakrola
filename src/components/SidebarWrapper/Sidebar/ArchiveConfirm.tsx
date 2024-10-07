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
import { canEditProject } from "@/types/hasPermission";
import { PageType } from "@/types/pageTypes";

const ArchiveConfirm = ({
  project,
  setShowArchiveConfirm,
  page,
}: {
  project?: ProjectType;
  setShowArchiveConfirm: Dispatch<SetStateAction<boolean>>;
  page?: PageType;
}) => {
  const { projects, setProjects, pages, setPages } = useSidebarDataProvider();
  const { profile } = useAuthProvider();
  const { role } = useRole();

  const table = project ? "projects" : "pages";
  const id = project ? project.id : page?.id;

  const handleArchive = async () => {
    if (!profile?.id || !id) return;

    const userRole = role({
      _project_id: project?.id,
      _page_id: page?.id,
    });
    const canUpdateSection = userRole ? canEditProject(userRole) : false;
    if (!canUpdateSection) return;

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
      title={project ? "Archive project?" : "Archive page?"}
      description={
        project ? (
          <>
            This will archive{" "}
            <span className="font-semibold">&quot;{project.name}&quot;</span>{" "}
            and all its tasks.
          </>
        ) : (
          page && (
            <>
              This will archive{" "}
              <span className="font-semibold">&quot;{page.title}&quot;</span>.
            </>
          )
        )
      }
      submitBtnText="Archive"
      onCancel={() => setShowArchiveConfirm(false)}
      onConfirm={handleArchive}
    />
  );
};

export default ArchiveConfirm;
