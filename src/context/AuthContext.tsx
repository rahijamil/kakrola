"use client";
import { fetchSidebarData, getNotifications } from "@/lib/queries";
import { ProfileType } from "@/types/user";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const fetchProfile = async (profile_id: string | null) => {
  try {
    if (!profile_id) {
      return null;
    }

    const response = await axios.get(`/api/profile?profile_id=${profile_id}`);
    return response.data || null;
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
  const [userId, setUserId] = useState<ProfileType["id"] | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user?.id) {
          setUserId(session.user.id);

          queryClient.prefetchQuery({
            queryKey: ["profile", session.user.id],
            queryFn: async () => await fetchProfile(session.user.id),
            staleTime: 1000 * 60 * 15, // Cache data for 15 minutes
          });
        } else {
          setUserId(null);
        }
      }
    );

    // Cleanup the listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Fetch profile data only if userId exists
  const { data, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId),
    enabled: !!userId, // Ensures query only runs if userId exists
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching profile:", error);
    }

    if (data && !data.is_onboarded) {
      router.push("/app/onboard/create-profile");
    }
  }, [data, error]);

  useEffect(() => {
    if (userId) {
      queryClient.prefetchQuery({
        queryKey: ["sidebar_data", userId],
        queryFn: () => fetchSidebarData(userId),
        staleTime: 1000 * 60 * 60,
      });
    }
  }, [userId]);

  return (
    <AuthContext.Provider
      value={{
        profile: data as ProfileType | null,
        loading: !data?.id,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = () => useContext(AuthContext);

export default AuthProvider;
