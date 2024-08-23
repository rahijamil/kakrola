"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { useAuthProvider } from "@/context/AuthContext";
import {
  Inbox,
  Calendar,
  ChevronDown,
  PanelLeft,
  LucideProps,
  Search,
  CalendarDays,
  LayoutPanelTop,
  Bell,
} from "lucide-react";
import AddTaskTextButton from "@/components/AddTaskTextButton";
import AddTaskModal from "@/components/AddTask/AddTaskModal";
import ProfileMoreOptions from "@/components/SidebarWrapper/TasksSidebar/ProfileMoreOptions";
import Image from "next/image";
import MyProjects from "./MyProjects";
import FavoriteProjects from "./FavoriteProjects";
import TeamProjects from "./TeamProjects";
import AddTeam from "../../AddTeam";

const menuItems: {
  id: number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
  path?: string;
  onClick?: () => void;
}[] = [
  { id: 1, icon: Search, text: "Search", path: "/app/search" },
  { id: 2, icon: Inbox, text: "Inbox", path: "/app/inbox" },
  { id: 3, icon: Calendar, text: "Today", path: "/app" },
  { id: 4, icon: CalendarDays, text: "Upcoming", path: "/app/upcoming" },
  {
    id: 5,
    icon: LayoutPanelTop,
    text: "Filters & Labels",
    path: "/app/filters-labels",
  },
];

const TasksSidebar = ({ sidebarWidth }: { sidebarWidth: number }) => {
  const pathname = usePathname();
  const { projects, teams } = useTaskProjectDataProvider();

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showFavoritesProjects, setShowFavoritesProjects] = useState(true);

  return (
    <>
      <aside className="h-full flex flex-col group w-full">
        {/* here will notification icons */}
        <div className="p-4 px-2 flex items-center justify-between relative">
          <div className="font-bold">Organization</div>

          <div
            className={`flex items-center transition ${
              sidebarWidth > 220 ? "gap-2" : "gap-1"
            }`}
          >
            <button
              className={`text-gray-700 hover:bg-gray-200 rounded-lg transition-colors z-10 w-8 h-8 flex items-center justify-center`}
            >
              <Bell strokeWidth={1.5} width={20} />
            </button>
            <button
              className={`text-gray-700 hover:bg-gray-200 rounded-lg transition-colors z-10 w-8 h-8 flex items-center justify-center `}
            >
              <Bell strokeWidth={1.5} width={20} />
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
                    className={`flex items-center p-2 rounded-lg transition-colors w-full ${
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

      {showAddTaskModal && (
        <AddTaskModal onClose={() => setShowAddTaskModal(false)} />
      )}
    </>
  );
};

export default TasksSidebar;
