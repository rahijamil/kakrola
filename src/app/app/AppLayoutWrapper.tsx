"use client";
import { useAuthProvider } from "@/context/AuthContext";
import React from "react";
import useTheme from "@/hooks/useTheme";
import KakrolaLogo from "../kakrolaLogo";

const AppLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuthProvider();
  const { theme } = useTheme();

  // const loading = true;

  if (!loading) {
    return <>{children}</>;
  } else {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-background">
        <KakrolaLogo size="2xl" />
      </div>
    );
  }
};

export default AppLayoutWrapper;
