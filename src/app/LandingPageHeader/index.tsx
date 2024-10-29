"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, Rocket, ChevronDown, X } from "lucide-react";
import { useAuthProvider } from "@/context/AuthContext";
import KakrolaLogo from "../kakrolaLogo";

const menuItems = [{ id: 1, label: "Pricing", path: "/pricing" }];

export default function LandingPageHeader({ forAuth }: { forAuth?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile } = useAuthProvider();
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="wrapper">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="relative flex items-center group">
              <KakrolaLogo size="md" isTitle />
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-500 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </Link>

            {/* Desktop Navigation */}
            {!forAuth && (
              <div className="hidden lg:flex items-center gap-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    className="relative py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    {item.label}
                    {pathname === item.path && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500"
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

                {profile ? (
                  <Link href="/app">
                    <Button
                      variant="default"
                      size="sm"
                      className="relative group overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Rocket className="w-4 h-4" strokeWidth={1.5} />
                        Open Kakrola
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-primary-600"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  </Link>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link href="/auth/login">
                      <Button
                        variant="ghost"
                        className="text-gray-700 hover:text-primary-600"
                      >
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="relative group overflow-hidden shadow-lg hover:shadow-xl transition-all">
                        <span className="relative z-10 flex items-center gap-2">
                          <Rocket className="w-4 h-4" strokeWidth={1.5} />
                          Start Free Trial
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-primary-600"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t"
            >
              <div className="wrapper py-4 space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {!profile ? (
                  <div className="space-y-3 pt-4 border-t">
                    <Link href="/auth/login" className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="block">
                      <Button size="sm" className="w-full">
                        <Rocket className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        Start Free Trial
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="pt-4 border-t">
                    <Link href="/app">
                      <Button size="sm" className="w-full">
                        <Rocket className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        Open Kakrola
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
