"use client";
import React, { useEffect, useState } from "react";
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
  TeamType,
  WorkType,
  workTypeOptions,
} from "@/types/team";
import Image from "next/image";
import { useOnboard } from "@/context/OnboardContext";
import Spinner from "@/components/ui/Spinner";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";

const Step4ProfileWorkspace = () => {
  const router = useRouter();
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
      if (
        profile &&
        work_role &&
        team_name &&
        industry &&
        work_type &&
        organization_size
      ) {
        setLoading(true);

        const teamData: Omit<TeamType, "id"> = {
          name: team_name,
          work_role: work_role?.value,
          industry: industry?.value,
          work_type: work_type?.value,
          organization_size: organization_size?.value,
          avatar_url: null,
          profile_id: profile.id,
          updated_at: new Date().toISOString(),
        };

        const { error, data } = await supabaseBrowser
          .from("teams")
          .insert([teamData])
          .select("id")
          .single();
        if (error) throw error;

        createActivityLog({
          actor_id: profile.id,
          action: ActivityAction.CREATED_TEAM,
          entity: {
            type: EntityType.TEAM,
            id: data.id,
            name: teamData.name
          },
          metadata: {
            new_data: data,
          },
        });

        router.push(`/app/onboard/invite-members?teamId=${data.id}`);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!work_role) {
      router.replace("/app/onboard/customize-kakrola");
    }

    if (!team_name) {
      router.replace("/app/onboard/create-workspace");
    }
  }, [work_role, team_name]);

  if (!work_role || !team_name) return null;

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
              disabled={
                !industry ||
                !workspaceProfileImage ||
                !organization_size ||
                loading
              }
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
