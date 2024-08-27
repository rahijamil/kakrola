"use client";
import React, { useState } from "react";
import OnboardWrapper from "../OnboardWrapper";
import { Button } from "@/components/ui/button";
import createWorkspace from "./create_workspace.png";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const Step3CreateWorkspace = () => {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");

  const handleSubmit = () => {
    router.push("/app/onboard/workspace-profile");
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
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <p className="text-xs text-text-500">
                Keep it something simple your teammates will recognize.
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!teamName.trim()}
              fullWidth
            >
              Continue
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={false}
              variant="gray"
              fullWidth
            >
              Skip for now
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
          className="object-cover rounded-lg"
        />
      }
      useWithTeam={true}
      currentStep={3}
    />
  );
};

export default Step3CreateWorkspace;
