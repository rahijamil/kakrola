import useFavorite from "@/hooks/useFavorite";
import { ProjectType } from "@/types/project";
import { Heart, HeartOff } from "lucide-react";
import React from "react";

const FavoriteOption = ({ project }: { project: ProjectType }) => {
  const { handleFavorite } = useFavorite({ project });
  return (
    <button
      onClick={handleFavorite}
      className="w-full text-left px-4 py-2 text-sm text-text-700 hover:bg-text-100 transition flex items-center"
    >
      {project.is_favorite ? (
        <HeartOff className="w-4 h-4 mr-4" />
      ) : (
        <Heart strokeWidth={1.5} className="w-4 h-4 mr-4" />
      )}
      {project?.is_favorite ? "Remove from favorites" : "Add to favorites"}
    </button>
  );
};

export default FavoriteOption;
