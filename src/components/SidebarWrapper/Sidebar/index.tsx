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
  ChevronRight,
} from "lucide-react";
import AddTaskModal from "@/components/AddTask/AddTaskModal";
import Personal from "./Personal";
import FavoriteProjects from "./FavoriteProjects";
import TeamProjects from "./TeamProjects";
import ProfileMoreOptions from "./ProfileMoreOptions";
import ConfirmAlert from "@/components/AlertBox/ConfirmAlert";
import axios from "axios";
import AddTeam from "@/components/AddTeam";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AddEditProject from "@/components/AddEditProject";
import AddEditChannel from "@/components/AddEditChannel";
import useScreen from "@/hooks/useScreen";
import { motion } from "framer-motion";
import SidebarCreateMore from "./SidebarCreateMore";

const menuItems: {
  id: number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
  path?: string;
  onClick?: () => void;
}[] = [
  { id: 1, icon: Calendar, text: "My Tasks", path: "/app" },
  { id: 2, icon: Inbox, text: "Inbox", path: "/app/inbox" },
  { id: 3, icon: Search, text: "Search", path: "#" },
  { id: 4, icon: MessagesSquare, text: "DMs", path: "/app/dm" },
];

const Sidebar = ({
  sidebarWidth,
  setShowAddTeam,
  setShowLogoutConfirm,
  quickActions,
  setQuickActions,
}: {
  sidebarWidth: number;
  setShowAddTeam: React.Dispatch<React.SetStateAction<boolean | number>>;
  setShowLogoutConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  quickActions: {
    showAddTaskModal: boolean;
    showAddSectionModal: boolean;
    showCreateDMModal: boolean;
    showCreateThreadModal: boolean;
    showCreateThreadReplyModal: boolean;
    isOpen: boolean;
  };
  setQuickActions: React.Dispatch<
    React.SetStateAction<{
      showAddTaskModal: boolean;
      showAddSectionModal: boolean;
      showCreateDMModal: boolean;
      showCreateThreadModal: boolean;
      showCreateThreadReplyModal: boolean;
      isOpen: boolean;
    }>
  >;
}) => {
  const pathname = usePathname();
  const { screenWidth } = useScreen();

  const { teams, sidebarLoading } = useSidebarDataProvider();

  const [showFavoritesProjects, setShowFavoritesProjects] = useState(true);
  const [showWorkspaces, setShowWorkspaces] = useState(true);

  return (
    <>
      <aside className="h-full flex flex-col group w-full">
        <div className="pb-4 p-2 flex items-center justify-between relative">
          <ProfileMoreOptions
            setShowAddTeam={setShowAddTeam}
            setShowLogoutConfirm={setShowLogoutConfirm}
          />

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

              <SidebarCreateMore
                quickActions={quickActions}
                setQuickActions={setQuickActions}
              />
            </div>
          )}
        </div>

        <nav className="flex-grow overflow-y-auto space-y-4 px-2">
          <ul>
            {menuItems.map((item) =>
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
                      className={`flex items-center p-2 rounded-lg transition-colors duration-150 w-full ${
                        item.path === pathname
                          ? "bg-primary-500 text-surface"
                          : "hover:bg-primary-50 text-text-700"
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

        <div className="p-2">
          <Link
            href={"/app/templates"}
            className={`flex items-center p-2 rounded-lg transition-colors duration-150 font-medium md:font-normal ${
              pathname.startsWith("/app/templates")
                ? "bg-primary-100 text-text-900"
                : "md:hover:bg-primary-50 text-text-700"
            }`}
          >
            <SwatchBook
              strokeWidth={1.5}
              className="w-5 h-5 mr-3 text-primary-500"
            />
            Templates
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
