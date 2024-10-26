import type { Metadata } from "next";
import React from "react";
import AppLayoutWrapper from "./AppLayoutWrapper";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";

export const metadata: Metadata = {
  title: "My Tasks - Kakrola",
  description: "My Tasks on Kakrola",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppLayoutWrapper>
      {children}
      <FeedbackDialog />
    </AppLayoutWrapper>
  );
}
