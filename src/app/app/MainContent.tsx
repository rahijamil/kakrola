"use client";

import useScreen from "@/hooks/useScreen";
import React from "react";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { screenWidth } = useScreen();

  return screenWidth > 768 ? (
    <div className="flex-1 transition-all duration-300 p-2 pl-0 bg-primary-10 flex">
      <div className="bg-background rounded-lg overflow-hidden h-full w-full border border-text-100 shadow-lg dark:shadow-none">
        {children}
      </div>
    </div>
  ) : (
    <div className="overflow-x-auto flex-1 transition-all duration-300">
      {children}
    </div>
  );
}
