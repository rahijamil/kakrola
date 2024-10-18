"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useNotifications } from "./useNotifications";
import NotificationItem from "./NotificationItem";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useScreen from "@/hooks/useScreen";
import TabSwitcher from "@/components/TabSwitcher";
import { TabItem } from "@/types/types.utils";
import { Bell, MailOpen } from "lucide-react";

enum Id {
  All = "all",
  Unread = "unread",
}

const AppNotifications = () => {
  const { notifications, isLoading } = useNotifications();
  const [allUnread, setAllUnread] = useState<"all" | "unread">("all");

  const tabItems: TabItem[] = [
    {
      id: Id.All,
      name: "All",
      icon: <Bell strokeWidth={1.5} className="w-4 h-4" />,
      onClick: () => setAllUnread(Id.All),
    },
    {
      id: Id.Unread,
      name: "Unread",
      icon: <MailOpen strokeWidth={1.5} className="w-4 h-4" />,
      onClick: () => setAllUnread(Id.Unread),
    },
  ];

  const { screenWidth } = useScreen();

  return (
    <div className="wrapper max-w-3xl">
      <h1
        className={`md:text-3xl font-bold p-1 h-[54px] md:h-24 flex items-center`}
      >
        Notifications
      </h1>
      <TabSwitcher activeTab={allUnread} tabItems={tabItems} />

      <div className="mt-4">
        {isLoading ? (
          <div className="divide-y divide-text-100 border-y border-text-100">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className={`flex items-center p-4 gap-2 rounded-lg`}
              >
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
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-text-100 border-y border-text-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center flex-col gap-1 h-[30vh] select-none">
            <Image
              src="/notifications.png"
              width={220}
              height={200}
              alt="Today"
            />
            <div className="text-center space-y-1 w-72">
              <h3 className="font-medium text-base">Stay in the loop</h3>
              <p className="text-sm text-text-600">
                Here, you&apos;ll find notifications for any changes in your
                shared projects.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppNotifications;
