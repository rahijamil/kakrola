import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { ChevronRight, Heart } from "lucide-react";
import React from "react";
import ProjectItem from "./ProjectItem";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useScreen from "@/hooks/useScreen";

const FavoriteProjects = ({
  setShowFavoritesProjects,
  showFavoritesProjects,
}: {
  setShowFavoritesProjects: any;
  showFavoritesProjects: boolean;
}) => {
  const { projects, projectsLoading, projectMembers } =
    useSidebarDataProvider();
  const pathname = usePathname();

  // Create a set of favorite project IDs
  const favoriteProjectIds = new Set(
    projectMembers
      .filter((member) => member.project_settings.is_favorite)
      .map((member) => member.project_id)
  );

  const hasFavoriteProjects = projects.some((project) =>
    favoriteProjectIds.has(project.id)
  );

  // Create a map of project ID to favorite status from userProjectSettings
  const favoritesMap = new Map(
    projectMembers.map((member) => [
      member.project_id,
      member.project_settings.is_favorite,
    ])
  );

  // Filter projects based on userProjectSettings
  const favoriteProjects = projects.filter(
    (project) => favoritesMap.get(project.id) === true
  );

  const { screenWidth } = useScreen();

  return (
    <div>
      {projectsLoading ? (
        <Skeleton height={16} width={150} borderRadius={9999} />
      ) : (
        <>
          {hasFavoriteProjects && (
            <div className="w-full flex items-center justify-between p-1 text-text-600 rounded-lg transition-colors">
              <div className="flex items-center gap-2 pl-1">
                <Heart strokeWidth={1.5} size={20} />
                <span className="font-medium">Favorites</span>
              </div>

              <div
                className={`${
                  screenWidth > 768 && "opacity-0 group-hover:opacity-100"
                } transition flex items-center`}
              >
                <button
                  className="p-1 hover:bg-primary-50 rounded-lg transition"
                  onClick={() =>
                    setShowFavoritesProjects(!showFavoritesProjects)
                  }
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
          )}
        </>
      )}

      {showFavoritesProjects && hasFavoriteProjects && (
        <motion.div
          initial={{ opacity: 0.5, height: 0, y: -10 }}
          animate={{
            opacity: 1,
            height: "auto",
            y: 0,
            transition: { type: "spring" },
          }}
          exit={{ opacity: 0.5, height: 0, y: -10 }}
        >
          <ul>
            {favoriteProjects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                pathname={pathname}
              />
            ))}
          </ul>
        </motion.div>
      )}

      <div className="space-y-2">
        {projectsLoading &&
          [1, 2, 3, 4, 5].map((_i, index) => (
            <div key={_i} className="flex items-center gap-2">
              <Skeleton height={28} width={28} borderRadius={9999} />
              <Skeleton height={16} borderRadius={9999} width={150} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default FavoriteProjects;
