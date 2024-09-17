"use client";
import useScreen from "@/hooks/useScreen";
import React, { ReactNode } from "react";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const { screenWidth } = useScreen();

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center justify-between sticky top-0 bg-background ${
          screenWidth > 768 ? "py-3 px-6 pb-0" : "p-3"
        }`}
      >
        <h1 className="text-2xl font-bold">Pages</h1>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
};

export default PageWrapper;
