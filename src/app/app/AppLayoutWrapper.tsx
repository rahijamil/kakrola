"use client";
import { useAuthProvider } from "@/context/AuthContext";
import React from "react";
import useTheme from "@/hooks/useTheme";
import KakrolaLogo from "../kakrolaLogo";
import SidebarWrapper from "@/components/SidebarWrapper";
import MainContent from "./MainContent";
import useSidebarCollapse from "@/components/SidebarWrapper/useSidebarCollapse";

const AppLayoutWrapper = ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  const { loading } = useAuthProvider();
  const { theme } = useTheme();

  const { isCollapsed, ...sidebarProps } = useSidebarCollapse();

  if (!loading) {
    return (
      <main className="fixed top-0 left-0 bottom-0 right-0 bg-background">
        <div className="flex h-full">
          <SidebarWrapper props={{ isCollapsed, ...sidebarProps }} />
          <MainContent isCollapsed={isCollapsed}>{children}</MainContent>
        </div>
        {modal}
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
