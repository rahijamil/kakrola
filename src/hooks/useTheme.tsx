import React, { useEffect, useState } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState<
    | "kakrola"
    | "dark"
    | "moonstone"
    | "tangerine"
    | "kale"
    | "blueberry"
    | "lavender"
    | "raspberry"
    | null
  >(null);

  useEffect(() => {
    const currentTheme = localStorage.getItem("data-theme") || "kakrola";
    if (currentTheme == "dark") {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "#151515");
    } else {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "#ffffff");
    }
    setTheme(currentTheme as any);
  }, []);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("data-theme", theme);
      document.documentElement.setAttribute("data-theme", theme);

      if (theme == "dark") {
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute("content", "#151515");
      } else {
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute("content", "#ffffff");
      }
    }
  }, [theme]);

  return {
    theme,
    setTheme,
  };
};

export default useTheme;
