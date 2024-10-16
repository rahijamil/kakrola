import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { ChevronRight } from "lucide-react";
import React from "react";
import ProjectItem from "./ProjectItem";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useScreen from "@/hooks/useScreen";
import PageItem from "./PageItem";
import ChannelItem from "./ChannelItem";

const FavoriteProjects = ({
  setShowFavoritesProjects,
  showFavoritesProjects,
}: {
  setShowFavoritesProjects: any;
  showFavoritesProjects: boolean;
}) => {
  const {
    projects,
    pages,
    channels,
    sidebarLoading,
    personalMembers,
    teamMembers,
  } = useSidebarDataProvider();
  const pathname = usePathname();
  const { screenWidth } = useScreen();

  // Create sets of favorite project, page, and channel IDs from both personal and team members
  const favoriteProjectIds = new Set([
    ...personalMembers
      .filter((member) => member.settings.is_favorite)
      .map((member) => member.project_id),
    ...teamMembers
      .flatMap((member) => member.settings.projects)
      .filter((project) => project.is_favorite)
      .map((project) => project.id),
  ]);

  const favoritePageIds = new Set([
    ...personalMembers
      .filter((member) => member.settings.is_favorite)
      .map((member) => member.page_id),
    ...teamMembers
      .flatMap((member) => member.settings.pages)
      .filter((page) => page.is_favorite)
      .map((page) => page.id),
  ]);

  const favoriteChannelIds = new Set([
    ...teamMembers
      .flatMap((member) => member.settings.channels)
      .filter((channel) => channel.is_favorite)
      .map((channel) => channel.id),
  ]);

  const favoriteProjects = projects.filter((project) =>
    favoriteProjectIds.has(project.id)
  );

  const favoritePages = pages.filter((page) => favoritePageIds.has(page.id));

  const favoriteChannels = channels.filter((channel) =>
    favoriteChannelIds.has(channel.id)
  );

  const hasFavorite =
    favoriteProjects.length > 0 ||
    favoritePages.length > 0 ||
    favoriteChannels.length > 0;

  return (
    <div>
      {sidebarLoading ? (
        <Skeleton height={16} width={150} borderRadius={9999} />
      ) : (
        <>
          {hasFavorite && (
            <div className="w-full flex items-center justify-between p-1 pl-4 text-text-600 rounded-lg transition-colors group">
              <div className="flex items-center gap-2 pl-1">
                <span className="font-medium text-xs">Favorites</span>
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

      {showFavoritesProjects && hasFavorite && (
        <motion.div
          initial={{ opacity: 0.5, height: 0, y: -10 }}
          animate={{
            opacity: 1,
            height: "auto",
            y: 0,
            transition: { type: "spring" },
          }}
          exit={{ opacity: 0.5, height: 0, y: -10 }}
          className="bg-text-100 dark:bg-surface md:bg-transparent md:dark:bg-transparent rounded-lg md:rounded-none overflow-hidden"
        >
          <ul>
            {favoriteProjects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                pathname={pathname}
                forFavorites
              />
            ))}

            {favoritePages.map((page) => (
              <PageItem key={page.id} page={page} pathname={pathname} forFavorites />
            ))}

            {favoriteChannels.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                pathname={pathname}
                forFavorites
              />
            ))}
          </ul>
        </motion.div>
      )}

      <div className="space-y-2">
        {sidebarLoading &&
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
