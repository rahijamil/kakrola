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
import { PageType } from "@/types/pageTypes";

const LeaveConfirm = ({
  project,
  page,
  setShowLeaveConfirm,
}: {
  project?: ProjectType;
  page?: PageType;
  setShowLeaveConfirm: Dispatch<SetStateAction<boolean>>;
}) => {
  const { projects, setProjects, pages, setPages } = useSidebarDataProvider();
  const { profile } = useAuthProvider();

  const column_name = project ? "project_id" : "page_id";
  const id = project ? project.id : page?.id;

  const handleProjectLeave = async () => {
    if (!profile?.id || !id) return;

    if (project) {
      const updatedProjects = projects.filter((proj) => proj.id !== project.id);
      setProjects(updatedProjects);
    } else {
      const updatedPages = pages.filter((pg) => pg.id !== page?.id);
      setPages(updatedPages);
    }

    // Delete project
    const { error: projectError } = await supabaseBrowser
      .from("personal_members")
      .delete()
      .eq(column_name, id)
      .eq("profile_id", profile.id);
    if (projectError) {
      console.error(projectError);
    }

    createActivityLog({
      actor_id: profile.id,
      action: ActivityAction.LEAVED_PROJECT,
      entity_id: id,
      entity_type: EntityType.PROJECT,
      metadata: {
        old_data: {
          profile,
          project,
        },
      },
    });
  };

  return (
    <ConfirmAlert
      title={project ? "Leave project?" : "Leave page?"}
      description={
        project ? (
          <>
            Are you sure you want to leave{" "}
            <span className="font-semibold">&quot;{project.name}&quot;</span>?
          </>
        ) : (
          page && (
            <>
              Are you sure you want to leave{" "}
              <span className="font-semibold">&quot;{page.title}&quot;</span>?
            </>
          )
        )
      }
      submitBtnText="Leave"
      onCancel={() => setShowLeaveConfirm(false)}
      onConfirm={handleProjectLeave}
    />
  );
};

export default LeaveConfirm;
