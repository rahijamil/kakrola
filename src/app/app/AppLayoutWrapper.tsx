"use client";
import { useAuthProvider } from "@/context/AuthContext";
import React from "react";
import Image from "next/image";

const AppLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuthProvider();

  // const loading = true;

  if (!loading) {
    return <>{children}</>;
  } else {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/kakrola.svg"
            alt="Kakrola Logo"
            width={100}
            height={100}
          />
        </div>

        <div className="pb-10">
          <h1 className="text-xl font-semibold text-primary-600">Kakrola</h1>
        </div>
      </div>
    );
  }
};

export default AppLayoutWrapper;
