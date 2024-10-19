import { useEffect, useState } from "react";

export type Breakpoint = {
  breakpoint: "sm" | "md" | "lg" | "xl" | null;
};

const useScreen = () => {
  const [screenWidth, setScreenWidth] = useState<number>(0); // Start with 0 for SSR
  const [breakpoint, setBreakpoint] = useState<Breakpoint["breakpoint"]>(null);

  const getViewportWidth = () => {
    if (typeof window !== "undefined") {
      return window.visualViewport
        ? window.visualViewport.width
        : window.innerWidth;
    }
    return 0; // Return 0 or a default value if window is undefined
  };

  const updateScreenData = () => {
    const currentWidth = getViewportWidth();
    setScreenWidth(currentWidth);

    if (currentWidth < 768) {
      setBreakpoint("sm");
    } else if (currentWidth < 1024) {
      setBreakpoint("md");
    } else if (currentWidth < 1280) {
      setBreakpoint("lg");
    } else {
      setBreakpoint("xl");
    }
  };

  useEffect(() => {
    // Initial update on mount
    updateScreenData();

    // Add event listeners for resize and orientation changes
    window.addEventListener("resize", updateScreenData);
    window.addEventListener("orientationchange", updateScreenData);

    return () => {
      window.removeEventListener("resize", updateScreenData);
      window.removeEventListener("orientationchange", updateScreenData);
    };
  }, []);

  return {
    breakpoint,
    screenWidth,
  };
};

export default useScreen;
