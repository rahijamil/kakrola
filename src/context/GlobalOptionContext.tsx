"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";

const GlobalOptionContext = createContext<{
  showShareOption: boolean;
  setShowShareOption: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  showShareOption: false,
  setShowShareOption: () => {},
});

const GlobalOptionProvider = ({ children }: { children: ReactNode }) => {
  const [showShareOption, setShowShareOption] = useState<boolean>(false);

  return (
    <GlobalOptionContext.Provider
      value={{ showShareOption, setShowShareOption }}
    >
      {children}
    </GlobalOptionContext.Provider>
  );
};

export const useGlobalOption = () => {
  return useContext(GlobalOptionContext);
};

export default GlobalOptionProvider;
