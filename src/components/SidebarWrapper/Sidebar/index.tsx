"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import {
  Inbox,
  LucideProps,
  Search,
  Bell,
  SwatchBook,
  MessagesSquare,
  Plus,
  ChevronRight,
  CheckSquare,
} from "lucide-react";
import Personal from "./Personal";
import FavoriteProjects from "./FavoriteProjects";
import TeamProjects from "./TeamProjects";
import ProfileMoreOptions from "./ProfileMoreOptions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useScreen from "@/hooks/useScreen";
import { motion } from "framer-motion";
import SidebarCreateMore from "./SidebarCreateMore";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthProvider } from "@/context/AuthContext";
import { getNotifications } from "@/lib/queries";
import SidebarNotifications from "./SidebarNotifications";
import AddTeam from "@/components/AddTeam";
import Dropdown from "@/components/ui/Dropdown";
import DmSidebar from "@/app/app/dms/DmSidebar";
import DmDropdown from "./DmDropdown";
import KakrolaLogo from "@/app/kakrolaLogo";

const menuItems: {
  id: number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: "My Tasks" | "Inbox" | "Search" | "DMs";
  path?: string;
  onClick?: () => void;
}[] = [
  { id: 1, icon: CheckSquare, text: "My Tasks", path: "/app" },
  { id: 2, icon: Inbox, text: "Inbox", path: "/app/inbox" },
  { id: 3, icon: Search, text: "Search", path: "#" },
  { id: 4, icon: MessagesSquare, text: "DMs", path: "/app/dms" },
];

const Sidebar = ({
  sidebarWidth,
  setShowAddTeam,
  setShowLogoutConfirm,
  setShowAddAnotherAccount,
  quickActions,
  setQuickActions,
}: {
  sidebarWidth: number;
  setShowAddTeam?: React.Dispatch<React.SetStateAction<boolean | number>>;
  setShowLogoutConfirm?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddAnotherAccount?: React.Dispatch<React.SetStateAction<boolean>>;
  quickActions?: {
    showAddTaskModal: boolean;
    showAddSectionModal: boolean;
    showCreateDMModal: boolean;
    showCreateThreadModal: boolean;
    showCreateThreadReplyModal: boolean;
    isOpen: boolean;
  };
  setQuickActions?: React.Dispatch<
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
  const [addTeam, setAddTeam] = useState(false);

  const [isProfileMoreOpen, setIsProfileOpen] = useState(false);

  return (
    <aside className="h-full flex flex-col w-full select-none">
      <div
        className={`md:mb-4 md:mt-2 py-1 pl-2 pr-1 flex items-center justify-between border-transparent md:hover:bg-primary-50 md:hover:border-primary-200 md:border-l-4 transition cursor-pointer`}
        onClick={() => setIsProfileOpen(!isProfileMoreOpen)}
      >
        {setShowLogoutConfirm && setShowAddAnotherAccount ? (
          <ProfileMoreOptions
            setShowLogoutConfirm={setShowLogoutConfirm}
            setShowAddAnotherAccount={setShowAddAnotherAccount}
            isOpen={isProfileMoreOpen}
            setIsOpen={setIsProfileOpen}
          />
        ) : (
          <>
            <div className="p-2 px-4 flex items-center justify-between relative w-full">
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
                    className={`text-text-700 rounded-lg z-10 w-8 h-8 flex items-center justify-center active:bg-text-100`}
                    onTouchStart={(ev) =>
                      ev.currentTarget.classList.add("bg-text-100")
                    }
                    onTouchEnd={(ev) =>
                      ev.currentTarget.classList.remove("bg-text-100")
                    }
                  >
                    <Search strokeWidth={1.5} width={20} />
                  </button>

                  <SidebarNotifications />
                </div>
              )}
            </div>
          </>
        )}

        {quickActions &&
          setQuickActions &&
          (sidebarLoading ? (
            <div className="flex items-center w-full justify-end gap-2">
              <Skeleton width={28} height={28} borderRadius={8} />
              <Skeleton width={28} height={28} borderRadius={8} />
              <Skeleton width={28} height={28} borderRadius={8} />
            </div>
          ) : (
            <div
              className={`flex items-center justify-end w-full transition duration-150 ${
                sidebarWidth > 220 ? "gap-2" : "gap-1"
              }`}
            >
              <SidebarNotifications />

              <SidebarCreateMore
                quickActions={quickActions}
                setQuickActions={setQuickActions}
              />
            </div>
          ))}
      </div>

      <nav className="flex-grow overflow-y-auto space-y-4">
        <ul>
          {menuItems
            .filter((item) => (screenWidth > 768 ? item : item.text == "Inbox"))
            .map((item) =>
              sidebarLoading ? (
                <Skeleton
                  key={item.id}
                  height={16}
                  width={150}
                  borderRadius={8}
                  style={{ marginBottom: ".5rem" }}
                />
              ) : (
                <li key={item.id}>
                  {item.path ? (
                    item.path == "/app/dms" ? (
                      <DmDropdown item={item} />
                    ) : (
                      <Link
                        href={item.path}
                        className={`flex items-center p-2 px-4 transition-colors duration-150 font-medium md:font-normal w-full md:border-l-4 h-9 active:bg-text-100 ${
                          item.path === pathname
                            ? "bg-primary-100 text-text-900 border-primary-300"
                            : "md:hover:bg-primary-50 border-transparent hover:border-primary-200 text-text-700"
                        }`}
                        onTouchStart={(ev) =>
                          ev.currentTarget.classList.add("bg-text-100")
                        }
                        onTouchEnd={(ev) =>
                          ev.currentTarget.classList.remove("bg-text-100")
                        }
                      >
                        <item.icon
                          strokeWidth={1.5}
                          className="w-5 h-5 mr-3 text-primary-500"
                        />
                        {item.text}
                      </Link>
                    )
                  ) : (
                    <button
                      className={`flex items-center p-2 rounded-lg transition-colors duration-150 w-full h-9 active:bg-text-100 ${
                        item.path === pathname
                          ? "bg-primary-500 text-surface"
                          : "hover:bg-primary-50 text-text-700"
                      }`}
                      onClick={item.onClick}
                      onTouchStart={(ev) =>
                        ev.currentTarget.classList.add("bg-text-100")
                      }
                      onTouchEnd={(ev) =>
                        ev.currentTarget.classList.remove("bg-text-100")
                      }
                    >
                      <item.icon strokeWidth={1.5} className="w-5 h-5 mr-3" />
                      {item.text}
                    </button>
                  )}
                </li>
              )
            )}
        </ul>

        <div className="space-y-2">
          <FavoriteProjects
            setShowFavoritesProjects={setShowFavoritesProjects}
            showFavoritesProjects={showFavoritesProjects}
          />

          <Personal sidebarWidth={sidebarWidth} />

          <div>
            {sidebarLoading ? (
              <Skeleton height={16} width={150} borderRadius={8} />
            ) : (
              <div
                onClick={() => setShowWorkspaces(!showWorkspaces)}
                className={`group flex items-center justify-between transition-colors duration-150 pr-4 font-medium md:font-normal w-full md:border-l-4 cursor-pointer h-9 active:bg-text-100 ${
                  pathname.startsWith("/app/projects")
                    ? "md:bg-primary-100 text-text-900 md:border-primary-200"
                    : "md:hover:bg-primary-50 border-transparent md:hover:border-primary-200 text-text-700"
                }`}
                onTouchStart={(ev) =>
                  ev.currentTarget.classList.add("bg-text-100")
                }
                onTouchEnd={(ev) =>
                  ev.currentTarget.classList.remove("bg-text-100")
                }
              >
                <div
                  className={`flex items-center py-2 pl-4 ${
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
                      Teamspaces
                    </span>
                  </div>
                </div>

                <div
                  className={`${
                    screenWidth > 768 && "opacity-0 group-hover:opacity-100"
                  } transition flex items-center`}
                  onClick={(ev) => ev.stopPropagation()}
                >
                  {/* <button
                    className="p-1 md:hover:bg-primary-100 rounded-lg transition duration-150"
                    onClick={() => setShowWorkspaces(!showWorkspaces)}
                  >
                    <ChevronRight
                      strokeWidth={1.5}
                      className={`w-[18px] h-[18px] transition-transform duration-150 transform ${
                        showWorkspaces ? "rotate-90" : ""
                      }`}
                    />
                  </button> */}

                  <button
                    className={`p-1 rounded-lg transition ${
                      addTeam ? "md:bg-primary-100" : "md:hover:bg-primary-100"
                    }`}
                    onClick={() => setAddTeam(true)}
                  >
                    <Plus
                      strokeWidth={1.5}
                      className={`w-5 md:w-[18px] h-5 md:h-[18px] transition-transform duration-150`}
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
        </div>
      </nav>

      <div className="py-2">
        {sidebarLoading ? (
          <Skeleton
            height={16}
            width={150}
            borderRadius={8}
            style={{ marginBottom: ".5rem" }}
          />
        ) : (
          <Link
            href={"/app/templates"}
            className={`flex items-center p-2 px-4 transition-colors duration-150 font-medium md:font-normal w-full border-l-4 ${
              pathname.startsWith("/app/templates")
                ? "bg-primary-100 text-text-900 border-primary-300"
                : "md:hover:bg-primary-50 border-transparent hover:border-primary-200 text-text-700"
            }`}
          >
            <SwatchBook
              strokeWidth={1.5}
              className="w-5 h-5 mr-3 text-primary-500"
            />
            Templates
          </Link>
        )}
      </div>

      {addTeam && <AddTeam onClose={() => setAddTeam(false)} />}
    </aside>
  );
};

export default Sidebar;
