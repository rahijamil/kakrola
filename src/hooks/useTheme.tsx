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
    setTheme(currentTheme as any);
  }, []);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("data-theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return {
    theme,
    setTheme,
  };
};

export default useTheme;
