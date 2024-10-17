import NotificationItem from "@/app/app/notifications/NotificationItem";
import { useNotifications } from "@/app/app/notifications/useNotifications";
import TabSwitcher from "@/components/TabSwitcher";
import Dropdown from "@/components/ui/Dropdown";
import { useAuthProvider } from "@/context/AuthContext";
import useScreen from "@/hooks/useScreen";
import { TabItem } from "@/types/types.utils";
import { Bell, MailOpen } from "lucide-react";
import Image from "next/image";
import React, { useState, useMemo, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

enum Id {
  All = "all",
  Unread = "unread",
}

const tabItems: TabItem[] = [
  {
    id: Id.All,
    name: "All",
    icon: <Bell strokeWidth={1.5} className="w-4 h-4" />,
  },
  {
    id: Id.Unread,
    name: "Unread",
    icon: <MailOpen strokeWidth={1.5} className="w-4 h-4" />,
  },
];

const SidebarNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, isLoading } = useNotifications();
  const [allUnread, setAllUnread] = useState<Id>(Id.Unread);
  const { profile } = useAuthProvider();

  const { screenWidth } = useScreen();

  const triggerRef = useRef(null);

  const filteredNotifications = useMemo(() => {
    if (allUnread == Id.All) {
      return notifications;
    } else {
      return notifications.filter(
        (notification) =>
          !notification.recipients.find(
            (item) => item.profile_id == profile?.id
          )?.is_read
      );
    }
  }, [notifications, allUnread]);

  return (
    <Dropdown
      fullMode
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <button
          ref={triggerRef}
          onClick={onClick}
          className={`${
            isOpen ? "md:bg-primary-100 md:text-primary-500" : "text-text-700"
          } 
              rounded-lg transition-colors duration-150 z-10 w-7 h-7 flex items-center justify-center active:bg-text-100`}
          onTouchStart={(ev) => ev.currentTarget.classList.add("bg-text-100")}
          onTouchEnd={(ev) => ev.currentTarget.classList.remove("bg-text-100")}
        >
          <Bell strokeWidth={1.5} width={20} />
        </button>
      )}
      title="Notifications"
      content={
        <div className="h-[400px] overflow-y-auto">
          <TabSwitcher
            activeTab={allUnread}
            setActiveTab={setAllUnread as any}
            tabItems={tabItems}
          />

          <div className="h-full">
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
              <>
                {filteredNotifications
                  .sort((a, b) => Number(b.created_at) - Number(a.created_at))
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      forModal
                    />
                  ))}
              </>
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
