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

const ProjectDeleteConfirm = ({
  project,
  setShowDeleteConfirm,
}: {
  project: ProjectType;
  setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
}) => {
  const { projects, setProjects } = useSidebarDataProvider();
  const { profile } = useAuthProvider();

  const {role} = useRole()

  const handleProjectDelete = async () => {
    if (!profile?.id) return;

    const userRole = role(project.id);
    const canUpdateSection = userRole ? canDeleteProject(userRole) : false;
    if (!canUpdateSection) return;

    const updatedProjects = projects.filter((proj) => proj.id !== project.id);
    setProjects(updatedProjects);

    // Delete project
    const { error: projectError } = await supabaseBrowser
      .from("projects")
      .delete()
      .eq("id", project.id);
    if (projectError) {
      console.error(projectError);
    }

    createActivityLog({
      actor_id: profile.id,
      action: ActivityAction.DELETED_PROJECT,
      entity_id: project.id,
      entity_type: EntityType.PROJECT,
      metadata: {
        old_data: project,
      },
    });
  };

  return (
    <ConfirmAlert
      title="Delete project?"
      description={
        <>
          This will permanently delete{" "}
          <span className="font-semibold">&quot;{project.name}&quot;</span> and
          all its tasks. This can&apos;t be undone.
        </>
      }
      submitBtnText="Delete"
      onCancel={() => setShowDeleteConfirm(false)}
      onConfirm={handleProjectDelete}
    />
  );
};

export default ProjectDeleteConfirm;
