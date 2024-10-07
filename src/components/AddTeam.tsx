import React, { useState } from "react";
import {
  X,
  ChevronRight,
  Users,
  Briefcase,
  Building,
  UserCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BaseTeamType,
  TeamMemberType,
  TeamType,
  Industry,
  WorkType,
  WorkRole,
  OrganizationSize,
  roleOptions,
  industryOptions,
  workTypeOptions,
  organizationSizeOptions,
} from "@/types/team";
import { useAuthProvider } from "@/context/AuthContext";
import CustomSelect from "./ui/CustomSelect";
import { supabaseBrowser } from "@/utils/supabase/client";
import Textarea from "./ui/textarea";
import Link from "next/link";
import { Permission, RoleType } from "@/types/role";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { AnimatePresence, motion } from "framer-motion";
import PortalWrapper from "./PortalWrapper";
import { Dialog } from "./ui";

// Updated TeamData type
interface TeamData extends BaseTeamType {
  industry: {
    value: Industry;
    label: string;
  } | null;
  work_type: {
    value: WorkType;
    label: string;
  } | null;
  work_role: {
    value: WorkRole;
    label: string;
  } | null;
  organization_size: {
    value: OrganizationSize;
    label: string;
  } | null;
}

const AddTeam = ({ onClose }: { onClose: () => void }) => {
  const { profile } = useAuthProvider();
  const [teamData, setTeamData] = useState<Omit<TeamData, "created_at">>({
    name: "",
    industry: null,
    work_type: null,
    work_role: {
      value: WorkRole.Owner,
      label: "I own or run the company",
    },
    organization_size: null,
    avatar_url: "",
    profile_id: profile?.id || "",
    updated_at: new Date().toISOString(),
  });
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { id: string; value: string; label?: string } }
  ) => {
    if ("label" in e.target) {
      setTeamData({
        ...teamData,
        [e.target.id]: { value: e.target.value, label: e.target.label },
      });
    } else {
      setTeamData({ ...teamData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      if (
        teamData.name &&
        teamData.profile_id &&
        teamData.industry &&
        teamData.work_type &&
        teamData.work_role &&
        teamData.organization_size
      ) {
        // Prepare data for Supabase insertion
        const supabaseData: Omit<Omit<TeamType, "id">, "created_at"> = {
          ...teamData,
          industry: teamData.industry.value,
          work_type: teamData.work_type.value,
          work_role: teamData.work_role.value,
          organization_size: teamData.organization_size.value,
        };

        // Create the team
        const { data: createdTeamData, error: teamError } =
          await supabaseBrowser
            .from("teams")
            .insert(supabaseData)
            .select()
            .single();

        if (teamError) {
          console.error("Error creating team:", teamError);
          return;
        }

        if (createdTeamData && profile) {
          const teamMemberData: Omit<TeamMemberType, "id"> = {
            team_id: createdTeamData.id,
            profile_id: profile.id,
            team_role: RoleType.ADMIN,
            email: profile.email,
            joined_at: new Date().toISOString(),
          };

          const { error: memberError } = await supabaseBrowser
            .from("team_members")
            .insert(teamMemberData);

          if (memberError) {
            console.error("Error creating team member:", memberError);
            // Consider handling this error, possibly by deleting the created team
            return;
          }

          createActivityLog({
            actor_id: profile.id,
            action: ActivityAction.CREATED_TEAM,
            entity_type: EntityType.TEAM,
            entity_id: createdTeamData.id,
            metadata: {},
          });
        }
      }

      onClose();
    }
  };

  return (
    <PortalWrapper>
      <Dialog onClose={onClose} size="xs">
        <div className="space-y-6 p-6 relative">
        <div className="flex justify-between items-center text-text-700">
          <h1 className="font-semibold text-lg">
            {step === 1
              ? "Create a new teamspace"
              : step == 2
              ? "Tell us about your team"
              : "Invite your teammates"}
          </h1>

          <button
            onClick={onClose}
            className="text-text-500 hover:text-text-700 hover:bg-text-100 transition p-1 rounded-lg absolute top-2 right-2"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 md:space-y-8 px-2 sm:p-0"
        >
          {step === 1 ? (
            <div className="space-y-2">
              <Input
                type="text"
                id="name"
                label="Team name"
                Icon={Users}
                value={teamData.name}
                onChange={handleInputChange}
                placeholder="The name of your team or company"
                required
                autoComplete="off"
                autoFocus
              />
              <p className="text-text-500 text-[13px]">
                Keep it something simple your teammates will recognize.
              </p>
            </div>
          ) : step == 2 ? (
            <>
              <CustomSelect
                id="industry"
                label="What industry do you work in?"
                Icon={Briefcase}
                value={teamData.industry?.value}
                onChange={(data) => handleInputChange(data)}
                options={industryOptions}
                placeholder="Select your answer"
              />
              <CustomSelect
                id="work_type"
                label="What work do you do?"
                Icon={Building}
                value={teamData.work_type?.value}
                onChange={(data) => handleInputChange(data)}
                options={workTypeOptions}
                placeholder="Select your answer"
              />
              <CustomSelect
                id="work_role"
                label="What's your role?"
                Icon={UserCircle}
                value={teamData.work_role?.value}
                onChange={(data) => handleInputChange(data)}
                options={roleOptions}
                placeholder="Select your answer"
              />
              <CustomSelect
                id="organization_size"
                label="How big is your organization"
                Icon={Users}
                value={teamData.organization_size?.value}
                onChange={(data) => handleInputChange(data)}
                options={organizationSizeOptions}
                placeholder="Select your answer"
              />
            </>
          ) : (
            <div className="space-y-2">
              <Textarea
                label="Invite members"
                placeholder="Seperate multiple emails with commas"
                rows={3}
              />

              <p className="text-text-500 text-[13px]">
                Gather your team and dive into collaboration together!
              </p>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={
              step == 1
                ? teamData.name.trim().length == 0
                : step == 2
                ? !teamData.industry ||
                  !teamData.work_type ||
                  !teamData.work_role ||
                  !teamData.organization_size
                  ? true
                  : false
                : false
            }
          >
            {step === 1
              ? "Get started"
              : step == 2
              ? "Setup and continue"
              : "Create team"}
            {step !== 3 && <ChevronRight size={16} className="ml-2" />}
          </Button>
        </form>

        <div className="text-xs text-text-500 whitespace-normal">
          By creating a team, you agree to our{" "}
          <Link href="#" className="text-primary-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
        </div>
      </Dialog>
    </PortalWrapper>
  );
};

export default AddTeam;
