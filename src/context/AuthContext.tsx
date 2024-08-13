"use client";
import { ProfileType } from "@/types/user";
import { createClient } from "@/utils/supabase/client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{ profile: ProfileType | null }>({
  profile: null,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    const getAuthUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.log("Error loading user data!");
      }

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select(`id, username, email, full_name, avatar_url`)
          .eq("id", user?.id)
          .single();
        if (error) {
          console.log("Error loading user data!");
        }
        if (data) {
          setProfile(data);
        }
      }
    };

    getAuthUser();
  }, []);

  return (
    <AuthContext.Provider value={{ profile }}>{children}</AuthContext.Provider>
  );
};

export const useAuthProvider = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
