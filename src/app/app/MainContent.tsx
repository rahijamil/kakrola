"use client";

import useScreen from "@/hooks/useScreen";
import React from "react";

export default function MainContent({
  children,
  isCollapsed,
}: {
  children: React.ReactNode;
  isCollapsed: boolean;
}) {
  const { screenWidth } = useScreen();

  return screenWidth > 768 ? (
    <div
      className={`flex-1 transition-all duration-300 flex bg-background overflow-x-auto ${
        isCollapsed
          ? "m-0"
          : "m-1.5 ml-0 rounded-lg shadow-[1px_1px_.5rem_0_rgba(0,0,0,0.1)] dark:shadow-none border border-text-100"
      }`}
    >
      <div className="w-full h-full">{children}</div>
    </div>
  ) : (
    <div className="overflow-x-auto flex-1 transition-all duration-300 bg-background">
      {children}
    </div>
  );
}
