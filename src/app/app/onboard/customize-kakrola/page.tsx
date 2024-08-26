"use client";
import React, { useState } from "react";
import OnboardWrapper from "../OnboardWrapper";
import { Button } from "@/components/ui/button";
import createPorfileImage from "../create-profile/create-profile.png";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/ui/CustomSelect";
import { roleOptions, WorkRole } from "@/types/team";

const Step2CustomizeKakrola = () => {
  const router = useRouter();
  const [work_role, setWorkRole] = useState<{
    label: string;
    value: WorkRole;
  } | null>(null);

  const handleSubmit = () => {
    router.push("/app/onboard/create-workspace");
  };
  return (
    <OnboardWrapper
      leftSide={
        <>
          <h1 className="text-3xl font-bold text-text-900">
            Customize your <br /> Kakrola
          </h1>

          <div className="space-y-4 w-full">
            <div>
              <CustomSelect
                id="role"
                label="Your role"
                placeholder="Select an option"
                options={roleOptions}
                onChange={({ target: { value, label } }) =>
                  setWorkRole({ value: value as WorkRole, label: label! })
                }
                value={work_role?.value}
              />
            </div>

            <Button onClick={handleSubmit} disabled={false} fullWidth>
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
      imageSrc={createPorfileImage}
      useWithTeam={true}
      currentStep={2}
    />
  );
};

export default Step2CustomizeKakrola;
