"use client";
import { useAuthProvider } from "@/context/AuthContext";
import React from "react";
import EktaLogo from "../EktaLogo";
import Spinner from "@/components/ui/Spinner";

const AppLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuthProvider();

  if (profile?.id) {
    return <>{children}</>;
  } else {
    return (
      <div className="flex items-center justify-center border w-full h-screen">
        <div className="flex flex-col gap-8 items-center justify-center">
          <EktaLogo size="lg" />
          <Spinner />
        </div>
      </div>
    );
  }
};

export default AppLayoutWrapper;
