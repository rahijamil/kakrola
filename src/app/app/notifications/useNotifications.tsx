"use client";
import { useAuthProvider } from "@/context/AuthContext";
import { getNotifications } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export const useNotifications = () => {
  const { profile } = useAuthProvider();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", profile?.id],
    queryFn: () =>
      getNotifications({
        recipient_id: profile?.id as string,
      }),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 15,
  });

  return { notifications, isLoading };
};
