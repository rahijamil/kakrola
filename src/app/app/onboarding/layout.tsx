import React, { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kakrola",
};

const OnboardLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default OnboardLayout;
