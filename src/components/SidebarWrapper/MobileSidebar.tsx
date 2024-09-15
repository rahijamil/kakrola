"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import {
  Inbox,
  Calendar,
  LucideProps,
  MessagesSquare,
  Menu,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const menuItems: {
  id: number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
  path: string;
}[] = [
  { id: 1, icon: Calendar, text: "My Tasks", path: "/app" },
  { id: 2, icon: Inbox, text: "Inbox", path: "/app/inbox" },
  { id: 3, icon: MessagesSquare, text: "DMs", path: "/app/dm" },
  { id: 4, icon: Menu, text: "More", path: "/app/more" },
];

const MobileSidebar = () => {
  const pathname = usePathname();

  const { projectsLoading } = useTaskProjectDataProvider();

  return (
    <>
      <aside className="group bg-primary-10 fixed bottom-0 left-0 right-0 z-20 border-t border-primary-50">
        <nav>
          <ul className="grid grid-cols-4 p-1">
            {menuItems.map((item) =>
              projectsLoading ? (
                <Skeleton
                  key={item.id}
                  height={16}
                  width={150}
                  borderRadius={9999}
                  style={{ marginBottom: ".5rem" }}
                />
              ) : (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    className={`flex flex-col items-center p-1 rounded-lg transition-colors duration-150 text-text-900 space-y-1 ${
                      item.path === pathname
                        ? "bg-primary-100"
                        : "hover:bg-primary-50"
                    }`}
                  >
                    <item.icon strokeWidth={1.5} className="w-5 h-5" />
                    <span className="text-xs">{item.text}</span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default MobileSidebar;
