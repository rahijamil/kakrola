"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import OnboardWrapper from "./OnboardWrapper";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  Industry,
  industryOptions,
  OrganizationSize,
  organizationSizeOptions,
  TeamType,
  WorkType,
  workTypeOptions,
} from "@/types/team";
import { useOnboard } from "@/context/OnboardContext";
import Spinner from "@/components/ui/Spinner";
import { useAuthProvider } from "@/context/AuthContext";

import { createTeam } from "@/services/addteam.service";
import { OnboardingStep } from "./onboarding.types";

const WorkspaceProfile = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<OnboardingStep>>;
}) => {
  const [loading, setLoading] = useState(false);
 

  const {
    dispatch,
    state: {
      work_role,
      workspace_name,
      industry,
      work_type,
      organization_size,
    },
  } = useOnboard();

  const handleChange = (
    { target: { value, label } }: any,
    type: "SET_INDUSTRY" | "SET_WORK_TYPE" | "SET_ORGANIZATION_SIZE"
  ) => {
    dispatch({
      type,
      payload: { value, label },
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    // setStep("workspace-profile");
    setStep("invite-members");
  };

  useEffect(() => {
    // if (!work_role) {
    //   window.history.pushState(
    //     null,
    //     "",
    //     "/app/onboarding?step=customize-kakrola"
    //   );
    // }

    if (!workspace_name) {
      window.history.pushState(
        null,
        "",
        "/app/onboarding?step=create-workspace"
      );
    }
  }, [workspace_name]);

  if (!workspace_name) return null;

  return (
    <OnboardWrapper>
      <>
        <div className="space-y-1 text-center">
          <h1 className="text-lg font-semibold text-text-900">
            Tell us about yourself
          </h1>
          <p className="text-text-500 text-lg">
            This helps show relavant content
          </p>
        </div>

        <div className="space-y-4 w-full">
          <CustomSelect
            id="industry"
            label="What industry do you work in?"
            placeholder="Select your answer"
            options={industryOptions}
            onChange={(ev) => handleChange(ev, "SET_INDUSTRY")}
            value={industry?.value}
          />

          <CustomSelect
            id="work-type"
            label="What work do you do?"
            placeholder="Select your answer"
            options={workTypeOptions}
            onChange={(ev) => handleChange(ev, "SET_WORK_TYPE")}
            value={work_type?.value}
          />

          <CustomSelect
            id="organization-size"
            label="How big is your organization?"
            placeholder="Select your answer"
            options={organizationSizeOptions}
            onChange={(ev) => handleChange(ev, "SET_ORGANIZATION_SIZE")}
            value={organization_size?.value}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!industry || !organization_size || loading}
          fullWidth
        >
          {loading ? <Spinner color="white" /> : "Continue"}
        </Button>
      </>
    </OnboardWrapper>
  );
};

export default WorkspaceProfile;
