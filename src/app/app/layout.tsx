import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import React from "react";
import AppLayoutWrapper from "./AppLayoutWrapper";

export const metadata: Metadata = {
  title: "Today | Kriar",
  description: "Kriar",
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
      <div className="flex fixed top-0 left-0 bottom-0 right-0">
        <Sidebar />
        {children}
        {modal}
      </div>
    </AppLayoutWrapper>
  );
}
