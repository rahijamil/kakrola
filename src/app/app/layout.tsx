import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import React from "react";
import AppLayoutWrapper from "./AppLayoutWrapper";

export const metadata: Metadata = {
  title: "Today | Kakrola",
  description: "Kakrola",
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
      <main className="fixed top-0 left-0 bottom-0 right-0">
        <div className="flex h-full">
          <Sidebar />
          <div className="overflow-x-auto flex-1 transition-all duration-300">{children}</div>
        </div>
        {modal}
      </main>
    </AppLayoutWrapper>
  );
}
