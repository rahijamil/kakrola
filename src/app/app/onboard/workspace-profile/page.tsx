"use client";
import React, { useState } from "react";
import OnboardWrapper from "../OnboardWrapper";
import { Button } from "@/components/ui/button";
import workspaceProfileImage from "./workspace_profile.png";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  Industry,
  industryOptions,
  OrganizationSize,
  organizationSizeOptions,
  WorkType,
  workTypeOptions,
} from "@/types/team";
import Image from "next/image";

const Step4ProfileWorkspace = () => {
  const router = useRouter();

  const [industry, setIndustry] = useState<{
    label: string;
    value: Industry;
  } | null>(null);

  const [WorkType, setWorkType] = useState<{
    label: string;
    value: WorkType;
  } | null>(null);

  const [organizationSize, setOrganizationSize] = useState<{
    label: string;
    value: OrganizationSize;
  } | null>(null);

  const handleSubmit = () => {
    router.push("/app/onboard/invite-members");
  };

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
              onChange={({ target: { value, label } }) =>
                setIndustry({ value: value as Industry, label: label! })
              }
              value={industry?.value}
            />

            <CustomSelect
              id="work-type"
              label="What work do you do?"
              placeholder="Select your answer"
              options={workTypeOptions}
              onChange={({ target: { value, label } }) =>
                setWorkType({ value: value as WorkType, label: label! })
              }
              value={WorkType?.value}
            />

            <CustomSelect
              id="organization-size"
              label="How big is your organization?"
              placeholder="Select your answer"
              options={organizationSizeOptions}
              onChange={({ target: { value, label } }) =>
                setOrganizationSize({
                  value: value as OrganizationSize,
                  label: label!,
                })
              }
              value={organizationSize?.value}
            />

            <Button
              onClick={handleSubmit}
              disabled={!industry || !WorkType || !organizationSize}
              fullWidth
            >
              Continue
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
          src={workspaceProfileImage}
          width={300}
          height={300}
          alt="Use Case"
          className="object-cover"
        />
      }
      useWithTeam={true}
      currentStep={4}
    />
  );
};

export default Step4ProfileWorkspace;
