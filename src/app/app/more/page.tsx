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

const moreMenuItems: {
  id: number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
  path?: string;
  onClick?: () => void;
}[] = [{ id: 1, icon: Inbox, text: "Inbox", path: "/app/inbox" }];

const MobileMorePage = () => {
  const { screenWidth } = useScreen();
  const sidebarWidth = screenWidth;

  const { teams, sidebarLoading } = useSidebarDataProvider();

  const [showFavoritesProjects, setShowFavoritesProjects] = useState(true);

  const pathname = usePathname();

  if (screenWidth > 768) {
    return null;
  }

  return (
    <>
      <aside className="h-[calc(100vh-57px)] flex flex-col w-full">
        <div className="mb-4 p-2 px-4 flex items-center justify-between relative border-b border-text-100">
          <ProfileMoreOptions />

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
                <Bell strokeWidth={1.5} width={20} />
              </button>

              <button
                className={`text-text-700 hover:bg-primary-50 rounded-lg transition-colors duration-150 z-10 w-8 h-8 flex items-center justify-center `}
              >
                <Settings strokeWidth={1.5} width={20} />
              </button>
            </div>
          )}
        </div>

        <nav className="flex-grow overflow-y-auto space-y-4 px-4 md:px-2">
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
                      className={`flex items-center p-2 rounded-lg transition-colors duration-150 text-text-900 ${
                        item.path === pathname
                          ? "bg-primary-100"
                          : "md:hover:bg-primary-50"
                      }`}
                    >
                      <item.icon strokeWidth={1.5} className="w-5 h-5 mr-3" />
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
                      <item.icon strokeWidth={1.5} className="w-5 h-5 mr-3" />
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

          {teams.map((team) => (
            <TeamProjects
              key={team.id}
              team={team}
              sidebarWidth={sidebarWidth}
            />
          ))}
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
            <SwatchBook strokeWidth={1.5} className="w-5 h-5 mr-3" />
            Templates
          </Link>
        </div> */}
      </aside>
    </>
  );
};

export default MobileMorePage;
