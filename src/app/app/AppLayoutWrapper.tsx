"use client";
import { useAuthProvider, withAuthProtection } from "@/context/AuthContext";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import KakrolaLogo from "../kakrolaLogo";
import SidebarWrapper from "@/components/SidebarWrapper";
import MainContent from "./MainContent";
import useSidebarCollapse from "@/components/SidebarWrapper/useSidebarCollapse";
import SettingsModal from "@/components/settings/SettingsModal";
import { usePathname, useSearchParams } from "next/navigation";
import TemplatesModal from "@/components/templates/TemplatesModal";
import Onboarding from "./onboarding/Onboarding";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";

const AppLayoutWrapper = ({ children }: { children: ReactNode }) => {
  const { profile } = useAuthProvider();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const { isCollapsed, sidebarWidth, ...sidebarProps } = useSidebarCollapse();

  // Handle modals
  useEffect(() => {
    setShowSettings(!!searchParams.get("settings"));
    setShowTemplates(!!searchParams.get("templates"));
  }, [searchParams]);

  // Optimize keyboard shortcuts
  useEffect(() => {
    const handleSlashKeydown = (ev: KeyboardEvent) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.key === "/") {
        ev.preventDefault();
        sidebarProps.toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleSlashKeydown);
    return () => window.removeEventListener("keydown", handleSlashKeydown);
  }, [sidebarProps.toggleSidebar]);

  return !profile ? null : pathname === "/app/onboarding" ? (
    <div className="min-h-screen bg-background">
      <main className="wrapper py-8">
        <Onboarding />
      </main>
    </div>
  ) : (
    <main className="fixed inset-0 flex h-full bg-primary-10d bg-gradient-to-br from-primary-10 via-background to-primary-50">
      {!pathname.startsWith("/app/onboarding") && (
        <SidebarWrapper
          props={{ isCollapsed, sidebarWidth, ...sidebarProps }}
        />
      )}
      <MainContent isCollapsed={isCollapsed}>{children}</MainContent>
      {showSettings && <SettingsModal />}
      {showTemplates && <TemplatesModal />}
      <FeedbackDialog />
    </main>
  );
};

export default withAuthProtection(AppLayoutWrapper);
