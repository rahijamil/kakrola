import NotificationItem from "@/app/app/notifications/NotificationItem";
import { useNotifications } from "@/app/app/notifications/useNotifications";
import Dropdown from "@/components/ui/Dropdown";
import useScreen from "@/hooks/useScreen";
import { useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SidebarNotifications = ({
  triggerRef,
}: {
  triggerRef: React.RefObject<HTMLDivElement>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, isLoading } = useNotifications();
  const [allUnread, setAllUnread] = useState<"all" | "unread">("unread");

  const { screenWidth } = useScreen();

  const filteredNotifications = useMemo(() => {
    if (allUnread === "all") {
      return notifications;
    } else {
      return notifications.filter((notification) => !notification.is_read);
    }
  }, [notifications, allUnread]);

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <button
          onClick={onClick}
          className={`${
            isOpen
              ? "bg-primary-100 text-primary-500"
              : "hover:bg-primary-100 text-text-700"
          } 
              rounded-lg transition-colors duration-150 z-10 w-7 h-7 flex items-center justify-center`}
        >
          <Bell strokeWidth={1.5} width={20} />
        </button>
      )}
      title="Notifications"
      content={
        <div className="h-[400px] overflow-y-auto">
          <div className="px-4 pt-1 text-xs">
            <ul className="flex items-center p-1 rounded-lg bg-text-100 w-fit">
              <li
                className={`p-1 px-4 rounded-lg font-medium cursor-pointer transition ${
                  allUnread === "all" ? "bg-surface" : ""
                }`}
                onClick={() => setAllUnread("all")}
              >
                All
              </li>
              <li
                className={`p-1 px-4 rounded-lg font-medium cursor-pointer transition ${
                  allUnread === "unread" ? "bg-surface" : ""
                }`}
                onClick={() => setAllUnread("unread")}
              >
                Unread
              </li>
            </ul>
          </div>

          <div className="mt-2 h-full">
            {isLoading ? (
              <div className="divide-y divide-text-100 border-y border-text-100">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className={`flex items-center p-4 gap-2`}>
                    <Skeleton width={40} height={40} borderRadius={8} />
                    <div className="flex flex-col">
                      <Skeleton
                        width={screenWidth > 412 ? 300 : 200}
                        height={10}
                        borderRadius={8}
                      />
                      <Skeleton
                        width={screenWidth > 412 ? 100 : 80}
                        height={10}
                        borderRadius={8}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-text-100 border-y border-text-100">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    forModal
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center pt-10 flex-col gap-1 h-full select-none">
                <Image
                  src="/notifications.png"
                  width={150}
                  height={150}
                  alt="Today"
                />
                <div className="text-center space-y-1 w-11/12 max-w-64 mx-auto">
                  <h3 className="font-semibold">Stay in the loop</h3>
                  <p className="text-xs text-text-600">
                    Here, you&apos;ll find notifications for any changes in your
                    shared projects.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      }
      contentWidthClass="w-96"
    />
  );
};

export default SidebarNotifications;
