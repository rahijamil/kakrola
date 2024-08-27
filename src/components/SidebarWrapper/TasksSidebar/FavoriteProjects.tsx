import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ChevronRight } from "lucide-react";
import React from "react";
import ProjectItem from "./ProjectItem";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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
      <div className="w-full flex items-center justify-between p-1 text-text-700 rounded-lg transition-colors">
        <span className="font-medium">Favorites</span>

        <div className="opacity-0 group-hover:opacity-100 transition flex items-center">
          <button
            className="p-1 hover:bg-primary-50 rounded-lg transition"
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
        </motion.div>
      )}
    </div>
  );
};

export default FavoriteProjects;
