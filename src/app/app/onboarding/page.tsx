"use client";

import React, { useState } from "react";
import CreateProfile from "./CreateProfile";
import CreateWorkspace from "./CreateWorkspace";
import WorkspaceProfile from "./WorkspaceProfile";
import InviteMembers from "./InviteMembers";

export type OnboardingStep =
  | "create-profile"
  | "create-workspace"
  | "workspace-profile"
  | "invite-members";

const OnboardingPage = () => {
  const [step, setStep] = useState<OnboardingStep>("create-profile");

  const renderStep = () => {
    switch (step) {
      case "create-profile":
        return <CreateProfile setStep={setStep} />;
      case "create-workspace":
        return <CreateWorkspace setStep={setStep} />;
      case "workspace-profile":
        return <WorkspaceProfile setStep={setStep} />;
      case "invite-members":
        return <InviteMembers />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="wrapper py-8">{renderStep()}</main>
    </div>
  );
};

export default OnboardingPage;
