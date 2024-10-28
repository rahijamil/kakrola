"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import CreateProfile from "./CreateProfile";
import CreateWorkspace from "./CreateWorkspace";
import InviteMembers from "./InviteMembers";
import SubscriptionTrial from "./SubscriptionTrial";
import { useAuthProvider } from "@/context/AuthContext";
import { OnboardingStep } from "./onboarding.types";
import { atom, useAtom } from "jotai";

// State atoms for onboarding
const stepAtom = atom<OnboardingStep>("create-profile");
const gettingStartedPageSlugAtom = atom<string | null>(null);

// Type definitions for better type safety
interface StepComponentProps {
  setStep: (step: OnboardingStep) => void;
  setGettingStartedPageSlug?: (slug: string | null) => void;
  gettingStartedPageSlug?: string | null;
}

// Component map to avoid switch statement
const STEP_COMPONENTS: Record<OnboardingStep, React.FC<StepComponentProps>> = {
  "create-profile": CreateProfile,
  "create-workspace": CreateWorkspace,
  "invite-members": InviteMembers,
  subscription: ({ gettingStartedPageSlug }) => (
    <SubscriptionTrial
      gettingStartedPageSlug={gettingStartedPageSlug || null}
    />
  ),
};

const Onboarding: React.FC = () => {
  const { profile, workspacesWithMembers } = useAuthProvider();
  const [step, setStep] = useAtom(stepAtom);
  const [gettingStartedPageSlug, setGettingStartedPageSlug] = useAtom(
    gettingStartedPageSlugAtom
  );

  // Memoize current workspace lookup
  const currentWorkspace = useMemo(() => {
    if (!profile?.metadata?.current_workspace_id) return null;

    return workspacesWithMembers.find(
      ({ workspace }) => workspace.id === profile.metadata?.current_workspace_id
    )?.workspace;
  }, [profile?.metadata?.current_workspace_id, workspacesWithMembers]);

  // Determine the current step based on profile and workspace state
  const determineStep = useCallback((): OnboardingStep => {
    if (!profile?.is_onboarded) {
      return "create-profile";
    }

    if (currentWorkspace) {
      // if subscription id that means, user trying to create another workspace
      return currentWorkspace.subscription?.id
        ? "create-workspace"
        : currentWorkspace.is_onboarded
        ? "subscription"
        : "invite-members";
    }

    return "create-workspace";
  }, [profile?.is_onboarded, currentWorkspace]);

  // Update step whenever profile or workspace changes
  React.useEffect(() => {
    const newStep = determineStep();
    if (newStep !== step) {
      setStep(newStep);
    }
  }, [determineStep, step, setStep]);

  // Memoize step component and props
  const StepComponent = useMemo(() => {
    const Component = STEP_COMPONENTS[step];
    if (!Component) return null;

    const props: StepComponentProps = {
      setStep,
      ...(step === "create-workspace" && { setGettingStartedPageSlug }),
      ...(step === "subscription" && { gettingStartedPageSlug }),
    };

    return <Component {...props} />;
  }, [step, gettingStartedPageSlug]);

  // Early return if no component
  if (!StepComponent) return null;

  return <>{StepComponent}</>;
};

// Performance optimization: Wrap in memo with custom comparison
export default React.memo(Onboarding, (prevProps, nextProps) => {
  // Since we don't have props, always return true to prevent unnecessary rerenders
  return true;
});
