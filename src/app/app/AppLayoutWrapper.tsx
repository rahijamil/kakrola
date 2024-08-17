"use client";
import { useAuthProvider } from "@/context/AuthContext";
import React from "react";
import KriyaLogo from "../KriyaLogo";
import Spinner from "@/components/ui/Spinner";
import Image from "next/image";

const AppLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuthProvider();

  if (profile?.id) {
    return <>{children}</>;
  } else {
    return (
      <div className="flex items-center justify-center border w-full h-screen">
        <div className="flex items-center justify-center">
          <Image
            src="/kriya_animated.svg"
            alt="Kriar Logo"
            width={80}
            height={80}
          />
        </div>
      </div>
    );
  }
};

export default AppLayoutWrapper;
