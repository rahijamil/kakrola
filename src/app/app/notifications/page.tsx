"use client";
import LayoutWrapper from "@/components/LayoutWrapper";
import Image from "next/image";
import React, { useState } from "react";

const AppNotifications = () => {
  const [allUnread, setAllUnread] = useState<"all" | "unread">("all");

  return (
    <LayoutWrapper headline="Notifications">
      <div>
        <div>
          <ul className="flex items-center p-1 rounded-full bg-text-200 w-fit">
            <li
              className={`p-1 px-4 rounded-full font-medium cursor-pointer transition ${
                allUnread === "all" ? "bg-surface" : ""
              }`}
              onClick={() => setAllUnread("all")}
            >
              All
            </li>
            <li
              className={`p-1 px-4 rounded-full font-medium cursor-pointer transition ${
                allUnread === "unread" ? "bg-surface" : ""
              }`}
              onClick={() => setAllUnread("unread")}
            >
              Unread
            </li>
          </ul>
        </div>

        <div className="flex items-center flex-col gap-1 h-[30vh] select-none">
          <Image
            src="/notifications.png"
            width={220}
            height={200}
            alt="Today"
            className="rounded-full object-cover"
            draggable={false}
          />

          <div className="text-center space-y-1 w-72">
            {allUnread === "all" && (
              <h3 className="font-medium text-base">Stay in the loop</h3>
            )}
            <p className="text-sm text-text-600">
              {allUnread === "all"
                ? `Here, you’ll find notifications for any changes that happen in
              your shared projects.`
                : "Nice work! You’re all caught up."}
            </p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default AppNotifications;
