import Spinner from "@/components/ui/Spinner";
import { useAuthProvider } from "@/context/AuthContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { NotificationType } from "@/types/notification";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const NotificationItem = ({
  notification,
}: {
  notification: NotificationType;
}) => {
  const router = useRouter();
  const { profile } = useAuthProvider();
  const { refetchSidebarData } = useSidebarDataProvider();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsReadUnread = async (ev: React.MouseEvent<HTMLElement>) => {
    ev.stopPropagation();

    // Optimistically update the cache
    queryClient.setQueryData(
      ["notifications", profile?.id],
      (oldNotifications: NotificationType[] | undefined) => {
        return oldNotifications?.map((notif) =>
          notif.id === notification.id
            ? { ...notif, is_read: !notif.is_read }
            : notif
        );
      }
    );

    try {
      await supabaseBrowser
        .from("notifications")
        .update({ is_read: !notification.is_read })
        .eq("id", notification.id);
    } catch (error) {
      console.error("Failed to mark as read/unread", error);
    }
  };

  const handleNotificationClick = async (ev: React.MouseEvent<HTMLElement>) => {
    if (!notification.is_read) {
      await handleMarkAsReadUnread(ev);
    }

    if (notification.api_url && !notification.is_read) {
      setIsLoading(true);
      await axios(notification.api_url);
      await refetchSidebarData();
    }

    if (notification.redirect_url) {
      router.push(notification.redirect_url);
    }

    setIsLoading(false);
  };

  return (
    <>
      <div
        onClick={handleNotificationClick}
        className={`flex items-center p-4 cursor-pointer gap-2 border-l-4 transition relative rounded-lg ${
          notification.is_read
            ? "border-transparent hover:bg-text-100 dark:bg-surface"
            : "border-primary-200 bg-primary-50"
        }`}
      >
        <Image
          src={notification.triggered_by.avatar_url}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-lg w-10 h-10 min-w-10 min-h-10 max-w-10 max-h-10 object-cover"
        />
        <div className="flex flex-col">
          <p dangerouslySetInnerHTML={{ __html: notification.content }} />
          <small className="text-text-600 text-xs">
            {formatDistanceToNow(new Date(notification.created_at))} ago
          </small>
        </div>

        {/* read/unread indicator */}
        <button
          className="absolute bottom-4 right-3 w-3 h-3 flex items-center justify-center border border-primary-500 rounded-lg"
          onClick={handleMarkAsReadUnread}
          title={notification.is_read ? "Mark as unread" : "Mark as read"}
        >
          {!notification.is_read && (
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-lg" />
          )}
        </button>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center text-primary-500">
          <Spinner size="sm" color="current" />
        </div>
      )}
    </>
  );
};

export default NotificationItem;
