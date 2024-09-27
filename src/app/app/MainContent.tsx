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
      className={`flex-1 transition-all duration-300 flex ${
        isCollapsed ? "p-0" : "p-2 pl-0 bg-primary-10"
      }`}
    >
      <div
        className={`${
          isCollapsed
            ? "h-full w-full"
            : "bg-background rounded-lg overflow-hidden h-full w-full border border-text-100 shadow-[1px_1px_8px_0px_rgba(0,0,0,0.1),-1px_-1px_8px_0px_rgba(0,0,0,0.1)] dark:shadow-none"
        }`}
      >
        {children}
      </div>
    </div>
  ) : (
    <div className="overflow-x-auto flex-1 transition-all duration-300">
      {children}
    </div>
  );
}
