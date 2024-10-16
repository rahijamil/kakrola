import { PersonalMemberForProjectType, TeamMemberType } from "@/types/team";
import { ProfileType } from "@/types/user";
import Image from "next/image";
import React, { useState } from "react";
import RoleItem from "./RoleItem";
import { PersonalRoleType, TeamRoleType } from "@/types/role";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import ConfirmAlert from "@/components/AlertBox/ConfirmAlert";
import { useAuthProvider } from "@/context/AuthContext";
import TeamMemberRemove from "./TeamMemberRemove";

interface MemberData extends TeamMemberType {
  profile: ProfileType;
}

interface MemberItemProps {
  member: MemberData;
  isCurrentUserAdmin: boolean;
  forTeamspaceSettings?: boolean;
}

const TeamMemberItem = ({
  member,
  isCurrentUserAdmin,
  forTeamspaceSettings,
}: MemberItemProps) => {
  const { profile } = useAuthProvider();

  const [memberData, setMemberData] = useState(member);
  const queryClient = useQueryClient();
  const { teams, teamMembers, setTeamMembers } = useSidebarDataProvider();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleUpdateRole = async (newRole: TeamRoleType) => {
    try {
      // Optimistic update
      queryClient.setQueryData(
        ["teamMembersData", member.team_id],
        (oldData: MemberData[]) =>
          oldData.map((item) =>
            item.id == member.id ? { ...item, team_role: newRole } : item
          )
      );
      setTeamMembers(
        teamMembers.map((item) =>
          item.id == member.id ? { ...item, team_role: newRole } : item
        )
      );

      const { error } = await supabaseBrowser
        .from("team_members")
        .update({ team_role: newRole })
        .eq("id", member.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Failed to update project member role", error);

      // revert optimistic update
      queryClient.setQueryData(
        ["teamMembersData", member.team_id],
        (oldData: MemberData[]) =>
          oldData.map((item) =>
            item.id == member.id
              ? { ...item, team_role: memberData.team_role }
              : item
          )
      );
      setTeamMembers(
        teamMembers.map((item) =>
          item.id == member.id
            ? { ...item, team_role: memberData.team_role }
            : item
        )
      );
    }
  };

  const handleRemove = async () => {
    try {
      // Optimistic update
      queryClient.setQueryData(
        ["teamMembersData", member.team_id],
        (oldData: MemberData[] = []) =>
          oldData.filter((item) => item.id != member.id)
      );
      setTeamMembers(teamMembers.filter((item) => item.id != member.id));

      const { error } = await supabaseBrowser
        .from("team_members")
        .delete()
        .eq("id", member.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Failed to remove project member", error);

      // revert optimistic update
      queryClient.setQueryData(
        ["teamMembersData", member.team_id],
        (oldData: MemberData[] = []) => [...oldData, member]
      );
      setTeamMembers([...teamMembers, member]);
    }
  };

  return (
    <>
      <div
        className={`flex items-center gap-2 w-full hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-200 cursor-default transition p-2 ${
          forTeamspaceSettings ? "px-6" : "px-4"
        }`}
      >
        <Image
          src={member.profile.avatar_url || "/default_avatar.png"}
          alt="Avatar"
          width={24}
          height={24}
          className="rounded-md object-cover max-w-6 max-h-6"
        />

        <div className="flex flex-col w-full">
          <div className="flex items-center gap-2 md:gap-4 justify-between w-full">
            <span>{member.profile.full_name || "Unknown User"}</span>

            <div className="whitespace-normal">
              {member.profile_id === profile?.id ? (
                <button
                  onClick={() => setConfirmLeave(true)}
                  className="text-xs text-text-500 hover:bg-primary-100 font-medium transition rounded-lg px-2 py-1"
                >
                  Leave
                </button>
              ) : isCurrentUserAdmin ? (
                <RoleItem
                  value={member.team_role}
                  onChange={(newRole) =>
                    handleUpdateRole(newRole as TeamRoleType)
                  }
                  handleRemove={() => setConfirmRemove(true)}
                />
              ) : (
                <span className="text-xs text-text-500">
                  {member.team_role}
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-text-500">{member.profile.email}</span>
        </div>
      </div>

      <TeamMemberRemove
        confirmLeave={confirmLeave}
        setConfirmLeave={setConfirmLeave}
        member={member}
      />

      {confirmRemove && isCurrentUserAdmin && (
        <ConfirmAlert
          onCancel={() => setConfirmRemove(false)}
          onConfirm={handleRemove}
          title={`Remove ${
            member.team_role == TeamRoleType.TEAM_ADMIN
              ? "Admin"
              : member.team_role == TeamRoleType.TEAM_MEMBER
              ? "Member"
              : member.team_role
          }?`}
          description={
            <>
              <span className="font-semibold">{member.profile.full_name}</span>{" "}
              will be removed from the{" "}
              <span className="font-semibold">
                {teams.find((team) => team.id === member.team_id)?.name}
              </span>{" "}
              team.
            </>
          }
          submitBtnText="Remove"
        />
      )}
    </>
  );
};

export default TeamMemberItem;
