import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType } from "@/types/project";
import { supabaseBrowser } from "@/utils/supabase/client";

const useFavorite = ({project}: {project: ProjectType}) => {
  const { projects, setProjects } = useTaskProjectDataProvider();

  const handleFavorite = async () => {
    const updatedProjects = projects.map((p) => {
      if (p.id === project.id) {
        return { ...p, is_favorite: !p.is_favorite };
      }
      return p;
    });

    setProjects(updatedProjects);

    const { error } = await supabaseBrowser
      .from("projects")
      .update({ is_favorite: !project.is_favorite })
      .eq("id", project.id);

    if (error) {
      console.error(error);
    }
  };

  return {
    handleFavorite,
  };
};

export default useFavorite;
