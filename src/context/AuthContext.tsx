"use client";
import { fetchSidebarData } from "@/lib/queries";
import { fetchWorkspaces } from "@/services/workspace.service";
import { ProfileType } from "@/types/user";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import KakrolaLogo from "@/app/kakrolaLogo";
import { WorkspaceType } from "@/types/workspace";

interface WorkspaceMember {
  id: any;
  workspace_role: any;
  profile_id: any;
}

interface Workspace {
  id: any;
  name: any;
  avatar_url: any;
  is_archived: any;
  is_onboarded: boolean;
  subscription: {
    id: any;
    product_id: any;
  } | null;
}

export interface WorkspaceWithMember {
  workspace_member: WorkspaceMember;
  workspace: Workspace;
}

export interface ProfileWithWorkspaces extends Omit<ProfileType, "_workspaces"> {
  _workspaces: WorkspaceWithMember[];
}

interface AuthContextType {
  profile: ProfileWithWorkspaces | null;
  loading: boolean;
  workspacesWithMembers: WorkspaceWithMember[];
  isAuthenticating: boolean;
}

const profileCache = new Map<string, Promise<ProfileWithWorkspaces | null>>();

const fetchProfile = async (
  profileId: string | null
): Promise<ProfileWithWorkspaces | null> => {
  if (!profileId) return null;

  if (profileCache.has(profileId)) {
    return profileCache.get(profileId) || null;
  }

  const fetchPromise = Promise.all([
    axios.get(`/api/profile?profile_id=${profileId}`),
    fetchWorkspaces(profileId),
  ])
    .then(([profileResponse, workspacesResponse]) => {
      const profile = profileResponse.data;
      if (!profile) return null;

      return {
        ...profile,
        _workspaces: workspacesResponse,
      } as ProfileWithWorkspaces;
    })
    .catch((error) => {
      console.error("Error loading user data:", error);
      return null;
    });

  profileCache.set(profileId, fetchPromise);
  return fetchPromise;
};

const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  workspacesWithMembers: [],
  isAuthenticating: true,
});

const LoadingState = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <KakrolaLogo size="2xl" />
  </div>
);

const shouldRedirectToOnboarding = (profile: ProfileWithWorkspaces | null) => {
  if (!profile) return false;

  const needsOnboarding = !profile.is_onboarded;
  const currentWorkspace = profile._workspaces?.find(
    ({ workspace }) => workspace.id === profile.metadata?.current_workspace_id
  )?.workspace;
  const noSubscription = currentWorkspace && !currentWorkspace.subscription?.id;

  return needsOnboarding || noSubscription || profile._workspaces.length == 0;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [prevWorkspaceId, setPrevWorkspaceId] = useState<WorkspaceType['id'] | null>(null);

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabaseBrowser.auth.getUser();
        setUserId(user?.id || null);
      } catch (error) {
        console.error("Auth check failed:", error);
        setUserId(null);
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkAuth();
  }, []);

  // Basic profile query
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 15,
    retry: 1,
  });

  // Handle workspace changes
  useEffect(() => {
    const currentWorkspaceId = profile?.metadata?.current_workspace_id;
    
    if (currentWorkspaceId && currentWorkspaceId !== prevWorkspaceId) {
      // Clear the cache and trigger a refetch only when workspace changes
      profileCache.delete(userId!);
      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });
      setPrevWorkspaceId(currentWorkspaceId);
    }
  }, [profile?.metadata?.current_workspace_id, prevWorkspaceId, userId, queryClient]);

  // Route protection effect
  useEffect(() => {
    if (!isAuthenticating && profile) {
      const needsOnboarding = shouldRedirectToOnboarding(profile);

      if (needsOnboarding && pathname !== "/app/onboarding") {
        router.replace("/app/onboarding");
      } else if (profile.id && profile.metadata?.current_workspace_id) {
        queryClient.prefetchQuery({
          queryKey: [
            "sidebar_data",
            profile.id,
            profile.metadata.current_workspace_id,
          ],
          queryFn: () => fetchSidebarData(profile.id),
          staleTime: 1000 * 60 * 60,
        });
      }
    }
  }, [profile, isAuthenticating, router, pathname, queryClient]);

  const workspacesWithMembers = useMemo(() => {
    return profile?._workspaces || [];
  }, [profile]);

  const isLoading = isAuthenticating || (!!userId && profileLoading);

  const contextValue = useMemo(
    () => ({
      profile: profile || null,
      loading: isLoading,
      workspacesWithMembers,
      isAuthenticating,
    }),
    [profile, isLoading, workspacesWithMembers, isAuthenticating]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthProvider = () => useContext(AuthContext);

export const withAuthProtection = (Component: React.ComponentType<any>) => {
  return function ProtectedRoute(props: any) {
    const { profile, loading, isAuthenticating } = useAuthProvider();
    const pathname = usePathname();

    if (loading || isAuthenticating) {
      return <LoadingState />;
    }

    if (shouldRedirectToOnboarding(profile) && pathname !== "/app/onboarding") {
      return <LoadingState />;
    }

    return <Component {...props} />;
  };
};

export default AuthProvider;