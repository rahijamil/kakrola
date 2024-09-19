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

const ProjectLeaveConfirm = ({
  project,
  setShowLeaveConfirm,
}: {
  project: ProjectType;
  setShowLeaveConfirm: Dispatch<SetStateAction<boolean>>;
}) => {
  const { projects, setProjects } = useSidebarDataProvider();
  const { profile } = useAuthProvider();

  const handleProjectLeave = async () => {
    if (!profile?.id) return;

    const updatedProjects = projects.filter((proj) => proj.id !== project.id);
    setProjects(updatedProjects);

    // Delete project
    const { error: projectError } = await supabaseBrowser
      .from("personal_members")
      .delete()
      .eq("project_id", project.id)
      .eq("profile_id", profile.id);
    if (projectError) {
      console.error(projectError);
    }

    createActivityLog({
      actor_id: profile.id,
      action: ActivityAction.LEAVED_PROJECT,
      entity_id: project.id,
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
      title="Leave?"
      description={
        <>
          Are you sure you want to leave{" "}
          <span className="font-semibold">&quot;{project.name}&quot;</span>?
        </>
      }
      submitBtnText="Leave"
      onCancel={() => setShowLeaveConfirm(false)}
      onConfirm={handleProjectLeave}
    />
  );
};

export default ProjectLeaveConfirm;
