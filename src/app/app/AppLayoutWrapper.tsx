"use client";
import { useAuthProvider } from "@/context/AuthContext";
import React from "react";
import useTheme from "@/hooks/useTheme";
import KakrolaLogo from "../kakrolaLogo";
import SidebarWrapper from "@/components/SidebarWrapper";
import MainContent from "./MainContent";
import useSidebarCollapse from "@/components/SidebarWrapper/useSidebarCollapse";
import SettingsModal from "@/components/settings/SettingsModal";

const AppLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuthProvider();
  const { theme } = useTheme();

  const { isCollapsed, ...sidebarProps } = useSidebarCollapse();

  if (!loading) {
    return (
      <main className="fixed inset-0 flex h-full bg-primary-10">
        <SidebarWrapper props={{ isCollapsed, ...sidebarProps }} />
        <MainContent isCollapsed={isCollapsed}>{children}</MainContent>
        <SettingsModal />
      </main>
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
