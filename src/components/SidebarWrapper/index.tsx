"use client";
import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useScreen from "@/hooks/useScreen";
import MobileSidebar from "./MobileSidebar";
import AddTeam from "../AddTeam";
import AddEditProject from "../AddEditProject";
import AddEditChannel from "../AddEditChannel";
import AddTaskModal from "../AddTask/AddTaskModal";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import axios from "axios";

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

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState<boolean | number>(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputField =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement instanceof HTMLElement &&
          activeElement.isContentEditable);

      if (event.key === "Escape") {
        event.preventDefault();

        setShowAddTaskModal(false);
      }

      if (event.key.toLowerCase() == "q" && !isInputField) {
        event.preventDefault();
        setShowAddTaskModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  const { screenWidth } = useScreen();
  const router = useRouter();

  return (
    <>
      {screenWidth > 768 ? (
        <div className="flex h-screen">
          <>
            {!isCollapsed && (
              <div
                className="fixed md:static inset-0 bg-black bg-opacity-50 z-20"
                onClick={toggleSidebar}
              />
            )}

            <div
              className={`fixed md:relative flex transition-all duration-300 h-screen whitespace-nowrap origin-left z-20 group ${
                isCollapsed
                  ? "bg-primary-10 hover:bg-primary-50"
                  : "bg-primary-10"
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
                <Sidebar
                  sidebarWidth={sidebarWidth}
                  setShowAddTeam={setShowAddTeam}
                  setShowLogoutConfirm={setShowLogoutConfirm}
                  setShowAddTaskModal={setShowAddTaskModal}
                />
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
                className={`w-6 h-6 items-center justify-center absolute bottom-12 left-[calc(100%-14px)] z-10 rounded-lg bg-background border border-primary-500 hover:bg-primary-500 hover:text-surface text-primary-500 shadow-md cursor-pointer ${
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
      ) : (
        <MobileSidebar setShowAddTaskModal={setShowAddTaskModal} />
      )}

      {showAddTaskModal && (
        <AddTaskModal onClose={() => setShowAddTaskModal(false)} />
      )}

      {showLogoutConfirm && (
        <ConfirmAlert
          title="Log out?"
          description="Are you sure you want to log out?"
          onCancel={() => setShowLogoutConfirm(false)}
          submitBtnText="Log out"
          loading={logoutLoading}
          onConfirm={async () => {
            setLogoutLoading(true);
            try {
              const response = await axios("/api/auth/signout", {
                method: "POST",
              });

              if (response.data.success) {
                router.push("/auth/login");
              } else {
                // Handle error case (e.g., show an error message)
                console.error("Failed to log out:", response.data.message);
              }
            } catch (error) {
              console.error("Error during logout:", error);
            } finally {
              setLogoutLoading(false);
            }
          }}
        />
      )}

      {showAddTeam && <AddTeam onClose={() => setShowAddTeam(false)} />}
    </>
  );
};

export default SidebarWrapper;
