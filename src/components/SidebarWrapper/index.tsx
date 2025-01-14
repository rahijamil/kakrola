"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useScreen from "@/hooks/useScreen";
import MobileSidebar from "./MobileSidebar";
import AddTeam from "../AddTeam";
import AddTaskModal from "../AddTask/AddTaskModal";
import ConfirmAlert from "../AlertBox/ConfirmAlert";
import axios from "axios";
import AddAnotherAccount from "./AddAnotherAccount";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const SidebarWrapper = ({
  props: {
    isCollapsed,
    toggleSidebar,
    sidebarWidth,
    sidebarLeft,
    isResizing,
    handleMouseDown,
  },
}: {
  props: {
    sidebarWidth: number;
    sidebarLeft: number;
    isResizing: boolean;
    setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
    toggleSidebar: () => void;
    handleMouseDown: (e: React.MouseEvent) => void;
    isCollapsed: boolean;
  };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authType = (searchParams.get("auth") as "signup" | "login") || "signup";

  const [quickActions, setQuickActions] = useState({
    showAddTaskModal: false,
    showAddSectionModal: false,
    showCreateDMModal: false,
    showCreateThreadModal: false,
    showCreateThreadReplyModal: false,
    isOpen: false,
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState<boolean | number>(false);
  const [showAddAnotherAccount, setShowAddAnotherAccount] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputField =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement instanceof HTMLElement &&
          activeElement.isContentEditable);

      // if (event.key === "Escape") {
      //   event.preventDefault();

      //   setQuickActions((prev) => ({ ...prev, isOpen: false }));
      // }

      if (event.key.toLowerCase() == "q" && !isInputField) {
        event.preventDefault();
        setQuickActions((prev) => ({ ...prev, isOpen: true }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const { screenWidth } = useScreen();
  const router = useRouter();

  const isNotRenderMobileSidebar = pathname.includes("/th/");

  return (
    <div className="select-none">
      {screenWidth > 768 ? (
        <div className="flex h-screen group" data-state="sidebar">
          <>
            {/* {!isCollapsed && (
              <div
                className="fixed md:static inset-0 bg-black bg-opacity-50 z-10"
                onClick={toggleSidebar}
              />
            )} */}

            <div
              className={`fixed md:relative flex transition-all duration-300 h-screen whitespace-nowrap origin-left z-10 desktop_sidebar ${
                isCollapsed && "hover:bg-primary-50 is_collapsed"
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
                  setQuickActions={setQuickActions}
                  quickActions={quickActions}
                  setShowAddAnotherAccount={setShowAddAnotherAccount}
                />
              </div>

              <div
                className={`w-[3px] min-w-[3px] min-h-full h-full hidden md:block z-10 absolute left-full ${
                  isResizing
                    ? "bg-primary-200"
                    : ` ${
                        isCollapsed
                          ? "bg-text-100 group-data-[state=sidebar]:group-hover:bg-primary-50"
                          : "bg-transparent cursor-col-resize hover:bg-primary-200"
                      }`
                }`}
                onMouseDown={handleMouseDown}
              ></div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      className={`w-6 h-6 items-center justify-center absolute bottom-12 left-[calc(100%-14px)] z-10 rounded-lg bg-background border border-primary-500 hover:bg-primary-500 hover:text-surface text-primary-500 shadow-md cursor-pointer ${
                        isCollapsed
                          ? "flex group-data-[state=sidebar]:group-hover:bg-primary-500 group-data-[state=sidebar]:group-hover:border-primary-500 group-data-[state=sidebar]:group-hover:text-surface"
                          : "hidden group-data-[state=sidebar]:group-hover:flex"
                      }`}
                      onClick={toggleSidebar}
                    >
                      {isCollapsed ? (
                        <ChevronRight strokeWidth={1.5} size={16} />
                      ) : (
                        <ChevronLeft strokeWidth={1.5} size={16} />
                      )}
                    </button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p className="text-xs font-medium">
                      {isCollapsed ? "Expand" : "Collapse"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        </div>
      ) : (
        !isNotRenderMobileSidebar && (
          <MobileSidebar
            setQuickActions={setQuickActions}
            quickActions={quickActions}
          />
        )
      )}

      {quickActions.showAddTaskModal && (
        <AddTaskModal
          onClose={() =>
            setQuickActions({ ...quickActions, showAddTaskModal: false })
          }
        />
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

      {showAddAnotherAccount && (
        <AddAnotherAccount
          onClose={() => setShowAddAnotherAccount(false)}
          type={authType}
        />
      )}
    </div>
  );
};

export default SidebarWrapper;
