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
  Permission,
  RoleType,
  TeamMemberType,
  TeamRole,
  TeamType,
} from "@/types/team";
import { useAuthProvider } from "@/context/AuthContext";
import CustomSelect from "./ui/CustomSelect";
import { supabaseBrowser } from "@/utils/supabase/client";
import Textarea from "./ui/textarea";

// Enums for predefined options
enum Industry {
  Technology = "technology",
  Healthcare = "healthcare",
  Finance = "finance",
  Education = "education",
  Retail = "retail",
  Manufacturing = "manufacturing",
  Other = "other",
}

enum WorkType {
  SoftwareDevelopment = "software_development",
  Marketing = "marketing",
  Sales = "sales",
  CustomerSupport = "customer_support",
  HumanResources = "human_resources",
  Other = "other",
}

enum WorkRole {
  Owner = "owner",
  TeamLead = "team_lead",
  TeamMember = "team_member",
}

enum OrganizationSize {
  One = "1",
  Small = "2-10",
  Medium = "11-50",
  Large = "51-100",
  VeryLarge = "101-250",
  Enterprise = "250+",
}

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

const getPermissionsByRole = (role: RoleType): Permission[] => {
  switch (role) {
    case RoleType.ADMIN:
      return [
        Permission.CREATE_TASK,
        Permission.EDIT_TASK,
        Permission.DELETE_TASK,
        Permission.ASSIGN_TASK,
        Permission.CREATE_PROJECT,
        Permission.EDIT_PROJECT,
        Permission.DELETE_PROJECT,
        Permission.INVITE_MEMBER,
        Permission.REMOVE_MEMBER,
        Permission.MANAGE_ROLES,
      ];
    case RoleType.MEMBER:
      return [
        Permission.CREATE_TASK,
        Permission.EDIT_TASK,
        Permission.DELETE_TASK,
        Permission.ASSIGN_TASK,
      ];
    default:
      return [];
  }
};

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
          // Create the team member (team creator)
          const adminRole: TeamRole = {
            name: RoleType.ADMIN,
            permissions: getPermissionsByRole(RoleType.ADMIN),
          };

          const teamMemberData: Omit<TeamMemberType, "id"> = {
            team_id: createdTeamData.id,
            profile_id: profile.id,
            team_role: adminRole,
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
        }
      }

      onClose();
    }
  };

  const industryOptions = Object.values(Industry).map((value) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1).replace("_", " "),
  }));

  const workTypeOptions = Object.values(WorkType).map((value) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1).replace("_", " "),
  }));

  const roleOptions = [
    { value: WorkRole.Owner, label: "I own or run the company" },
    { value: WorkRole.TeamLead, label: "I lead a team within the company" },
    { value: WorkRole.TeamMember, label: "I'm a team member" },
  ];

  const organizationSizeOptions = Object.values(OrganizationSize).map(
    (value) => ({
      value,
      label: value,
    })
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-text-200">
          <h2 className="text-xl font-semibold">
            {step === 1
              ? "Add a team"
              : step == 2
              ? "Tell us about your team"
              : "Invite your teammates"}
          </h2>
          <button
            onClick={onClose}
            className="text-text-500 hover:text-text-700 hover:bg-text-100 transition p-1 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
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
            <div className="space-y-4">
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
            </div>
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

          <div className="mt-6">
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

        <div className="px-6 pb-6 text-xs text-text-500">
          By creating a team, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default AddTeam;
