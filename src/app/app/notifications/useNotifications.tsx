"use client";
import { useAuthProvider } from "@/context/AuthContext";
import { getNotifications } from "@/lib/queries";
import { NotificationType } from "@/types/notification";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useNotifications = () => {
  const { profile } = useAuthProvider();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", profile?.id],
    queryFn: () =>
      getNotifications({
        recipient_id: profile?.id as string,
      }),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabaseBrowser
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const newNotification = payload.new as NotificationType;

          // Check if the current user's profile_id is in the recipients array
          const isRecipient = newNotification.recipients.some(
            (recipient) => recipient.profile_id === profile.id
          );

          if (isRecipient) {
            queryClient.setQueryData(
              ["notifications", profile.id],
              (oldData: NotificationType[] = []) => [
                ...oldData,
                newNotification,
              ]
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [profile?.id, queryClient]);

  return { notifications, isLoading };
};
