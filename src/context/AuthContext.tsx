"use client";
import { ProfileType } from "@/types/user";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const fetchProfile = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabaseBrowser.auth.getUser();
    if (error) throw error;

    if (user) {
      const { data, error } = await supabaseBrowser
        .from("profiles")
        .select("id, username, email, full_name, avatar_url, is_onboarded")
        .eq("id", user.id)
        .single();
      if (error) throw error;

      return data;
    }
    return null;
  } catch (error) {
    console.error("Error loading user data:", error);
    return null;
  }
};

const AuthContext = createContext<{
  profile: ProfileType | null;
  loading: boolean;
}>({
  profile: null,
  loading: true,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, error, isPending } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 60000, // Cache data for 1 minute
    refetchOnWindowFocus: false, // Disable refetching on window focus
    // refetchInterval: 60000, // Refetch every 1 minute
  });

  useEffect(() => {
    if (error) {
      console.error("Error loading user data:", error);
    }

    if (data) {
      if (!data.is_onboarded) {
        router.push("/app/onboard/create-profile");
      }
    }

    // Subscribe to real-time changes for projects
    // const profileSubscription = supabaseBrowser
    //   .channel("profiles-all-channel")
    //   .on(
    //     "postgres_changes",
    //     {
    //       event: "*",
    //       schema: "public",
    //       table: "profiles",
    //       filter: `id=eq.${data?.id}`,
    //     },
    //     (payload) => {
    //       if (payload.eventType === "UPDATE" && payload.new.id === data?.id) {
    //         queryClient.setQueryData(["profile"], payload.new);
    //       } else if (
    //         payload.eventType === "DELETE" &&
    //         payload.old.id === data?.id
    //       ) {
    //         queryClient.setQueryData(["profile"], null);
    //       }
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   supabaseBrowser.removeChannel(profileSubscription);
    // };
  }, [data]);

  return (
    <AuthContext.Provider
      value={{ profile: data as ProfileType | null, loading: isPending }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
