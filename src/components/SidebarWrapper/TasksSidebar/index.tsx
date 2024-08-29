"use client";
import React, { useEffect, useState } from "react";
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
  SwatchBook,
} from "lucide-react";
import AddTaskTextButton from "@/components/AddTaskTextButton";
import AddTaskModal from "@/components/AddTask/AddTaskModal";
import MyProjects from "./MyProjects";
import FavoriteProjects from "./FavoriteProjects";
import TeamProjects from "./TeamProjects";

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputField =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement instanceof HTMLElement &&
          activeElement.isContentEditable);

      if (event.key === "Escape") {
        event.preventDefault();

        setShowAddTaskModal(false);
      }

      if (event.key.toLowerCase() == "q" && !isInputField) {
        event.preventDefault();
        setShowAddTaskModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <aside className="h-full flex flex-col group w-full">
        {/* here will notification icons */}
        <div className="p-4 px-2 flex items-center justify-between relative">
          <div className="font-bold text-primary-500">Kakrola</div>

          <div
            className={`flex items-center justify-end w-full transition duration-150 ${
              sidebarWidth > 220 ? "gap-2" : "gap-1"
            }`}
          >
            {/* <button
              className={`text-text-700 hover:bg-primary-50 rounded-full transition-colors duration-150 z-10 w-8 h-8 flex items-center justify-center`}
            >
              <Bell strokeWidth={1.5} width={20} />
            </button> */}
            <button
              className={`text-text-700 hover:bg-primary-50 rounded-full transition-colors duration-150 z-10 w-8 h-8 flex items-center justify-center `}
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
                className={`flex items-center px-2 py-2 rounded-full transition-colors duration-150 text-text-700 w-full cursor-pointer hover:bg-primary-50`}
              >
                <AddTaskTextButton />
              </div>
            </li>
            {menuItems.map((item) => (
              <li key={item.id}>
                {item.path ? (
                  <Link
                    href={item.path}
                    className={`flex items-center p-2 rounded-full transition-colors duration-150 text-text-900 ${
                      item.path === pathname
                        ? "bg-primary-100"
                        : "hover:bg-primary-50"
                    }`}
                  >
                    <item.icon strokeWidth={1.5} className="w-5 h-5 mr-3" />
                    {item.text}
                  </Link>
                ) : (
                  <button
                    className={`flex items-center p-2 rounded-full transition-colors duration-150 w-full ${
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

        <div className="p-2">
          <Link
            href={"/app/templates"}
            className={`flex items-center p-2 rounded-full transition-colors duration-150 text-text-900 ${
              pathname.startsWith("/app/templates")
                ? "bg-primary-100"
                : "hover:bg-primary-50"
            }`}
          >
            <SwatchBook strokeWidth={1.5} className="w-5 h-5 mr-3" />
            Templates
          </Link>
        </div>
      </aside>

      {showAddTaskModal && (
        <AddTaskModal onClose={() => setShowAddTaskModal(false)} />
      )}
    </>
  );
};

export default TasksSidebar;
