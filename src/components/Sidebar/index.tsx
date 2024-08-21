"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { TaskType } from "@/types/project";
import { useAuthProvider } from "@/context/AuthContext";
import {
  Inbox,
  Calendar,
  ChevronDown,
  PanelLeft,
  LucideProps,
} from "lucide-react";
import AddTaskTextButton from "@/components/AddTaskTextButton";
import AddTaskModal from "@/components/AddTask/AddTaskModal";
import ProfileMoreOptions from "@/components/Sidebar/ProfileMoreOptions";
import Image from "next/image";
import MyProjects from "./MyProjects";
import FavoriteProjects from "./FavoriteProjects";
import TeamProjects from "./TeamProjects";
import { motion } from "framer-motion";
import AddTeam from "../AddTeam";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { profile } = useAuthProvider();
  const { projects, teams } = useTaskProjectDataProvider();

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showProfileMoreOptions, setShowProfileMoreOptions] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState<boolean | number>(false);
  const [showFavoritesProjects, setShowFavoritesProjects] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [afterCollapse, setAfterCollapse] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [sidebarLeft, setSidebarLeft] = useState(0);
  const [isResizing, setIsResizing] = useState(false);

  const menuItems: {
    id: number;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    text: string;
    path?: string;
    onClick?: () => void;
  }[] = [
    { id: 2, icon: Inbox, text: "Inbox", path: "/app/inbox" },
    { id: 3, icon: Calendar, text: "Today", path: "/app" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
        setSidebarLeft(-sidebarWidth);
      } else {
        setIsCollapsed(false);
        setSidebarLeft(0);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarWidth]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setSidebarLeft(isCollapsed ? 0 : -sidebarWidth);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(220, Math.min(480, e.clientX));
      setSidebarWidth(newWidth);
      if (isCollapsed) {
        setSidebarLeft(-newWidth);
      }
    },
    [isResizing, isCollapsed]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isCollapsed) {
      setTimeout(() => {
        setAfterCollapse(true);
      }, 150);
    } else {
      setAfterCollapse(false);
    }
  }, [isCollapsed]);

  return (
    <>
      {!isCollapsed && (
        <div
          className="fixed md:static inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed md:relative z-20 flex bg-[#f5f7ff] transition-all duration-200 h-screen whitespace-nowrap ${
          isCollapsed ? "-left-full" : "left-0"
        }`}
        style={{ width: `${sidebarWidth}px`, marginLeft: `${sidebarLeft}px` }}
      >
        <aside className="h-full flex flex-col group w-full">
          <div className="p-4 px-2 flex items-center justify-between relative">
            <div className="relative">
              <button
                className={`flex items-center p-1 rounded-lg transition overflow-hidden whitespace-nowrap text-ellipsis ${
                  showProfileMoreOptions ? "bg-gray-200" : "hover:bg-gray-200"
                } ${sidebarWidth > 220 ? "gap-2" : "gap-1"}`}
                style={{ maxWidth: `${sidebarWidth - 80}px` }}
                onClick={() => setShowProfileMoreOptions(true)}
              >
                <Image
                  src={profile?.avatar_url || "/default-avatar.png"}
                  alt={profile?.full_name || profile?.username || ""}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap transition">
                  {profile?.full_name.split(" ")[0] || profile?.username}
                </span>
                <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
              </button>
              {showProfileMoreOptions && (
                <ProfileMoreOptions
                  onClose={() => setShowProfileMoreOptions(false)}
                  setShowAddTeam={setShowAddTeam}
                />
              )}
            </div>

            <div
              className={`flex items-center transition ${
                sidebarWidth > 220 ? "gap-2" : "gap-1"
              }`}
            >
              <button
                onClick={toggleSidebar}
                className={`text-gray-700 hover:bg-gray-200 rounded-lg transition-colors z-30 w-8 h-8 flex items-center justify-center ${
                  afterCollapse
                    ? "fixed top-3 left-3 bg-white"
                    : "bg-transparent"
                }`}
              >
                <PanelLeft strokeWidth={1.5} width={20} />
              </button>
            </div>
          </div>

          <nav className="flex-grow overflow-y-auto">
            <ul className="px-2">
              <li>
                <div
                  onClick={() => setShowAddTaskModal(true)}
                  className={`flex items-center px-2 py-2 rounded-lg transition-colors text-gray-700 w-full cursor-pointer hover:bg-gray-200`}
                >
                  <AddTaskTextButton />
                </div>
              </li>
              {menuItems.map((item) => (
                <li key={item.id}>
                  {item.path ? (
                    <Link
                      href={item.path}
                      className={`flex items-center p-2 rounded-lg transition-colors ${
                        item.path === pathname
                          ? "bg-indigo-100 text-indigo-700"
                          : "hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <item.icon strokeWidth={1.5} className="w-5 h-5 mr-3" />
                      {item.text}
                    </Link>
                  ) : (
                    <button
                      className={`flex items-center px-2 py-2 rounded-lg transition-colors w-full ${
                        item.path === pathname
                          ? "bg-indigo-100 text-indigo-700"
                          : "hover:bg-gray-200 text-gray-700"
                      }`}
                      onClick={item.onClick}
                    >
                      <item.icon strokeWidth={1.5} className="w-5 h-5 mr-3" />
                      {item.text}
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {projects.filter((p) => p.is_favorite).length > 0 && (
              <FavoriteProjects
                setShowFavoritesProjects={setShowFavoritesProjects}
                showFavoritesProjects={showFavoritesProjects}
              />
            )}

            <MyProjects sidebarWidth={sidebarWidth} />

            {teams.map((team) => (
              <TeamProjects
                key={team.id}
                team={team}
                sidebarWidth={sidebarWidth}
              />
            ))}
          </nav>
        </aside>

        <div
          className={`absolute left-full w-1 h-screen cursor-col-resize transition hidden md:block ${
            isResizing ? "bg-gray-200" : "hover:bg-gray-200 bg-transparent"
          }`}
          onMouseDown={handleMouseDown}
        ></div>
      </div>

      {showAddTaskModal && (
        <AddTaskModal onClose={() => setShowAddTaskModal(false)} />
      )}

      {showAddTeam && <AddTeam onClose={() => setShowAddTeam(false)} />}
    </>
  );
};

export default Sidebar;
