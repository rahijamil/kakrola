"use client";

import React, { useCallback, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import OnboardWrapper from "./OnboardWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboard } from "@/context/OnboardContext";
import Spinner from "@/components/ui/Spinner";
import { useAuthProvider } from "@/context/AuthContext";
import type { PersonalMemberForPageType, TeamType } from "@/types/team";
import type { WorkspaceType } from "@/types/workspace";
import type { ProfileType } from "@/types/user";
import type { PageTemplate, ProjectTemplate } from "@/types/templateTypes";
import type { SidebarData } from "@/hooks/useSidebarData";
import type { PageType } from "@/types/pageTypes";
import type { OnboardingStep } from "./onboarding.types";
import { createTeam } from "@/services/addteam.service";
import { createNewWorkspace } from "@/services/workspace.service";
import { supabaseBrowser } from "@/utils/supabase/client";
import { templateService } from "@/types/templateTypes";
import type { ProjectType } from "@/types/project";
import type { PersonalMemberForProjectType } from "@/types/team";

// Constants
const TEMPLATE_SLUG = "getting-started-1729961731190-lhbq" as const;
const TEAMSPACE_PROJECT_TEMPLATE_SLUG = "tasks-1730123332739-wgz0" as const;

// Types
interface WorkspaceCreationResult {
  workspace: WorkspaceType;
  team: TeamType;
  gettingStartedTemplate: PageTemplate;
  gettingStartedPage: PageType;
  gettingStartedMember: PersonalMemberForPageType;
  teamspaceTemplate: ProjectTemplate;
  teamspaceProject: ProjectType;
  teamspaceMember: PersonalMemberForProjectType;
}

interface CreateWorkspaceProps {
  setStep: (step: OnboardingStep) => void;
  setGettingStartedPageSlug?: (slug: string | null) => void;
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
  is_onboarded: false,
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
  is_private: false,
});

// Update profile's current workspace
const updateProfileCurrentWorkspace = async (
  queryClient: ReturnType<typeof useQueryClient>,
  profile: ProfileType,
  workspaceId: string
) => {
  const updatedMetadata = {
    ...profile.metadata,
    current_workspace_id: workspaceId,
  };

  // Update profile in cache immediately
  queryClient.setQueryData(
    ["profile", profile.id],
    (oldProfile: ProfileType) => ({
      ...oldProfile,
      metadata: updatedMetadata,
    })
  );

  // Update profile in database
  await supabaseBrowser
    .from("profiles")
    .update({ metadata: updatedMetadata })
    .eq("id", profile.id);

  return updatedMetadata;
};

// Custom hook for workspace creation logic
const useWorkspaceCreation = (
  queryClient: ReturnType<typeof useQueryClient>,
  profile: ProfileType | null,
  workspaceName: string
) => {
  const createWorkspace =
    useCallback(async (): Promise<WorkspaceCreationResult> => {
      if (!profile) throw new Error("Profile not found");

      // Use AbortController for cleanup
      const abortController = new AbortController();

      try {
        // Create workspace first
        const workspace = await createNewWorkspace({
          workspaceData: createWorkspaceData(workspaceName, profile.id),
          profile,
        });

        // Update profile's current workspace immediately after creation
        await updateProfileCurrentWorkspace(queryClient, profile, workspace.id);

        // Create team
        const team = await createTeam({
          teamData: createTeamData(workspaceName, profile.id, workspace.id),
          profile,
        });

        // Fetch both templates in parallel
        const [gettingStartedTemplateData, teamspaceTemplateData] =
          await Promise.all([
            supabaseBrowser
              .from("templates")
              .select("*")
              .eq("slug", TEMPLATE_SLUG)
              .single()
              .then(({ data }) => {
                if (!data)
                  throw new Error("Getting Started template not found");
                return data;
              }),
            supabaseBrowser
              .from("templates")
              .select("*")
              .eq("slug", TEAMSPACE_PROJECT_TEMPLATE_SLUG)
              .single()
              .then(({ data }) => {
                if (!data) throw new Error("Teamspace template not found");
                return data;
              }),
          ]);

        // Create both templates in parallel
        const [gettingStartedResult, teamspaceResult] = await Promise.all([
          templateService.createPageFromTemplate(gettingStartedTemplateData, {
            workspace_id: workspace.id,
            team_id: null,
            profile_id: profile.id,
            pagesLength: 0,
          }),
          templateService.createProjectFromTemplate(teamspaceTemplateData, {
            team_id: team.id,
            workspace_id: workspace.id,
            profile_id: profile.id,
            projectsLength: 0,
          }),
        ]);

        return {
          workspace: workspace as WorkspaceType,
          team: team as TeamType,
          gettingStartedTemplate: gettingStartedTemplateData,
          gettingStartedPage: gettingStartedResult.page,
          gettingStartedMember: gettingStartedResult.member,
          teamspaceTemplate: teamspaceTemplateData,
          teamspaceProject: teamspaceResult.project,
          teamspaceMember: teamspaceResult.member,
        };
      } catch (error) {
        throw error;
      } finally {
        abortController.abort();
      }
    }, [queryClient, profile, workspaceName]);

  return { createWorkspace };
};

// Main component
const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({
  setStep,
  setGettingStartedPageSlug,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const submitAttempted = useRef(false);
  const queryClient = useQueryClient();
  const { profile } = useAuthProvider();
  const {
    dispatch,
    state: { workspace_name },
  } = useOnboard();

  const { createWorkspace } = useWorkspaceCreation(
    queryClient,
    profile,
    workspace_name
  );

  // Memoized values
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
      submitAttempted.current = false;
    },
    [dispatch]
  );

  const updateSidebarCache = useCallback(
    (results: WorkspaceCreationResult) => {
      queryClient.setQueryData(
        ["sidebar_data", profile?.id, results.workspace.id],
        (oldData: SidebarData) => ({
          ...oldData,
          pages: [...(oldData?.pages || []), results.gettingStartedPage],
          projects: [...(oldData?.projects || []), results.teamspaceProject],
          personal_members: [
            ...(oldData?.personal_members || []),
            results.gettingStartedMember,
            results.teamspaceMember,
          ],
        })
      );
    },
    [queryClient, profile]
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitDisabled) {
      submitAttempted.current = true;
      return;
    }

    try {
      setIsLoading(true);
      const results = await createWorkspace();
      updateSidebarCache(results);

      setStep("invite-members");
      setGettingStartedPageSlug?.(results.gettingStartedPage.slug);
    } catch (error) {
      console.error("Failed to create workspace:", error);
      // TODO: Implement error handling (e.g., toast notification)
    } finally {
      setIsLoading(false);
    }
  }, [
    isSubmitDisabled,
    createWorkspace,
    updateSidebarCache,
    setStep,
    setGettingStartedPageSlug,
  ]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

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
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            autoFocus
            aria-invalid={submitAttempted.current && !workspace_name.trim()}
            aria-describedby="workspace-name-error"
          />
          <p className="text-xs text-text-500">
            The name of your company or organization
          </p>
          {submitAttempted.current && !workspace_name.trim() && (
            <p id="workspace-name-error" className="text-xs text-red-500">
              Workspace name is required
            </p>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="w-full"
          aria-busy={isLoading}
        >
          {isLoading ? <Spinner color="white" /> : "Continue"}
        </Button>
      </div>
    </OnboardWrapper>
  );
};

export default CreateWorkspace;
