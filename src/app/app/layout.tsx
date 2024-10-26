import type { Metadata } from "next";
import React, { Suspense } from "react";
import AppLayoutWrapper from "./AppLayoutWrapper";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";
import KakrolaLogo from "../kakrolaLogo";

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
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-screen bg-background">
          <KakrolaLogo size="2xl" />
        </div>
      }
    >
      <AppLayoutWrapper>
        {children}
        <FeedbackDialog />
      </AppLayoutWrapper>
    </Suspense>
  );
}
