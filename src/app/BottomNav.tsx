"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, LogIn, Rocket, User } from "lucide-react";
import { useAuthProvider } from "@/context/AuthContext";
import KakrolaLogo from "./kakrolaLogo";

export default function BottomNav() {
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

  return (
    <motion.aside
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-20 bg-primary-10 shadow-lg rounded-t-xl border-t border-primary-50"
    >
      <nav className="px-4 py-2">
        <ul className="flex justify-around items-center">
          {menuItems.map((item) => (
            <li key={item.id} className="relative">
              <button
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center p-2 transition-colors duration-200"
              >
                {item.icon === KakrolaLogo ? (
                  <KakrolaLogo size="xs" />
                ) : (
                  <item.icon
                    strokeWidth={1.5}
                    size="xs"
                    className={`w-6 h-6 ${
                      pathname === item.path
                        ? "text-primary-500"
                        : "text-gray-500"
                    }`}
                  />
                )}
                <span
                  className={`text-xs mt-1 font-medium ${
                    pathname === item.path
                      ? "text-primary-500"
                      : "text-gray-500"
                  }`}
                >
                  {item.text}
                </span>
                {pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
}
