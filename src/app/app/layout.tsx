import type { Metadata } from "next";
import React from "react";
import AppLayoutWrapper from "./AppLayoutWrapper";

export const metadata: Metadata = {
  title: "Today - Kakrola",
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
    <AppLayoutWrapper modal={modal}>
     {children}
    </AppLayoutWrapper>
  );
}
