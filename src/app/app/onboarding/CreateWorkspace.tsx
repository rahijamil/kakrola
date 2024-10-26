"use client";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import OnboardWrapper from "./OnboardWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboard } from "@/context/OnboardContext";
import Spinner from "@/components/ui/Spinner";
import { OnboardingStep } from "./page";
import { useAuthProvider } from "@/context/AuthContext";
import { PersonalMemberForPageType, TeamType } from "@/types/team";
import { createTeam } from "@/services/addteam.service";
import { createNewWorkspace } from "@/services/workspace.service";
import { WorkspaceType } from "@/types/workspace";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileType } from "@/types/user";
import { PageTemplate, templateService } from "@/types/templateTypes";
import { SidebarData } from "@/hooks/useSidebarData";
import { PageType } from "@/types/pageTypes";

// Constants
const TEMPLATE_SLUG = "getting-started-1729961731190-lhbq";

// Types
interface WorkspaceCreationResult {
  workspace: WorkspaceType;
  team: TeamType;
  template: PageTemplate;
  page: PageType;
  member: PersonalMemberForPageType;
}

// Utility functions
const createWorkspaceData = (
  workspaceName: string,
  profileId: string
): Omit<WorkspaceType, "id" | "updated_at"> => ({
  name: workspaceName.trim(),
  description: "",
  avatar_url: null,
  profile_id: profileId,
  is_archived: false,
  subscription_id: null,
});

const createTeamData = (
  workspaceName: string,
  profileId: string,
  workspaceId: WorkspaceType["id"]
): Omit<TeamType, "id"> => ({
  name: `${workspaceName.trim()} HQ`,
  description: "",
  avatar_url: null,
  profile_id: profileId,
  updated_at: new Date().toISOString(),
  is_archived: false,
  workspace_id: workspaceId,
});

// Async operations
const createWorkspaceOperations = async (
  workspaceName: string,
  profile: ProfileType
): Promise<WorkspaceCreationResult> => {
  // Run these operations in parallel
  const [workspace, templateData] = await Promise.all([
    createNewWorkspace({
      workspaceData: createWorkspaceData(workspaceName, profile.id),
      profile,
    }),
    supabaseBrowser
      .from("templates")
      .select("*")
      .eq("slug", TEMPLATE_SLUG)
      .single()
      .then(({ data }) => {
        if (!data) throw new Error("Template not found");
        return data;
      }),
  ]);

  // After workspace is created, run these operations in parallel
  const [team, templateResult] = await Promise.all([
    createTeam({
      teamData: createTeamData(workspaceName, profile.id, workspace.id),
      profile,
    }),
    templateService.createPageFromTemplate(templateData, {
      workspace_id: workspace.id,
      team_id: null,
      profile_id: profile.id,
      pagesLength: 0,
    }),
  ]);

  return {
    workspace: workspace as WorkspaceType,
    team: team as TeamType,
    template: templateData,
    page: templateResult.page,
    member: templateResult.member,
  };
};

const updateCacheAndProfile = async (
  queryClient: ReturnType<typeof useQueryClient>,
  profile: ProfileType,
  results: WorkspaceCreationResult
) => {
  const updatedMetadata = {
    ...profile.metadata,
    current_workspace_id: results.workspace.id,
  };

  await Promise.all([
    // Update sidebar data
    queryClient.setQueryData(
      ["sidebar_data", profile.id, results.workspace.id],
      (oldData: SidebarData) => ({
        ...oldData,
        pages: [...(oldData?.pages || []), results.page],
        personal_members: [
          ...(oldData?.personal_members || []),
          results.member,
        ],
      })
    ),
    // Update profile data
    queryClient.setQueryData(
      ["profile", profile.id],
      (oldProfile: ProfileType) => ({
        ...oldProfile,
        metadata: updatedMetadata,
      })
    ),
    // Update profile in database
    supabaseBrowser
      .from("profiles")
      .update({ metadata: updatedMetadata })
      .eq("id", profile.id),
  ]);
};

const CreateWorkspace = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<OnboardingStep>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { profile } = useAuthProvider();
  const {
    dispatch,
    state: { workspace_name },
  } = useOnboard();

  const isSubmitDisabled = useMemo(
    () => !workspace_name.trim() || !profile || isLoading,
    [workspace_name, profile, isLoading]
  );

  const handleWorkspaceNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: "SET_WORKSPACE_NAME",
        payload: e.target.value,
      });
    },
    [dispatch]
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitDisabled || !profile) return;

    try {
      setIsLoading(true);

      // Create workspace and related resources
      const results = await createWorkspaceOperations(workspace_name, profile);

      // Update cache and profile
      await updateCacheAndProfile(queryClient, profile, results);

      setStep("invite-members");
    } catch (error) {
      console.error("Failed to create workspace:", error);
      // Add proper error handling here - could use a toast or error message
    } finally {
      setIsLoading(false);
    }
  }, [workspace_name, profile, queryClient, setStep, isSubmitDisabled]);

  return (
    <OnboardWrapper>
      <div className="space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-lg font-semibold text-text-900">
            Give your workspace a name
          </h1>
          <p className="text-text-500 text-lg">
            Details help any collaborators that join
          </p>
        </div>

        <div className="space-y-1">
          <Input
            id="workspaceName"
            label="Workspace name"
            placeholder="e.g, Awesome Inc."
            value={workspace_name}
            onChange={handleWorkspaceNameChange}
            disabled={isLoading}
          />
          <p className="text-xs text-text-500">
            The name of your company or organization
          </p>
        </div>

        <Button onClick={handleSubmit} disabled={isSubmitDisabled} fullWidth>
          {isLoading ? <Spinner color="white" /> : "Continue"}
        </Button>
      </div>
    </OnboardWrapper>
  );
};

export default CreateWorkspace;
