"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { ReactNode, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import useTheme from "@/hooks/useTheme";

const ClientProviderWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>{children}</NextUIProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default ClientProviderWrapper;
