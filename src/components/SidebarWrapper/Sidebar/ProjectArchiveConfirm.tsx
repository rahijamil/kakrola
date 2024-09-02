import React, { Dispatch, SetStateAction } from "react";
import ConfirmAlert from "../../AlertBox/ConfirmAlert";
import { ProjectType } from "@/types/project";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";

const ProjectArchiveConfirm = ({
  project,
  setShowArchiveConfirm,
}: {
  project: ProjectType;
  setShowArchiveConfirm: Dispatch<SetStateAction<boolean>>;
}) => {
  const { projects, setProjects } = useTaskProjectDataProvider();

  const handleArchive = async () => {
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
