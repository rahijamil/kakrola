"use client";
import { useAuthProvider } from "@/context/AuthContext";
import React, { Suspense, useEffect, useState } from "react";
import KakrolaLogo from "../kakrolaLogo";
import SidebarWrapper from "@/components/SidebarWrapper";
import MainContent from "./MainContent";
import useSidebarCollapse from "@/components/SidebarWrapper/useSidebarCollapse";
import SettingsModal from "@/components/settings/SettingsModal";
import { usePathname, useSearchParams } from "next/navigation";
import TemplatesModal from "@/components/templates/TemplatesModal";

const AppLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuthProvider();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const settings = searchParams.get("settings");
  const templates = searchParams.get("templates");

  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (settings) {
      setShowSettings(true);
    }
    if (templates) {
      setShowTemplates(true);
    }
  }, [settings, templates]);

  const { isCollapsed, sidebarWidth, ...sidebarProps } = useSidebarCollapse();

  useEffect(() => {
    const handleSlashKeydwon = (ev: KeyboardEvent) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.key === "/") {
        ev.preventDefault();
        sidebarProps.toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleSlashKeydwon);
    return () => {
      window.removeEventListener("keydown", handleSlashKeydwon);
    };
  }, []);

  if (!loading) {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-screen bg-background">
            <KakrolaLogo size="2xl" />
          </div>
        }
      >
        <main className="fixed inset-0 flex h-full bg-primary-10d bg-gradient-to-br from-primary-10 via-background to-primary-50">
          {pathname.startsWith("/app/onboarding") ? null : (
            <SidebarWrapper
              props={{ isCollapsed, sidebarWidth, ...sidebarProps }}
            />
          )}
          <MainContent isCollapsed={isCollapsed}>{children}</MainContent>
          {showSettings ? <SettingsModal /> : null}
          {showTemplates ? <TemplatesModal /> : null}
        </main>
      </Suspense>
    );
  } else {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-background">
        <KakrolaLogo size="2xl" />
      </div>
    );
  }
};

export default AppLayoutWrapper;
