"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
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
  MessagesSquare,
  Plus,
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

const Sidebar = ({ sidebarWidth }: { sidebarWidth: number }) => {
  const pathname = usePathname();

  const { teams, sidebarLoading } = useSidebarDataProvider();

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showFavoritesProjects, setShowFavoritesProjects] = useState(true);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState<boolean | number>(false);

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [teamId, setTeamId] = useState<number | null>(null);

  const router = useRouter();

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

              <button
                onClick={() => setShowAddTaskModal(true)}
                className="flex items-center gap-1 text-primary-600 font-semibold hover:bg-primary-50 rounded-lg transition-colors duration-150 z-10 w-8 h-8 justify-center"
              >
                <div className="w-5 h-5 bg-primary-500 rounded-full">
                  <Plus className="w-5 h-5 text-surface" strokeWidth={1.5} />
                </div>
              </button>
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
                      className={`flex items-center p-2 rounded-lg transition-colors duration-150 text-text-900 ${
                        item.path === pathname
                          ? "bg-primary-100"
                          : "hover:bg-primary-50"
                      }`}
                    >
                      <item.icon strokeWidth={1.5} className="w-5 h-5 mr-3 text-primary-500" />
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

          <Personal
            sidebarWidth={sidebarWidth}
            setShowAddProjectModal={setShowAddProjectModal}
          />

          {teams.map((team) => (
            <TeamProjects
              key={team.id}
              team={team}
              sidebarWidth={sidebarWidth}
              setTeamId={setTeamId}
            />
          ))}
        </nav>

        <div className="p-2">
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
        </div>
      </aside>

      {showAddTaskModal && (
        <AddTaskModal onClose={() => setShowAddTaskModal(false)} />
      )}

      {showLogoutConfirm && (
        <ConfirmAlert
          title="Log out?"
          description="Are you sure you want to log out?"
          onCancel={() => setShowLogoutConfirm(false)}
          submitBtnText="Log out"
          loading={logoutLoading}
          onConfirm={async () => {
            setLogoutLoading(true);
            try {
              const response = await axios("/api/auth/signout", {
                method: "POST",
              });

              if (response.data.success) {
                router.push("/auth/login");
              } else {
                // Handle error case (e.g., show an error message)
                console.error("Failed to log out:", response.data.message);
              }
            } catch (error) {
              console.error("Error during logout:", error);
            } finally {
              setLogoutLoading(false);
            }
          }}
        />
      )}

      {showAddTeam && <AddTeam onClose={() => setShowAddTeam(false)} />}

      {showAddProjectModal && (
        <AddEditProject onClose={() => setShowAddProjectModal(false)} />
      )}

      {teamId && (
        <AddEditProject workspaceId={teamId} onClose={() => setTeamId(null)} />
      )}
    </>
  );
};

export default Sidebar;