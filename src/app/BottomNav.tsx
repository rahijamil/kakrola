"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Loader2, LogIn, Rocket, User } from "lucide-react";
import { useAuthProvider } from "@/context/AuthContext";
import KakrolaLogo from "./kakrolaLogo";
import useScreen from "@/hooks/useScreen";

function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = useAuthProvider();

  const menuItems = profile
    ? [
        { id: 1, icon: Home, text: "Home", path: "/" },
        { id: 2, icon: KakrolaLogo, text: "Open Kakrola", path: "/app" },
        { id: 3, icon: Rocket, text: "Upgrade to Pro", path: "/app/pricing" },
      ]
    : [
        { id: 1, icon: Home, text: "Home", path: "/" },
        {
          id: 2,
          icon: Rocket,
          text: "Start Your Journey",
          path: "/auth/signup",
        },
        { id: 3, icon: LogIn, text: "Log In", path: "/auth/login" },
      ];

  const [isPending, startTransition] = useTransition();
  const [activeItem, setActiveItem] = useState<string | null>(null);

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

  return (
    <motion.aside
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed bottom-0 left-0 right-0 z-20 bg-primary-10 shadow-lg border-t border-primary-50`}
      aria-label="Mobile navigation"
    >
      <ul className="grid grid-cols-3 place-items-center px-2 py-2 whitespace-nowrap">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li key={item.id} className="relative flex-1">
              <button
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
                  ) : item.icon === KakrolaLogo ? (
                    <KakrolaLogo size="xs" />
                  ) : (
                    <item.icon
                      strokeWidth={1.5}
                      className={`w-6 h-6 ${
                        isActive ? "text-primary-500" : "text-text-500"
                      }`}
                      aria-hidden="true"
                      size="xs"
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
              </button>
            </li>
          );
        })}
      </ul>
    </motion.aside>
  );
}

const BottomNavWrapper = () => {
  const { screenWidth } = useScreen();

  return <>{screenWidth <= 768 && <BottomNav />}</>;
};

export default BottomNavWrapper;
