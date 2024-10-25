"use client";
import { useState, useEffect, useCallback } from "react";

export default function useSidebarCollapse() {
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [sidebarLeft, setSidebarLeft] = useState(0);
  const [isResizing, setIsResizing] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [afterCollapse, setAfterCollapse] = useState(false);

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

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = ""; // Reset cursor to default
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSidebarWidth(window.innerWidth * 0.2);
      setSidebarLeft(window.innerWidth * 0.2);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  return {
    sidebarWidth,
    sidebarLeft,
    isResizing,
    setIsResizing,
    toggleSidebar,
    handleMouseDown,
    isCollapsed,
  };
}
