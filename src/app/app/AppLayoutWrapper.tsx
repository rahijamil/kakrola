"use client";
import { useAuthProvider } from "@/context/AuthContext";
import React from "react";
import Image from "next/image";

const AppLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuthProvider();

  if (profile?.id) {
    return <>{children}</>;
  } else {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Image
          src="/kriya_animated.svg"
          alt="Kriar Logo"
          width={80}
          height={80}
        />
      </div>
    );
  }
};

export default AppLayoutWrapper;
