"use client";
import React, { useCallback, useEffect, useState } from "react";
import TasksSidebar from "./TasksSidebar";
import MainSidebar from "./MainSidebar";
import { usePathname } from "next/navigation";
import ThreadsSidebar from "./ThreadsSidebar";
import DocsSidebar from "./DocsSidebar";

const SidebarWrapper = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/app/onboard")) {
    return null;
  }

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [afterCollapse, setAfterCollapse] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [sidebarLeft, setSidebarLeft] = useState(0);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
        setSidebarLeft(-sidebarWidth);
      } else {
        setIsCollapsed(false);
        setSidebarLeft(0);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarWidth]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setSidebarLeft(isCollapsed ? 0 : -sidebarWidth);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = "col-resize"; // Set cursor to col-resize
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = ""; // Reset cursor to default
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(220, Math.min(480, e.clientX));

      setSidebarWidth(newWidth);
      if (isCollapsed) {
        setSidebarLeft(-newWidth);
      }
    },
    [isResizing, isCollapsed]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isCollapsed) {
      setTimeout(() => {
        setAfterCollapse(true);
      }, 150);
    } else {
      setAfterCollapse(false);
    }
  }, [isCollapsed]);

  const ThemeSwitcher = () => {
    const switchTheme = (
      theme:
        | "kakrola"
        | "dark"
        | "moonstone"
        | "tangerine"
        | "kale"
        | "blueberry"
        | "lavender"
        | "raspberry"
    ) => {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme); // Save theme preference in local storage
    };

    React.useEffect(() => {
      // Load the saved theme from local storage on initial load
      const savedTheme = localStorage.getItem("theme") || "kakrola";
      document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={() => switchTheme("kakrola")}
          className="px-3 py-1.5 hover:bg-primary-50"
        >
          Kakrola Light
        </button>
        <button
          onClick={() => switchTheme("dark")}
          className="px-3 py-1.5 hover:bg-primary-50"
        >
          Dark
        </button>
        <button
          onClick={() => switchTheme("moonstone")}
          className="px-3 py-1.5 hover:bg-primary-50"
        >
          Moonstone
        </button>
        <button
          onClick={() => switchTheme("tangerine")}
          className="px-3 py-1.5 hover:bg-primary-50"
        >
          Tangerine
        </button>
        <button
          onClick={() => switchTheme("kale")}
          className="px-3 py-1.5 hover:bg-primary-50"
        >
          Kale
        </button>
        <button
          onClick={() => switchTheme("blueberry")}
          className="px-3 py-1.5 hover:bg-primary-50"
        >
          Blueberry
        </button>
        <button
          onClick={() => switchTheme("lavender")}
          className="px-3 py-1.5 hover:bg-primary-50"
        >
          Lavender
        </button>
        <button
          onClick={() => switchTheme("raspberry")}
          className="px-3 py-1.5 hover:bg-primary-50"
        >
          Raspberry
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <MainSidebar toggleSidebar={toggleSidebar} />

      <>
        {!isCollapsed && (
          <div
            className="fixed md:static inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleSidebar}
          />
        )}

        <div
          className={`fixed md:relative flex bg-primary-25 transition-all duration-300 h-screen whitespace-nowrap origin-left z-20 md:z-[auto] ${
            isCollapsed ? "-left-full" : "left-0"
          }`}
          style={{ width: `${sidebarWidth}px`, marginLeft: `${sidebarLeft}px` }}
        >
          <ThemeSwitcher />

          {pathname.startsWith("/app") &&
          !pathname.startsWith("/app/threads") &&
          !pathname.startsWith("/app/docs") ? (
            <TasksSidebar sidebarWidth={sidebarWidth} />
          ) : pathname.startsWith("/app/threads") ? (
            <ThreadsSidebar sidebarWidth={sidebarWidth} />
          ) : (
            pathname.startsWith("/app/docs") && <DocsSidebar />
          )}

          <div
            className={`w-1 min-w-1 min-h-full h-full cursor-col-resize hidden md:block z-10 ${
              isResizing
                ? "bg-primary-200"
                : "hover:bg-primary-200 bg-transparent"
            }`}
            onMouseDown={handleMouseDown}
          ></div>
        </div>
      </>
    </div>
  );
};

export default SidebarWrapper;
