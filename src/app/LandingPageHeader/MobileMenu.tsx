"use client";

import React, { useState, useRef } from "react";
import { Menu, Rocket } from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
import { useRouter } from "next/navigation";
import { MenuItem } from "./menuItemTypes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthProvider } from "@/context/AuthContext";

export default function MobileMenu({
  menuItems,
  forAuth,
}: {
  menuItems: MenuItem[];
  forAuth?: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const triggerRef = useRef(null);
  const router = useRouter();

  const { profile } = useAuthProvider();

  return (
    <div className="lg:hidden">
      <Dropdown
        title="Menu"
        triggerRef={triggerRef}
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        Label={({ onClick }) => (
          <button
            ref={triggerRef}
            onClick={onClick}
            onTouchStart={(ev) => ev.currentTarget.classList.add("bg-text-100")}
            onTouchEnd={(ev) =>
              ev.currentTarget.classList.remove("bg-text-100")
            }
            className="text-text-700 transition p-1 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        items={menuItems.map((menu) => ({
          id: menu.id,
          label: menu.label,
          onClick: () => router.push(menu.path),
        }))}
        content={
          !forAuth && (
            <>
              {profile ? (
                <div className="flex flex-col items-center gap-4 p-4 pt-0 pb-6">
                  <Link href="/app" className="w-full">
                    <Button fullWidth variant="outline">
                      Open Kakrola
                    </Button>
                  </Link>
                  <Link href="/app/settings/billing" className="group w-full">
                    <Button
                      className="uppercase shadow-lg hover:shadow-xl transition-all hero_button"
                      fullWidth
                    >
                      <Rocket className="w-5 h-5" strokeWidth={1.5} />
                      Upgrade
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 p-4 pt-0 pb-6">
                  <Link href="/auth/login" className="w-full">
                    <Button fullWidth variant="outline">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="w-full">
                    <Button
                      className="shadow-lg hover:shadow-xl transition-all hero_button"
                      fullWidth
                    >
                      <Rocket className="w-5 h-5" strokeWidth={1.5} />
                      Start for Free
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )
        }
      />
    </div>
  );
}
