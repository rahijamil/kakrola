import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType } from "@/types/project";
import { supabaseBrowser } from "@/utils/supabase/client";
import { Heart, HeartOff } from "lucide-react";
import React from "react";

const FavoriteOption = ({ project }: { project: ProjectType }) => {
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

  return (
    <button
      onClick={handleFavorite}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
    >
      {project.is_favorite ? (
        <HeartOff className="w-4 h-4 mr-4" />
      ) : (
        <Heart strokeWidth={1.5} className="w-4 h-4 mr-4" />
      )}{" "}
      {project?.is_favorite ? "Remove from favorites" : "Add to favorites"}
    </button>
  );
};

export default FavoriteOption;
