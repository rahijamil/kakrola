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
import { OnboardingStep } from "./page";

const WorkspaceProfile = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<OnboardingStep>>;
}) => {
  const [loading, setLoading] = useState(false);
  const { profile } = useAuthProvider();

  const {
    dispatch,
    state: { work_role, team_name, industry, work_type, organization_size },
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

  const handleSubmit = async () => {
    try {
      if (profile && team_name && industry && work_type && organization_size) {
        setLoading(true);

        const teamData: Omit<TeamType, "id"> = {
          name: team_name,
          description: "",
          industry: industry?.value,
          work_type: work_type?.value,
          work_role: "",
          organization_size: organization_size?.value,
          avatar_url: null,
          profile_id: profile.id,
          updated_at: new Date().toISOString(),
          is_archived: false,
        };

        const data = await createTeam({
          teamData,
          profile,
        });

        // window.history.pushState(
        //   null,
        //   "",
        //   `/app/onboarding?step=invite-members&team_id=${data.id}`
        // );

        setStep("invite-members")
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (!work_role) {
    //   window.history.pushState(
    //     null,
    //     "",
    //     "/app/onboarding?step=customize-kakrola"
    //   );
    // }

    if (!team_name) {
      window.history.pushState(
        null,
        "",
        "/app/onboarding?step=create-workspace"
      );
    }
  }, [team_name]);

  if (!team_name) return null;

  return (
    <OnboardWrapper
      leftSide={
        <>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-text-900">
              About you and <br /> your team
            </h1>
            <p className="text-text-500">
              Your answers will help tailor your experience.
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

            <Button
              onClick={handleSubmit}
              disabled={!industry || !organization_size || loading}
              fullWidth
            >
              {loading ? <Spinner color="white" /> : "Continue"}
            </Button>

            <p className="text-xs text-text-500">
              By creating a team, you agree to our{" "}
              <span className="underline">Terms of Service</span> <br />{" "}
              regarding team workspaces.
            </p>
          </div>
        </>
      }
      currentStep={3}
    />
  );
};

export default WorkspaceProfile;
