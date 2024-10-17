import React, { useState } from "react";
import {
  X,
  ChevronRight,
  Users,
  Briefcase,
  Building,
  UserCircle,
  ChevronLeft,
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
import { TeamRoleType } from "@/types/role";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { AnimatePresence, motion } from "framer-motion";
import PortalWrapper from "./PortalWrapper";
import { Dialog } from "./ui";
import { useSearchParams } from "next/navigation";
import useScreen from "@/hooks/useScreen";

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
    description: "",
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
    is_archived: false,
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
            team_role: TeamRoleType.TEAM_ADMIN,
            email: profile.email,
            joined_at: new Date().toISOString(),
            settings: {
              projects: [],
              pages: [],
              channels: [],
            },
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
            entity: {
              type: EntityType.TEAM,
              id: createdTeamData.id,
              name: createdTeamData.name,
            },
            metadata: {},
          });
        }
      }

      onClose();
    }
  };

  const searchParams = useSearchParams();
  const settings = searchParams.get("settings");

  const { screenWidth } = useScreen();

  return (
    <PortalWrapper>
      <Dialog
        onClose={onClose}
        size="xs"
        lessOverlay={settings == "teamspaces"}
        fullMode
      >
        <div className="space-y-6 md:p-6 relative">
          <div>
            <div className="flex gap-3 items-center text-text-700 px-4 py-2 md:px-0 md:py-0 border-b md:border-none border-text-100">
              {screenWidth <= 768 && (
                <>
                  <button onClick={onClose} className="w-6 h-6">
                    <ChevronLeft strokeWidth={1.5} size={24} />
                  </button>

                  <h1 className="font-semibold md:text-lg">New teamspace</h1>
                </>
              )}
              {screenWidth > 768 && (
                <h1 className="font-semibold md:text-lg">
                  {step === 1
                    ? "Create a new teamspace"
                    : step == 2
                    ? "Tell us about your team"
                    : "Invite your teammates"}
                </h1>
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 md:space-y-8 md:px-2 sm:p-0"
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
                {screenWidth > 768 ? (
                  <p className="text-text-500 text-[13px]">
                    Keep it something simple your teammates will recognize.
                  </p>
                ) : (
                  <p className="text-xs text-text-500 p-2 rounded-lg border border-text-100 bg-background mx-4">
                    Keep it something simple your teammates will recognize.
                  </p>
                )}
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

            <div className="px-4 md:px-0">
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
            </div>
          </form>

          <div className="text-xs text-text-500 whitespace-normal px-4 md:px-0">
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
