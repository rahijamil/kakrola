"use client";

import React, { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
import { useRouter } from "next/navigation";
import { MenuItem } from "./menuItemTypes";

export default function MobileMenu({ menuItems }: { menuItems: MenuItem[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const triggerRef = useRef(null);
  const router = useRouter();

  return (
    <div className="lg:hidden">
      <Dropdown
        triggerRef={triggerRef}
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        Label={({ onClick }) => (
          <button
            ref={triggerRef}
            onClick={onClick}
            onTouchStart={(ev) => ev.currentTarget.classList.add("bg-text-100")}
            onTouchEnd={(ev) => ev.currentTarget.classList.remove("bg-text-100")}
            className="text-text-700 transition p-1 rounded-lg"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        )}
        items={menuItems.map((menu) => ({
          id: menu.id,
          label: menu.label,
          onClick: () => router.push(menu.path),
        }))}
      />
    </div>
  );
}