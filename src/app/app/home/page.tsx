"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import {
  Inbox,
  Calendar,
  LucideProps,
  Search,
  Bell,
  SwatchBook,
  MessagesSquare,
  Plus,
  Settings,
  ChevronRight,
} from "lucide-react";
import AddTaskModal from "@/components/AddTask/AddTaskModal";
import ConfirmAlert from "@/components/AlertBox/ConfirmAlert";
import axios from "axios";
import AddTeam from "@/components/AddTeam";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AddEditProject from "@/components/AddEditProject";
import ProfileMoreOptions from "@/components/SidebarWrapper/Sidebar/ProfileMoreOptions";
import FavoriteProjects from "@/components/SidebarWrapper/Sidebar/FavoriteProjects";
import Personal from "@/components/SidebarWrapper/Sidebar/Personal";
import TeamProjects from "@/components/SidebarWrapper/Sidebar/TeamProjects";
import useScreen from "@/hooks/useScreen";
import { motion } from "framer-motion";
import KakrolaLogo from "@/app/kakrolaLogo";

const moreMenuItems: {
  id: number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
  path?: string;
  onClick?: () => void;
}[] = [{ id: 1, icon: Inbox, text: "Inbox", path: "/app/inbox" }];

const MobileHomePage = () => {
  const { screenWidth } = useScreen();
  const sidebarWidth = screenWidth;

  const { teams, sidebarLoading } = useSidebarDataProvider();

  const [showFavoritesProjects, setShowFavoritesProjects] = useState(true);
  const [showWorkspaces, setShowWorkspaces] = useState(true);

  const pathname = usePathname();

  if (screenWidth > 768) {
    return null;
  }

  return (
    <>
      <aside className="h-[calc(100vh-57px)] flex flex-col w-full bg-background">
        <div className="p-2 px-4 flex items-center justify-between relative">
          <div>
            <KakrolaLogo size="sm" />
          </div>

          {sidebarLoading ? (
            <div className="flex items-center w-full justify-end gap-2">
              <Skeleton width={28} height={28} borderRadius={9999} />
              <Skeleton width={28} height={28} borderRadius={9999} />
              <Skeleton width={28} height={28} borderRadius={9999} />
            </div>
          ) : (
            <div
              className={`flex items-center justify-end w-full transition duration-150 ${
                sidebarWidth > 220 ? "gap-2" : "gap-1"
              }`}
            >
              <button
                className={`text-text-700 hover:bg-primary-50 rounded-lg transition-colors duration-150 z-10 w-8 h-8 flex items-center justify-center `}
              >
                <Search strokeWidth={1.5} width={20} />
              </button>

              <button
                className={`text-text-700 hover:bg-primary-50 rounded-lg transition-colors duration-150 z-10 w-8 h-8 flex items-center justify-center `}
              >
                <Bell strokeWidth={1.5} width={20} />
              </button>
            </div>
          )}
        </div>

        <nav className="flex-grow max-h-[calc(100vh-164px)] overflow-y-auto space-y-4 p-4 pb-6 md:pb-0 md:px-2">
          <ul>
            {moreMenuItems.map((item) =>
              sidebarLoading ? (
                <Skeleton
                  key={item.id}
                  height={16}
                  width={150}
                  borderRadius={9999}
                  style={{ marginBottom: ".5rem" }}
                />
              ) : (
                <li key={item.id}>
                  {item.path ? (
                    <Link
                      onTouchStart={(ev) =>
                        ev.currentTarget.classList.add("bg-primary-50")
                      }
                      onTouchEnd={(ev) =>
                        ev.currentTarget.classList.remove("bg-primary-50")
                      }
                      href={item.path}
                      className={`flex items-center p-2 rounded-lg transition-colors duration-150 font-medium md:font-normal ${
                        item.path === pathname
                          ? "bg-primary-100 text-text-900"
                          : "md:hover:bg-primary-50 text-text-700"
                      }`}
                    >
                      <item.icon
                        strokeWidth={1.5}
                        className="w-5 h-5 mr-3 text-primary-500"
                      />
                      {item.text}
                    </Link>
                  ) : (
                    <button
                      onTouchStart={(ev) =>
                        ev.currentTarget.classList.add("bg-primary-50")
                      }
                      onTouchEnd={(ev) =>
                        ev.currentTarget.classList.remove("bg-primary-50")
                      }
                      className={`flex items-center p-2 rounded-lg transition-colors duration-150 w-full ${
                        item.path === pathname
                          ? "bg-primary-500 text-surface"
                          : "md:hover:bg-primary-50 text-text-700"
                      }`}
                      onClick={item.onClick}
                    >
                      <item.icon
                        strokeWidth={1.5}
                        className="w-5 h-5 mr-3 text-primary-500"
                      />
                      {item.text}
                    </button>
                  )}
                </li>
              )
            )}
          </ul>

          <FavoriteProjects
            setShowFavoritesProjects={setShowFavoritesProjects}
            showFavoritesProjects={showFavoritesProjects}
          />

          <Personal sidebarWidth={sidebarWidth} />

          <div>
            {sidebarLoading ? (
              <Skeleton height={16} width={150} borderRadius={9999} />
            ) : (
              <div
                onTouchStart={(ev) =>
                  ev.currentTarget.classList.add("bg-primary-50")
                }
                onTouchEnd={(ev) =>
                  ev.currentTarget.classList.remove("bg-primary-50")
                }
                className={`relative text-text-600 rounded-lg transition md:hover:bg-primary-50 flex items-center justify-between pr-1 cursor-pointer ${
                  pathname.startsWith("/app/projects") && "bg-primary-100"
                }`}
              >
                <div
                  className={`flex items-center pl-2 py-[7px] ${
                    sidebarWidth > 220 ? "gap-2" : "gap-1"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      sidebarWidth > 220 ? "gap-2" : "gap-1"
                    }`}
                    style={{
                      maxWidth: `${
                        sidebarWidth - (teams.length > 3 ? 150 : 80)
                      }px`,
                    }}
                  >
                    <span
                      className={`font-medium text-xs transition duration-150 overflow-hidden whitespace-nowrap text-ellipsis`}
                    >
                      Workspaces
                    </span>
                  </div>
                </div>

                <div
                  className={`${
                    screenWidth > 768 && "opacity-0 group-hover:opacity-100"
                  } transition flex items-center`}
                >
                  <button
                    className="p-1 hover:bg-primary-100 rounded-lg transition duration-150"
                    onClick={() => setShowWorkspaces(!showWorkspaces)}
                  >
                    <ChevronRight
                      strokeWidth={1.5}
                      className={`w-[18px] h-[18px] transition-transform duration-150 transform ${
                        showWorkspaces ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {showWorkspaces && (
              <motion.div>
                {teams.map((team) => (
                  <TeamProjects
                    key={team.id}
                    team={team}
                    sidebarWidth={sidebarWidth}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </nav>

        {/* <div className="p-2">
          <Link
            href={"/app/templates"}
            className={`flex items-center p-2 rounded-lg transition-colors duration-150 text-text-900 ${
              pathname.startsWith("/app/templates")
                ? "bg-primary-100"
                : "hover:bg-primary-50"
            }`}
          >
            <SwatchBook strokeWidth={1.5} className="w-5 h-5 mr-3 text-primary-500" />
            Templates
          </Link>
        </div> */}
      </aside>
    </>
  );
};

export default MobileHomePage;
