import React, { Dispatch, SetStateAction } from "react";
import ConfirmAlert from "../../AlertBox/ConfirmAlert";
import { ProjectType } from "@/types/project";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useAuthProvider } from "@/context/AuthContext";

const ProjectDeleteConfirm = ({
  project,
  setShowDeleteConfirm,
}: {
  project: ProjectType;
  setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
}) => {
  const { projects, setProjects } = useTaskProjectDataProvider();
  const { profile } = useAuthProvider();

  const handleProjectDelete = async () => {
    if (!profile?.id) return;

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
