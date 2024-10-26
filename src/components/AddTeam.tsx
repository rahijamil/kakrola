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
import { Textarea } from "./ui/textarea";
import Link from "next/link";
import { TeamRoleType } from "@/types/role";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import PortalWrapper from "./PortalWrapper";
import { Dialog, DialogContent } from "./ui/dialog";
import { useSearchParams } from "next/navigation";
import useScreen from "@/hooks/useScreen";
import { createTeam } from "@/services/addteam.service";
import { useQueryClient } from "@tanstack/react-query";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { v4 as uuidv4 } from "uuid";

// Updated TeamData type
interface TeamData extends TeamType {
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
  const { teams, setTeams } = useSidebarDataProvider();
  const [teamData, setTeamData] = useState<
    Omit<TeamType, "id" | "workspace_id" | "created_at">
  >({
    name: "",
    description: "",
    // industry: null,
    // work_type: null,
    // work_role: {
    //   value: WorkRole.Owner,
    //   label: "I own or run the company",
    // },
    // organization_size: null,
    avatar_url: "",
    profile_id: profile?.id || "",
    updated_at: new Date().toISOString(),
    is_archived: false,
  });
  const [step, setStep] = useState<1 | 2>(1);
  const queryClient = useQueryClient();

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
    if (!profile) return;
    const tempId = uuidv4();

    try {
      if (step === 1) {
        setStep(2);
      } else if (
        teamData.name &&
        teamData.profile_id &&
        profile.metadata?.current_workspace_id
        // teamData.industry &&
        // teamData.work_type &&
        // teamData.work_role &&
        // teamData.organization_size
      ) {
        // Prepare data for Supabase insertion
        const supabaseData: Omit<TeamType, "id" | "created_at"> = {
          ...teamData,
          workspace_id: profile.metadata.current_workspace_id,
          // industry: teamData.industry.value,
          // work_type: teamData.work_type.value,
          // work_role: teamData.work_role.value,
          // organization_size: teamData.organization_size.value,
        };

        // optimistic update
        const allTeams = [
          ...teams,
          {
            ...supabaseData,
            id: tempId,
          },
        ];
        setTeams(allTeams);

        const insertedTeam = await createTeam({
          teamData: supabaseData,
          profile,
        });

        // update original id
        setTeams(
          allTeams.map((team) =>
            team.id == tempId ? { ...team, id: insertedTeam.id } : team
          )
        );

        onClose();
      }
    } catch (error) {
      console.error(error);
      // revert optimistic update
      setTeams(teams.filter((team) => team.id != tempId));
    }
  };

  const searchParams = useSearchParams();
  const settings = searchParams.get("settings");

  const { screenWidth } = useScreen();

  return (
    <PortalWrapper>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="p-0">
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
              ) : (
                //  : step == 2 ? (
                //   <>
                //     <CustomSelect
                //       id="industry"
                //       label="What industry do you work in?"
                //       Icon={Briefcase}
                //       value={teamData.industry?.value}
                //       onChange={(data) => handleInputChange(data)}
                //       options={industryOptions}
                //       placeholder="Select your answer"
                //     />
                //     <CustomSelect
                //       id="work_type"
                //       label="What work do you do?"
                //       Icon={Building}
                //       value={teamData.work_type?.value}
                //       onChange={(data) => handleInputChange(data)}
                //       options={workTypeOptions}
                //       placeholder="Select your answer"
                //     />
                //     <CustomSelect
                //       id="work_role"
                //       label="What's your role?"
                //       Icon={UserCircle}
                //       value={teamData.work_role?.value}
                //       onChange={(data) => handleInputChange(data)}
                //       options={roleOptions}
                //       placeholder="Select your answer"
                //     />
                //     <CustomSelect
                //       id="organization_size"
                //       label="How big is your organization"
                //       Icon={Users}
                //       value={teamData.organization_size?.value}
                //       onChange={(data) => handleInputChange(data)}
                //       options={organizationSizeOptions}
                //       placeholder="Select your answer"
                //     />
                //   </>
                // )

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
                      : // : step == 2
                        // ? !teamData.industry ||
                        //   !teamData.work_type ||
                        //   !teamData.work_role ||
                        //   !teamData.organization_size
                        //   ? true
                        //   : false
                        false
                  }
                >
                  {step === 1 ? "Get started" : "Create team"}
                  {step !== 2 && <ChevronRight size={16} className="ml-2" />}
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
        </DialogContent>
      </Dialog>
    </PortalWrapper>
  );
};

export default AddTeam;
