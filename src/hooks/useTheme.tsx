import { Theme } from "@/lib/theme.types";
import React, { useEffect, useState } from "react";

const useTheme = () => {
  const getInitialTheme: () => Theme = () => {
    return (localStorage.getItem("data-theme") as Theme) || Theme.KAKROLA;
  };

  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("data-theme", theme);

    if (theme === "dark") {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "#151515");
    } else {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "#ffffff");
    }
  }, [theme]);

  return {
    theme,
    setTheme,
  };
};

export default useTheme;
