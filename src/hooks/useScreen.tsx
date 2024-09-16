import React, { useEffect, useState } from "react";

export type Breakpoint = {
  breakpoint: "sm" | "md" | "lg" | "xl" | null;
};

const useScreen = () => {
  const [breakpoint, setBreakpoints] = useState<Breakpoint["breakpoint"]>(null);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);

      if (window.innerWidth < 768) {
        setBreakpoints("sm");
      } else if (window.innerWidth < 1024) {
        setBreakpoints("md");
      } else if (window.innerWidth < 1280) {
        setBreakpoints("lg");
      } else {
        setBreakpoints("xl"); // Changed to cover widths >= 1536px
      }
    };

    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    breakpoint,
    screenWidth,
  };
};

export default useScreen;
