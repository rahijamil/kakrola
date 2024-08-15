import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import React from "react";
import AppLayoutWrapper from "./AppLayoutWrapper";

export const metadata: Metadata = {
  title: "Kriya: Plan Your Tasks",
  description: "Kriya: Plan Your Tasks",
};

export default function AppLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <AppLayoutWrapper>
      <div className="flex h-screen bg-white">
        <Sidebar />
        {children}
        {modal}
      </div>
    </AppLayoutWrapper>
  );
}
