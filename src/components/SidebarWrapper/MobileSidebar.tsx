"use client";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import {
  Inbox,
  Calendar,
  LucideProps,
  MessagesSquare,
  Menu,
  Plus,
  Search,
  Home,
} from "lucide-react";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { useAuthProvider } from "@/context/AuthContext";

const MobileSidebar = ({
  setShowAddTaskModal,
}: {
  setShowAddTaskModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuthProvider();

  const menuItems: {
    id: number;
    icon: ReactNode;
    text: string;
    path: string;
  }[] = [
    {
      id: 1,
      icon: <Home strokeWidth={1.5} className={`w-5 h-5`} />,
      text: "Home",
      path: "/app/home",
    },
    {
      id: 2,
      icon: <Calendar strokeWidth={1.5} className={`w-5 h-5`} />,
      text: "My Tasks",
      path: "/app",
    },
    {
      id: 3,
      icon: <MessagesSquare strokeWidth={1.5} className={`w-5 h-5`} />,
      text: "DMs",
      path: "/app/dm",
    },
    {
      id: 4,
      icon: (
        <Image
          src={profile?.avatar_url || "/default_avatar.png"}
          alt="Profile"
          className="w-5 h-5 min-w-5 min-h-5 rounded-md object-cover"
          width={20}
          height={20}
        />
      ),
      text: "More",
      path: "/app/more",
    },
  ];

  return (
    <>
      <aside className="group bg-primary-10 fixed bottom-0 left-0 right-0 z-20 border-t border-primary-50 select-none">
        <nav>
          <ul className="grid grid-cols-4 p-4 px-2 pt-1 place-items-center">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`flex flex-col items-center text-text-900 space-y-0.5 transition`}
                  onTouchStart={(ev) => {
                    ev.currentTarget.classList.add("scale-95");
                  }}
                  onTouchEnd={(ev) => {
                    ev.currentTarget.classList.remove("scale-95");
                  }}
                >
                  <div
                    className={`rounded-lg transition ${
                      item.path === pathname && "bg-primary-100"
                    } p-1 px-5`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Floating action button */}
      <div className="fixed bottom-20 right-6 flex items-center justify-center z-50">
        <button
          className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-500 text-surface shadow-lg shadow-text-100"
          onClick={() => setShowAddTaskModal(true)}
        >
          <Plus strokeWidth={1.5} className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};

export default MobileSidebar;
