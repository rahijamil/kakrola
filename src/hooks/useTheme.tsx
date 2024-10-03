import { Theme } from "@/lib/theme.types";
import React, { useEffect, useState } from "react";

const useTheme = () => {
  const getInitialTheme = (): Theme => {
    // Check if window and localStorage are available (browser environment)
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      return (localStorage.getItem("data-theme") as Theme) || Theme.KAKROLA;
    }

    // Return default theme during SSR
    return Theme.KAKROLA;
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme());

  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("data-theme", theme);

      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (theme === "dark") {
        themeColorMeta?.setAttribute("content", "#151515");
      } else {
        themeColorMeta?.setAttribute("content", "#ffffff");
      }
    }
  }, [theme]);

  return {
    theme,
    setTheme,
  };
};

export default useTheme;
