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

const ProjectArchiveConfirm = ({
  project,
  setShowArchiveConfirm,
}: {
  project: ProjectType;
  setShowArchiveConfirm: Dispatch<SetStateAction<boolean>>;
}) => {
  const { projects, setProjects } = useSidebarDataProvider();
  const { profile } = useAuthProvider();
  const { role } = useRole();

  const handleArchive = async () => {
    if (!profile?.id) return;

    const userRole = role(project.id);
    const canUpdateSection = userRole ? canEditProject(userRole) : false;
    if (!canUpdateSection) return;

    const updatedProjects = projects.map((p) => {
      if (p.id === project.id) {
        return { ...p, is_archived: true };
      }
      return p;
    });
    setProjects(updatedProjects);

    const { error } = await supabaseBrowser
      .from("projects")
      .update({ is_archived: true })
      .eq("id", project.id);
    if (error) {
      console.error(error);
    }

    createActivityLog({
      actor_id: profile.id,
      action: ActivityAction.UPDATED_PROJECT,
      entity_id: project.id,
      entity_type: EntityType.PROJECT,
      metadata: {
        old_data: project,
        new_data: { ...project, is_archived: true },
      },
    });
  };

  return (
    <ConfirmAlert
      title="Archive?"
      description={
        <>
          This will archive{" "}
          <span className="font-semibold">&quot;{project.name}&quot;</span> and
          all its tasks.
        </>
      }
      submitBtnText="Archive"
      onCancel={() => setShowArchiveConfirm(false)}
      onConfirm={handleArchive}
    />
  );
};

export default ProjectArchiveConfirm;
