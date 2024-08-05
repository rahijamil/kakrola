import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./LandingPageButton";
import { MenuIcon, XIcon } from "lucide-react";

const LandingPageHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

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

  return (
    <header>
      <nav
        className={`fixed left-1/2 -translate-x-1/2 whitespace-nowrap z-20 transition-all duration-300 rounded-full min-w-[1330px] ${
          scrollY > 50
            ? "bg-white/70 backdrop-blur-md shadow-md top-2"
            : "bg-transparent top-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16 gap-8">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-md bg-gradient-to-b from-indigo-500 to-indigo-700 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>

                <span className="text-2xl font-bold text-indigo-600">Ekta</span>
              </Link>

              <div className="hidden md:flex items-center">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    className="text-sm font-medium text-gray-700 hover:bg-gray-100 transition px-4 py-2 rounded-md"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="gap-4 ml-4 flex items-center">
              <Button variant="ghost">Log in</Button>
              <Button>Start free trial</Button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 transition"
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition"
                >
                  {item.label}
                </Link>
              ))}
              <Button variant="ghost" className="w-full justify-center mt-4">
                Log in
              </Button>
              <Button className="w-full justify-center mt-2">
                Start free trial
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default LandingPageHeader;
