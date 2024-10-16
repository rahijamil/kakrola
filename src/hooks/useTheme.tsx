import { Theme, ThemeMode } from "@/lib/theme.types";
import React, { useEffect, useState } from "react";

const getInitialTheme = (): Theme => {
  // Check if window and localStorage are available (browser environment)
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    return (localStorage.getItem("data-theme") as Theme) || Theme.KAKROLA;
  }

  // Return default theme during SSR
  return Theme.KAKROLA;
};

const getInitialMode = (): ThemeMode => {
  // Check if window and localStorage are available (browser environment)
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    return (localStorage.getItem("data-mode") as ThemeMode) || ThemeMode.LIGHT;
  }

  // Return default theme during SSR
  return ThemeMode.LIGHT;
};

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme());
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialMode());

  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("data-theme", theme);

      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (theme && theme.endsWith("dark")) {
        setThemeMode(ThemeMode.DARK);
        themeColorMeta?.setAttribute("content", "#151515");
        document.documentElement.setAttribute("data-mode", "dark");
        localStorage.setItem("data-mode", ThemeMode.DARK);
      } else {
        themeColorMeta?.setAttribute("content", "#ffffff");
        setThemeMode(ThemeMode.LIGHT);
        localStorage.removeItem("data-mode");
        document.documentElement.removeAttribute("data-mode");
      }
    }
  }, [theme]);

  return {
    theme,
    setTheme,
    themeMode,
  };
};

export default useTheme;
