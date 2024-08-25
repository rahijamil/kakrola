"use client";
import { useAuthProvider } from "@/context/AuthContext";
import React from "react";
import Image from "next/image";
import useTheme from "@/hooks/useTheme";

const AppLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuthProvider();
  const { theme } = useTheme();

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (profile?.id) {
      setLoading(false);
    }
  }, [profile]);

  if (!loading) {
    return <>{children}</>;
  } else {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Image src="/kakrola.svg" alt="Kakrola Logo" width={80} height={80} />
      </div>
    );
  }
};

export default AppLayoutWrapper;
