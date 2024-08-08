"use client";

import { useCallback } from "react";
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
  SettingsIcon,
  SlidersHorizontal,
  SquarePlusIcon,
  TargetIcon,
  UserIcon,
  WalletIcon,
  X,
} from "lucide-react";

const SettingsModal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

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
    {
      id: 2,
      name: "General",
      path: "/app/settings/general",
      icon: SettingsIcon,
    },
    {
      id: 3,
      name: "Advanched",
      path: "/app/settings/advanched",
      icon: SlidersHorizontal,
    },
    {
      id: 4,
      name: "Subscription",
      path: "/app/settings/subscription",
      icon: WalletIcon,
    },
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
    {
      id: 7,
      name: "Quick Add",
      path: "/app/settings/quick-customization",
      icon: SquarePlusIcon,
    },
    {
      id: 8,
      name: "Productivity",
      path: "/app/settings/productivity",
      icon: TargetIcon,
    },
    {
      id: 9,
      name: "Reminders",
      path: "/app/settings/reminders",
      icon: AlarmClock,
    },
    {
      id: 10,
      name: "Notifications",
      path: "/app/settings/notifications",
      icon: BellIcon,
    },
    {
      id: 11,
      name: "Backup",
      path: "/app/settings/backup",
      icon: CloudUploadIcon,
    },
    {
      id: 12,
      name: "Integrations",
      path: "/app/settings/integrations",
      icon: Blocks,
    },
    {
      id: 13,
      name: "Calendars",
      path: "/app/settings/calendars",
      icon: CalendarDays,
    },
  ];

  return (
    <Dialog size="lg" onClose={closeSettings}>
      <div className="flex h-full rounded-md overflow-hidden">
        <div className="w-56 bg-indigo-50/50">
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
                      <item.icon className="w-5 h-5 mr-3" strokeWidth={1.5} />
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
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
    </Dialog>
  );
};

export default SettingsModal;
