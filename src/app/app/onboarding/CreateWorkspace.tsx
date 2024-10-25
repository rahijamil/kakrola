"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import OnboardWrapper from "./OnboardWrapper";
import { Button } from "@/components/ui/button";
import createWorkspace from "./create_workspace.png";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useOnboard } from "@/context/OnboardContext";
import Spinner from "@/components/ui/Spinner";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { OnboardingStep } from "./page";

const CreateWorkspace = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<OnboardingStep>>;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);
  const { profile } = useAuthProvider();

  const {
    dispatch,
    state: { work_role, team_name },
  } = useOnboard();

  const handleSubmit = () => {
    setLoading(true);
    setStep("workspace-profile");
  };

  // useEffect(() => {
  //   if (!work_role) {
  //     window.history.pushState(
  //       null,
  //       "",
  //       "/app/onboarding?step=customize-kakrola"
  //     );
  //   }
  // }, [work_role]);

  // if (!work_role) return null;

  const handleSkip = async () => {
    try {
      if (!profile?.id) throw new Error("Profile not found");
      setSkipLoading(true);

      const { data, error } = await supabaseBrowser
        .from("profiles")
        .update({ is_onboarded: true })
        .eq("id", profile.id);

      if (error) throw error;

      router.push("/app");
    } catch (error) {
      console.error(error);
      setSkipLoading(false);
    }
  };

  return (
    <OnboardWrapper
      leftSide={
        <>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-text-900">Create a team</h1>
            <p className="text-text-500">
              We'll set up a shared workspace for your team's projects alongside
              your personal ones.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <Input
                id="workspaceName"
                label="Team name"
                placeholder="e.g, Awesome Inc."
                value={team_name}
                onChange={(e) =>
                  dispatch({ type: "SET_TEAM_NAME", payload: e.target.value })
                }
              />
              <p className="text-xs text-text-500">
                Keep it something simple your teammates will recognize.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={handleSubmit}
                disabled={!team_name.trim() || loading}
                fullWidth
              >
                {loading ? <Spinner color="white" /> : "Continue"}
              </Button>
              <Button
                onClick={handleSkip}
                disabled={skipLoading}
                variant="ghost"
                fullWidth
              >
                {skipLoading ? <Spinner color="current" /> : "Skip for now"}
              </Button>
            </div>

            <p className="text-xs text-text-500">
              By creating a team, you agree to our{" "}
              <span className="underline">Terms of Service</span> <br />{" "}
              regarding team workspaces.
            </p>
          </div>
        </>
      }
      currentStep={2}
    />
  );
};

export default CreateWorkspace;
