import React, { Dispatch, SetStateAction } from "react";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import { ProjectType } from "@/types/project";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { supabaseBrowser } from "@/utils/supabase/client";

const ProjectDeleteConfirm = ({
  project,
  setShowDeleteConfirm,
}: {
  project: ProjectType;
  setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
}) => {
  const { projects, setProjects } = useTaskProjectDataProvider();
  
  const handleProjectDelete = async () => {
    const updatedProjects = projects.filter((proj) => proj.id !== project.id);
    setProjects(updatedProjects);

    // Delete tasks
    const { error } = await supabaseBrowser
      .from("tasks")
      .delete()
      .eq("project_id", project.id);
    if (error) {
      console.error(error);
    }

    // Delete sections
    const { error: deleteError } = await supabaseBrowser
      .from("sections")
      .delete()
      .eq("project_id", project.id);
    if (deleteError) {
      console.error(deleteError);
    }

    // Delete project
    const { error: projectError } = await supabaseBrowser
      .from("projects")
      .delete()
      .eq("id", project.id);
    if (projectError) {
      console.error(projectError);
    }
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
      onSubmit={handleProjectDelete}
    />
  );
};

export default ProjectDeleteConfirm;
