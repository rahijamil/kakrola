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
  LogOut,
  UserCircle,
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
import Image from "next/image";
import { useAuthProvider } from "@/context/AuthContext";

const MobileMorePage = () => {
  const { screenWidth } = useScreen();
  const { profile } = useAuthProvider();

  const { sidebarLoading } = useSidebarDataProvider();
  const router = useRouter();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const pathname = usePathname();

  if (screenWidth > 768) {
    return null;
  }

  const moreMenuItems: {
    id: number;
    name: string;
    items: {
      id: number;
      icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
      text: string;
      path?: string;
      onClick?: () => void;
      divide?: boolean;
    }[];
  }[] = [
    {
      id: 1,
      name: "You",
      items: [
        {
          id: 1,
          icon: UserCircle,
          text: "Profile",
          path: "/app/profile",
          divide: true,
        },
        {
          id: 2,
          icon: Settings,
          text: "Settings",
          path: "/app/settings",
          divide: true,
        },
        {
          id: 3,
          icon: LogOut,
          text: "Log out",
          onClick: () => {
            if (logoutLoading) {
              return;
            }
            setShowLogoutConfirm(true);
          },
        },
      ],
    },
  ];

  return (
    <>
      <aside className="h-[calc(100vh-57px)] flex flex-col w-full">
        <div className="flex items-center gap-4 p-4">
          <Image
            src={profile?.avatar_url || "/default_avatar.png"}
            alt="avatar"
            className="max-w-12 max-h-12 rounded-lg object-cover"
            width={48}
            height={48}
          />

          <div>
            <h1 className="font-medium">{profile?.full_name}</h1>
            <p className="text-text-500 text-xs">{profile?.email}</p>
          </div>
        </div>

        <nav className="flex-grow overflow-y-auto space-y-4">
          <ul>
            {moreMenuItems.map((group) => (
              <li key={group.id}>
                <div className="text-text-500 text-sm font-medium mb-2 px-4">
                  {group.name}
                </div>

                <ul>
                  {group.items.map((item) =>
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
                              ev.currentTarget.classList.add("bg-text-100")
                            }
                            onTouchEnd={(ev) =>
                              ev.currentTarget.classList.remove("bg-text-100")
                            }
                            href={item.path}
                            className={`flex items-center py-2.5 px-4 transition-colors duration-150 text-text-900 ${
                              item.path === pathname
                                ? "bg-primary-100"
                                : "md:hover:bg-text-100"
                            }`}
                          >
                            <item.icon
                              strokeWidth={1.5}
                              className="w-5 h-5 mr-3"
                            />
                            {item.text}
                          </Link>
                        ) : (
                          <button
                            onTouchStart={(ev) =>
                              ev.currentTarget.classList.add("bg-text-100")
                            }
                            onTouchEnd={(ev) =>
                              ev.currentTarget.classList.remove("bg-text-100")
                            }
                            className={`flex items-center py-2.5 px-4 transition-colors duration-150 w-full ${
                              item.path === pathname
                                ? "bg-primary-500 text-surface"
                                : "md:hover:bg-text-100 text-text-900"
                            }`}
                            onClick={item.onClick}
                          >
                            <item.icon
                              strokeWidth={1.5}
                              className="w-5 h-5 mr-3"
                            />
                            {item.text}
                          </button>
                        )}

                        {item.divide && (
                          <div className="h-px bg-text-100"></div>
                        )}
                      </li>
                    )
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

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
    </>
  );
};

export default MobileMorePage;
