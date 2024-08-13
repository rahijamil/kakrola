"use client";

import { useCallback, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Dialog } from "./ui";
import {
  AlarmClock,
  BellIcon,
  Blocks,
  CalendarDays,
  CloudUploadIcon,
  PaletteIcon,
  PanelLeft,
  Plus,
  SettingsIcon,
  SlidersHorizontal,
  SquarePlusIcon,
  TargetIcon,
  UserIcon,
  Users,
  WalletIcon,
  X,
} from "lucide-react";
import AddTeam from "./AddTeam";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import Image from "next/image";

const SettingsModal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { teams } = useTaskProjectDataProvider();

  const [showAddTeam, setShowAddTeam] = useState(false);

  const closeSettings = useCallback(() => {
    router.push("/app");
  }, [router]);

  if (!pathname.startsWith("/app/settings")) {
    return null;
  }

  const menuItems = [
    {
      id: 1,
      name: "Account",
      path: "/app/settings/account",
      icon: UserIcon,
    },
    // {
    //   id: 2,
    //   name: "General",
    //   path: "/app/settings/general",
    //   icon: SettingsIcon,
    // },
    // {
    //   id: 3,
    //   name: "Advanched",
    //   path: "/app/settings/advanched",
    //   icon: SlidersHorizontal,
    // },
    // {
    //   id: 4,
    //   name: "Subscription",
    //   path: "/app/settings/subscription",
    //   icon: WalletIcon,
    // },
    {
      id: 5,
      name: "Theme",
      path: "/app/settings/theme",
      icon: PaletteIcon,
    },
    {
      id: 6,
      name: "Sidebar",
      path: "/app/settings/sidebar",
      icon: PanelLeft,
    },
    // {
    //   id: 7,
    //   name: "Quick Add",
    //   path: "/app/settings/quick-customization",
    //   icon: SquarePlusIcon,
    // },
    // {
    //   id: 8,
    //   name: "Productivity",
    //   path: "/app/settings/productivity",
    //   icon: TargetIcon,
    // },
    // {
    //   id: 9,
    //   name: "Reminders",
    //   path: "/app/settings/reminders",
    //   icon: AlarmClock,
    // },
    // {
    //   id: 10,
    //   name: "Notifications",
    //   path: "/app/settings/notifications",
    //   icon: BellIcon,
    // },
    // {
    //   id: 11,
    //   name: "Backup",
    //   path: "/app/settings/backup",
    //   icon: CloudUploadIcon,
    // },
    // {
    //   id: 12,
    //   name: "Integrations",
    //   path: "/app/settings/integrations",
    //   icon: Blocks,
    // },
    // {
    //   id: 13,
    //   name: "Calendars",
    //   path: "/app/settings/calendars",
    //   icon: CalendarDays,
    // },
  ];

  return (
    <Dialog size="lg" onClose={closeSettings}>
      <>
        <div className="flex h-full rounded-md overflow-hidden">
          <div className="w-56 flex flex-col bg-indigo-50/50">
            <div className="flex-1">
              <div className="p-3">
                <h2 className="font-bold text-base">Settings</h2>
              </div>

              <nav className="p-3">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      {item.path && (
                        <Link
                          href={item.path}
                          className={`flex items-center px-2 py-2 rounded-md transition-colors ${
                            item.path === pathname
                              ? "bg-indigo-100 text-indigo-700"
                              : "hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <item.icon
                            className="w-5 h-5 mr-3"
                            strokeWidth={1.5}
                          />
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className="p-3">
                <ul className="space-y-1">
                  {teams.map((team) => (
                    <li key={team.id} className="space-y-2">
                      <div className="font-medium">{team.name}</div>
                      <ul>
                        <li>
                          <Link
                            href={`/app/settings/workspaces/${team.id}/settings`}
                            className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-indigo-100 text-gray-700"
                          >
                            {team.avatar_url ? (
                              <Image
                                src={team.avatar_url}
                                alt={team.name}
                                width={20}
                                height={20}
                                className="rounded-md"
                              />
                            ) : (
                              <div className="w-6 h-6 min-w-5 min-h-5 bg-indigo-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-[10px] font-medium">
                                  {team.name.slice(0, 1).toUpperCase()}
                                </span>
                              </div>
                            )}

                            <span>General</span>
                          </Link>
                        </li>

                        <li>
                          <Link
                            href={`/app/settings/workspaces/${team.id}/members`}
                            className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-indigo-100 text-gray-700"
                          >
                            <Users strokeWidth={1.5} size={20} />
                            People
                          </Link>
                        </li>

                        <li>
                          <Link
                            href={`/app/settings/workspaces/${team.id}/billing`}
                            className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-indigo-100 text-gray-700"
                          >
                            <WalletIcon strokeWidth={1.5} size={20} />
                            Subscription
                          </Link>
                        </li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="border-t border-gray-200 p-1 px-3">
              <button
                onClick={() => setShowAddTeam(true)}
                className={`flex items-center px-2 py-2 rounded-md transition-colors hover:bg-indigo-100 text-gray-700 w-full`}
              >
                <Plus className="w-5 h-5 mr-3" strokeWidth={1.5} />
                Add team
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="p-3 flex items-center justify-between border-b border-gray-100">
              <p className="font-bold">
                {menuItems.find((item) => item.path === pathname)?.name}
              </p>

              <button
                className="p-1 rounded-md hover:bg-gray-100 transition"
                onClick={closeSettings}
              >
                <X strokeWidth={1.5} size={20} />
              </button>
            </div>

            <div className="p-4 h-[95%] overflow-y-auto">{children}</div>
          </div>
        </div>

        {showAddTeam && <AddTeam onClose={() => setShowAddTeam(false)} />}
      </>
    </Dialog>
  );
};

export default SettingsModal;
