"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Hash, Rocket } from "lucide-react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import KakrolaLogo from "../kakrolaLogo";
import { useAuthProvider } from "@/context/AuthContext";
import { MenuItem } from "./menuItemTypes";

const menuItems: MenuItem[] = [
  // {
  //   id: 1,
  //   label: "Product",
  //   path: "#products",
  //   subItems: [
  //     {
  //       id: 1,
  //       label: "Projects",
  //       summary: "For every team or size",
  //       path: "#",
  //       onClick() {},
  //       icon: <CheckCircle strokeWidth={1.5} className="w-5 h-5" />,
  //     },
  //     {
  //       id: 2,
  //       label: "Pages",
  //       summary: "Simple and powerfull",
  //       path: "#",
  //       onClick() {},
  //       icon: <FileText strokeWidth={1.5} className="w-5 h-5" />,
  //     },
  //     {
  //       id: 3,
  //       label: "Channels",
  //       summary: "Organized conversations",
  //       path: "#",
  //       onClick() {},
  //       icon: <Hash strokeWidth={1.5} className="w-5 h-5" />,
  //     },
  //   ],
  // },
  { id: 4, label: "Pricing", path: "/pricing" },
  // { id: 3, label: "Resources", path: "/resources" },
];

export default function LandingPageHeader({ forAuth }: { forAuth?: boolean }) {
  const { profile } = useAuthProvider();

  return (
    <header>
      <nav className={`fixed top-0 left-0 right-0 bg-white z-30`}>
        <div className="wrapper">
          <div className="flex justify-between items-center h-12 md:h-16">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <KakrolaLogo size="md" isTitle />
            </Link>

            <div className="flex items-center gap-8">
              {!forAuth && (
                <>
                  <DesktopMenu menuItems={menuItems} />
                  <MobileMenu menuItems={menuItems} />
                </>
              )}

              {/* Auth buttons can be server-rendered */}
              {!forAuth && (
                <>
                  {profile ? (
                    <div className="hidden lg:flex items-center space-x-2">
                      <Link
                        href="/app"
                        className="text-sm font-medium text-text-700 hover:bg-kakrola-50 transition px-4 py-2 rounded-lg"
                      >
                        Open Kakrola
                      </Link>
                      <Link href="/app/settings/billing" className="group">
                        <Button className="uppercase shadow-lg hover:shadow-xl transition-all hero_button">
                          <Rocket className="w-5 h-5" strokeWidth={1.5} />
                          Upgrade
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="hidden lg:flex items-center space-x-2">
                      <Link
                        href="/auth/login"
                        className="text-sm font-medium text-text-700 hover:bg-kakrola-50 transition px-4 py-2 rounded-lg"
                      >
                        Log in
                      </Link>
                      <Link href="/auth/signup">
                        <Button className="shadow-lg hover:shadow-xl transition-all hero_button">
                          <Rocket className="w-5 h-5" strokeWidth={1.5} />
                          Start for Free
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
