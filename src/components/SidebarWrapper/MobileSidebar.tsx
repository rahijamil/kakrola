"use client";

import React, {
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Home,
  CheckSquare,
  MessagesSquare,
  User,
  Plus,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTransition } from "react";
import SidebarCreateMore from "./Sidebar/SidebarCreateMore";

interface MenuItem {
  id: number;
  icon: React.ElementType;
  text: string;
  path: string;
}

interface MobileSidebarProps {
  quickActions: {
    isOpen: boolean;
  };
  setQuickActions: Dispatch<
    SetStateAction<{
      showAddTaskModal: boolean;
      showAddSectionModal: boolean;
      showCreateDMModal: boolean;
      showCreateThreadModal: boolean;
      showCreateThreadReplyModal: boolean;
      isOpen: boolean;
    }>
  >;
  className?: string;
}

function MobileSidebar({
  setQuickActions,
  quickActions,
  className = "",
}: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const menuItems: MenuItem[] = useMemo(
    () => [
      { id: 1, icon: Home, text: "Home", path: "/app" },
      { id: 2, icon: CheckSquare, text: "Tasks", path: "/app/tasks" },
      { id: 3, icon: MessagesSquare, text: "DMs", path: "/app/dms" },
      { id: 4, icon: User, text: "Profile", path: "/app/more" },
    ],
    []
  );

  const handleNavigation = (path: string) => {
    setActiveItem(path);
    startTransition(() => {
      router.push(path);
    });
  };

  useEffect(() => {
    if (!isPending) {
      setActiveItem(null);
    }
  }, [isPending]);

  const triggerRef = useRef(null);

  return (
    <motion.nav
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed bottom-0 left-0 right-0 z-20 bg-primary-10 shadow-lg border-t border-primary-50 ${className}`}
      aria-label="Mobile navigation"
    >
      <ul className="flex justify-around items-center px-2 py-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li key={item.id} className="relative flex-1">
              <Link
                href={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center justify-center p-2 transition-all duration-200 ${
                  isPending && activeItem !== item.path
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
                aria-current={isActive ? "page" : undefined}
                onContextMenu={(e) => e.preventDefault()}
              >
                <span className="relative inline-flex items-center justify-center">
                  {isPending && activeItem === item.path ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                  ) : (
                    <item.icon
                      strokeWidth={1.5}
                      className={`w-6 h-6 ${
                        isActive ? "text-primary-500" : "text-text-500"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute -top-1 left-[calc(50%-2px)] w-1 h-1 bg-primary-500 rounded-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </span>
                <span
                  className={`text-xs mt-1 font-medium ${
                    isActive ? "text-primary-500" : "text-text-500"
                  }`}
                >
                  {item.text}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="fixed bottom-[calc(6rem-4px)] right-4">
        <SidebarCreateMore
          quickActions={quickActions}
          setQuickActions={setQuickActions}
          triggerRef={triggerRef}
        />
      </div>
    </motion.nav>
  );
}

export default function MobileSidebarWrapper(props: MobileSidebarProps) {
  const searchParams = useSearchParams();
  const contactId = searchParams.get("contact-id");

  if (contactId) {
    return null;
  }

  return <MobileSidebar {...props} />;
}
