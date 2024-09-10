import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, Rocket, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthProvider } from "@/context/AuthContext";
import KakrolaLogo from "./kakrolaLogo";

const LandingPageHeader = ({ forAuth }: { forAuth?: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { profile } = useAuthProvider();

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
        className={`fixed left-1/2 -translate-x-1/2 whitespace-nowrap z-30 bg-[#fff]/70 backdrop-blur-md shadow-md top-2 transition-all duration-300 rounded-lg w-11/12 lg:max-w-5xl border border-primary-200`}
      >
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <KakrolaLogo size="md" isTitle />
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

            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-text-700 transition p-2"
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
            className="lg:hidden bg-surface shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)] p-4 border-t border-text-200"
          >
            <div className="space-y-4">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-text-700 hover:text-primary-600 hover:bg-primary-50 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-text-200 flex items-center gap-4 pt-4">
                {profile?.id ? (
                  <>
                    <Link href="/app" className="block flex-1">
                      <Button variant="gray" className="w-full justify-center">
                        Open Kakrola
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
                      <Button variant="ghost" className="w-full justify-center">
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
