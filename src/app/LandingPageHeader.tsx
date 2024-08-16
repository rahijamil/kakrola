import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";
import KriyaLogo from "./KriyaLogo";
import { motion } from "framer-motion";
import { useAuthProvider } from "@/context/AuthContext";
import Image from "next/image";

const LandingPageHeader = ({ forAuth }: { forAuth?: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const { profile } = useAuthProvider();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { id: 1, label: "Features", path: "#features" },
    { id: 2, label: "Templates", path: "#templates" },
    { id: 3, label: "For Teams", path: "#for-teams" },
    { id: 4, label: "Pricing", path: "#pricing" },
    { id: 5, label: "Resources", path: "#resources" },
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
        className={`fixed left-1/2 -translate-x-1/2 whitespace-nowrap z-30 transition-all duration-300 lg:rounded-full w-full lg:w-11/12 lg:max-w-7xl ${
          scrollY > 50
            ? "bg-white/70 backdrop-blur-md shadow-md top-0 lg:top-2"
            : `${isMenuOpen ? "bg-white" : "bg-transparent"} top-0`
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image
                  src="/kriya_text.svg"
                  width={130}
                  height={0}
                  alt="Kriya"
                />
              </Link>

              {!forAuth && (
                <div className="hidden lg:flex items-center ml-2 space-x-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.path}
                      className="text-sm font-medium text-gray-700 hover:bg-gray-200 transition px-3 py-2 rounded-md"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {!forAuth && (
              <div className="hidden lg:flex items-center space-x-2">
                {profile?.id ? (
                  <>
                    <Link href="/app">
                      <Button variant="ghost" size="sm">
                        Open Ekta
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button size="sm">Upgrade to Pro</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button size="sm">Start free trial</Button>
                    </Link>
                  </>
                )}
              </div>
            )}

            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 transition p-2"
              >
                {isMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.3,
            }}
            className="lg:hidden bg-white shadow-lg p-4 border-t border-gray-200"
          >
            <div className="space-y-4">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-200 flex items-center gap-4 pt-4">
                {profile?.id ? (
                  <>
                    <Link href="/app" className="block flex-1">
                      <Button variant="gray" className="w-full justify-center">
                        Open Ekta
                      </Button>
                    </Link>
                    <Link href="/pricing" className="block flex-1">
                      <Button className="w-full justify-center">
                        Upgrade to Pro
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block flex-1">
                      <Button variant="gray" className="w-full justify-center">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="block flex-1">
                      <Button className="w-full justify-center">
                        Start free trial
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
          }}
          onClick={() => setIsMenuOpen(false)}
          className="fixed top-64 left-0 bottom-0 right-0 bg-black/70 backdrop-blur-md z-20"
        ></motion.div>
      )}
    </header>
  );
};

export default LandingPageHeader;
