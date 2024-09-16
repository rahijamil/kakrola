import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, MoreVertical, Rocket, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthProvider } from "@/context/AuthContext";
import KakrolaLogo from "./kakrolaLogo";
import useScreen from "@/hooks/useScreen";
import Dropdown from "@/components/ui/Dropdown";
import { useRouter } from "next/navigation";

const LandingPageHeader = ({ forAuth }: { forAuth?: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { screenWidth } = useScreen();
  const { profile } = useAuthProvider();
  const triggerRef = useRef(null);
  const router = useRouter();

  const menuItems = [
    { id: 1, label: "Product", path: "#" },
    { id: 2, label: "Teams", path: "#" },
    { id: 3, label: "Resources", path: "#" },
    { id: 4, label: "Pricing", path: "#" },
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [isMenuOpen]);

  return (
    <header>
      <nav
        className={`${
          screenWidth > 768
            ? "fixed left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#fff]/70 backdrop-blur-md shadow-md top-2 transition-all duration-300 rounded-lg w-11/12 lg:max-w-5xl border border-primary-200"
            : "fixed top-0 left-0 right-0 bg-background"
        } z-30`}
      >
        <div className="w-full max-w-7xl mx-auto px-3">
          <div className="flex justify-between items-center h-12 md:h-16">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <KakrolaLogo size={screenWidth > 768 ? "md" : "sm"} isTitle />
            </Link>

            {!forAuth && (
              <div className="hidden lg:flex items-center ml-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    className="text-sm font-medium text-text-700 hover:bg-primary-50 transition px-4 py-2 rounded-lg"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {!forAuth && (
              <div className="hidden lg:flex items-center space-x-2">
                {profile?.id ? (
                  <>
                    <Link href="/app">
                      <Button variant="ghost" size="sm">
                        Open Kakrola
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button size="sm">Upgrade to Pro</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-sm font-medium text-text-700 hover:bg-primary-50 transition px-4 py-2 rounded-lg"
                    >
                      Log in
                    </Link>

                    <Link href="/auth/signup" className="group">
                      <Button
                        className="uppercase shadow-lg hover:shadow-xl transition-all"
                        rightContent={
                          <div className="bg-background text-primary-500 rounded-lg w-8 h-8 flex items-center justify-center">
                            <Rocket className="w-5 h-5" strokeWidth={1.5} />
                          </div>
                        }
                      >
                        Start Your Journey
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}

            {screenWidth <= 1024 && (
              <Dropdown
                triggerRef={triggerRef}
                isOpen={isMenuOpen}
                setIsOpen={setIsMenuOpen}
                Label={({ onClick }) => (
                  <button
                    ref={triggerRef}
                    onClick={onClick}
                    onTouchStart={(ev) =>
                      ev.currentTarget.classList.add("bg-text-100")
                    }
                    onTouchEnd={(ev) =>
                      ev.currentTarget.classList.remove("bg-text-100")
                    }
                    className="text-text-700 transition p-1 rounded-lg"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                )}
                items={[
                  ...menuItems.map((menu) => ({
                    id: menu.id,
                    label: menu.label,
                    onClick: () => router.push(menu.path),
                  })),
                ]}
              />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default LandingPageHeader;
