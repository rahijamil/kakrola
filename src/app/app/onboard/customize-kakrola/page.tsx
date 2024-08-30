"use client";
import React, { useState } from "react";
import OnboardWrapper from "../OnboardWrapper";
import { Button } from "@/components/ui/button";
import customizeKakrolaImage from "./customize_kakrola.png";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/ui/CustomSelect";
import { roleOptions } from "@/types/team";
import Image from "next/image";
import { useOnboard } from "@/context/OnboardContext";
import Spinner from "@/components/ui/Spinner";

const Step2CustomizeKakrola = () => {
  const router = useRouter();
  const {
    dispatch,
    state: { work_role },
  } = useOnboard();

  const handleRoleChange = ({ target: { value, label } }: any) => {
    dispatch({
      type: "SET_WORK_ROLE",
      payload: { value, label },
    });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
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
                onChange={handleRoleChange}
                value={work_role?.value}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!work_role || loading}
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
      rightSide={
        <Image
          src={customizeKakrolaImage}
          width={300}
          height={300}
          alt="Use Case"
          className="object-cover"
        />
      }
      useWithTeam={true}
      currentStep={2}
    />
  );
};

export default Step2CustomizeKakrola;
