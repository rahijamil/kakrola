import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import ConfirmAlert from "@/components/AlertBox/ConfirmAlert";
import React, { useState } from "react";
import { useAuthProvider } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ProfileType } from "@/types/user";
import { TeamMemberType } from "@/types/team";

interface MemberData extends TeamMemberType {
  profile: ProfileType;
}

const TeamMemberRemove = ({
  confirmLeave,
  setConfirmLeave,
  member
}: {
  confirmLeave: boolean;
  setConfirmLeave: React.Dispatch<React.SetStateAction<boolean>>;
  member: MemberData;
}) => {
  const { profile } = useAuthProvider();

  const queryClient = useQueryClient();
  const { teams, teamMembers, setTeamMembers } = useSidebarDataProvider();

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
      {confirmLeave && member.profile_id === profile?.id && (
        <ConfirmAlert
          onCancel={() => setConfirmLeave(false)}
          onConfirm={handleRemove}
          title={"Leave Team"}
          description={
            <>
              You will be removed from the{" "}
              <span className="font-semibold">
                {teams.find((team) => team.id === member.team_id)?.name}
              </span>{" "}
              team. You will need to ask for access to rejoin the team.
            </>
          }
          submitBtnText="Leave"
        />
      )}
    </>
  );
};

export default TeamMemberRemove;
