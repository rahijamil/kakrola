"use client";
import React, { useEffect, useState } from "react";
import OnboardWrapper from "../OnboardWrapper";
import { Button } from "@/components/ui/button";
import createWorkspace from "./create_workspace.png";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useOnboard } from "@/context/OnboardContext";
import Spinner from "@/components/ui/Spinner";

const Step3CreateWorkspace = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);

  const {
    dispatch,
    state: { work_role, team_name },
  } = useOnboard();

  const handleSubmit = () => {
    setLoading(true);
    router.push("/app/onboard/workspace-profile");
  };

  useEffect(() => {
    if (!work_role) {
      router.replace("/app/onboard/customize-kakrola");
    }
  }, [work_role]);

  if (!work_role) return null;

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

            <Button
              onClick={handleSubmit}
              disabled={!team_name.trim() || loading}
              fullWidth
            >
              {loading ? <Spinner color="white" /> : "Continue"}
            </Button>
            <Button
              onClick={() => {
                setSkipLoading(true);
                router.push("/app");
              }}
              disabled={skipLoading}
              variant="ghost"
              fullWidth
            >
              {skipLoading ? <Spinner color="current" /> : "Skip for now"}
            </Button>

            <p className="text-xs text-text-500">
              By creating a team, you agree to our{" "}
              <span className="underline">Terms of Service</span> <br />{" "}
              regarding team workspaces.
            </p>
          </div>
        </>
      }
      rightSide={
        <Image
          src={createWorkspace}
          width={300}
          height={300}
          alt="Use Case"
          className="object-cover"
        />
      }
      useWithTeam={true}
      currentStep={3}
    />
  );
};

export default Step3CreateWorkspace;
