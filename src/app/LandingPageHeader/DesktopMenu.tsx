"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MenuItem } from "./menuItemTypes";

export default function DesktopMenu({ menuItems }: { menuItems: MenuItem[] }) {
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex items-center ml-8">
      {menuItems.map((item) => (
        <Link
          key={item.id}
          href={item.path}
          className={`font-medium transition px-4 py-2 relative ${
            pathname == item.path ? "text-primary-500" : "text-text-700"
          }`}
          onMouseEnter={() => setHoverItem(item.path)}
          onMouseLeave={() => setHoverItem(null)}
        >
          {item.label}

          {(hoverItem == item.path || pathname == item.path) && (
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
        </Link>
      ))}
    </div>
  );
}
