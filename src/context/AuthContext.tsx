"use client";
import { ProfileType } from "@/types/user";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<{
  profile: ProfileType | null;
  loading: boolean;
}>({
  profile: null,
  loading: true,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getAuthUser = async () => {
      const {
        data: { user },
        error,
      } = await supabaseBrowser.auth.getUser();

      if (error) {
        console.log("Error loading user data!");
      }

      if (user) {
        const { data, error } = await supabaseBrowser
          .from("profiles")
          .select(`id, username, email, full_name, avatar_url, is_onboarded`)
          .eq("id", user?.id)
          .single();
        if (error) {
          console.log("Error loading user data!");
        }
        if (data) {
          setProfile(data);

          if (!data.is_onboarded) {
            // router.push("/app/onboard/create-profile");
          }
        }
      }

      setLoading(false);
    };

    getAuthUser();
  }, []);

  useEffect(() => {
    // Subscribe to real-time changes for projects
    const profileSubscription = supabaseBrowser
      .channel("profiles-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${profile?.id}`,
        },
        (payload) => {
          if (
            (payload.eventType === "INSERT" ||
              payload.eventType === "UPDATE") &&
            payload.new.id === profile?.id
          ) {
            setProfile(payload.new as ProfileType);
          } else if (
            payload.eventType === "DELETE" &&
            payload.old.id === profile?.id
          ) {
            setProfile(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(profileSubscription);
    };
  }, [profile]);

  return (
    <AuthContext.Provider value={{ profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
