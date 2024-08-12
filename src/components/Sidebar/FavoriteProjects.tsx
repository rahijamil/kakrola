import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ChevronRight } from "lucide-react";
import React from "react";
import ProjectItem from "./ProjectItem";
import { usePathname } from "next/navigation";

const FavoriteProjects = ({
  setShowFavoritesProjects,
  showFavoritesProjects,
}: {
  setShowFavoritesProjects: any;
  showFavoritesProjects: boolean;
}) => {
  const { projects } = useTaskProjectDataProvider();
  const pathname = usePathname();
  return (
    <div className="mt-4 px-2">
      <div className="w-full flex items-center justify-between p-1 text-gray-700 rounded-md transition-colors">
        <span className="font-medium">Favorites</span>

        <div className="opacity-0 group-hover:opacity-100 transition flex items-center">
          <button
            className="p-1 hover:bg-gray-200 rounded-md transition"
            onClick={() => setShowFavoritesProjects(!showFavoritesProjects)}
          >
            <ChevronRight
              strokeWidth={1.5}
              className={`w-[18px] h-[18px] transition-transform transform ${
                showFavoritesProjects ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {showFavoritesProjects && (
        <ul className="ml-2">
          {projects
            .filter((project) => project.is_favorite)
            .map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                pathname={pathname}
              />
            ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteProjects;
