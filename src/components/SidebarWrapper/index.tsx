"use client";
import React, { useCallback, useEffect, useState } from "react";
import TasksSidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setSidebarLeft(isCollapsed ? 0 : -sidebarWidth);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    if (!isCollapsed) {
      setIsResizing(true);
      document.body.style.cursor = "col-resize"; // Set cursor to col-resize
    }
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

  return (
    <div className="flex h-screen">
      <>
        {!isCollapsed && (
          <div
            className="fixed md:static inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleSidebar}
          />
        )}

        <div
          className={`fixed md:relative flex transition-all duration-300 h-screen whitespace-nowrap origin-left z-20 dmd:z-[auto] group ${
            isCollapsed ? "bg-primary-10 hover:bg-primary-50" : "bg-primary-10"
          }`}
          style={{
            width: `${sidebarWidth}px`,
            marginLeft: `${isCollapsed ? sidebarLeft + 20 : sidebarLeft}px`,
          }}
          onClick={() => {
            if (isCollapsed) {
              toggleSidebar();
            }
          }}
        >
          <div
            className={`${
              isCollapsed && "pointer-events-none opacity-0"
            } w-full whitespace-nowrap`}
          >
            <TasksSidebar sidebarWidth={sidebarWidth} />
          </div>

          <div
            className={`w-[3px] min-w-[3px] min-h-full h-full hidden md:block z-10 ${
              isResizing
                ? "bg-primary-200"
                : ` ${
                    isCollapsed
                      ? "bg-text-100 group-hover:bg-primary-50"
                      : "bg-transparent cursor-col-resize hover:bg-primary-200"
                  }`
            }`}
            onMouseDown={handleMouseDown}
          ></div>

          <button
            className={`w-6 h-6 items-center justify-center absolute bottom-12 left-[calc(100%-14px)] z-10 rounded-full bg-background border border-primary-500 hover:bg-primary-500 hover:text-surface text-primary-500 shadow-md cursor-pointer ${
              isCollapsed
                ? "flex group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-surface"
                : "hidden group-hover:flex"
            }`}
            onClick={toggleSidebar}
          >
            {isCollapsed ? (
              <ChevronRight strokeWidth={1.5} size={16} />
            ) : (
              <ChevronLeft strokeWidth={1.5} size={16} />
            )}
          </button>
        </div>
      </>
    </div>
  );
};

export default SidebarWrapper;
