import { PersonalMemberForProjectType } from "@/types/team";
import { ProfileType } from "@/types/user";
import Image from "next/image";
import React, { useState } from "react";
import RoleItem from "./RoleItem";
import { PersonalRoleType } from "@/types/role";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import ConfirmAlert from "@/components/AlertBox/ConfirmAlert";
import { useAuthProvider } from "@/context/AuthContext";

interface MemberData extends PersonalMemberForProjectType {
  profile: ProfileType;
}

interface MemberItemProps {
  member: MemberData;
  isCurrentUserAdmin: boolean;
}

const MemberItem = ({ member, isCurrentUserAdmin }: MemberItemProps) => {
  const { profile } = useAuthProvider();

  const [memberData, setMemberData] = useState(member);
  const queryClient = useQueryClient();
  const { personalMembers, setPersonalMembers, projects, pages } =
    useSidebarDataProvider();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleUpdateRole = async (newRole: PersonalRoleType) => {
    try {
      // Optimistic update
      queryClient.setQueryData(
        ["membersData", member.project_id, member.page_id],
        (oldData: MemberData[]) =>
          oldData.map((item) =>
            item.id == member.id ? { ...item, role: newRole } : item
          )
      );
      setPersonalMembers(
        personalMembers.map((item) =>
          item.id == member.id ? { ...item, role: newRole } : item
        )
      );

      const { error } = await supabaseBrowser
        .from("personal_members")
        .update({ role: newRole })
        .eq("id", member.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Failed to update project member role", error);

      // revert optimistic update
      queryClient.setQueryData(
        ["membersData", member.project_id, member.page_id],
        (oldData: MemberData[]) =>
          oldData.map((item) =>
            item.id == member.id ? { ...item, role: memberData.role } : item
          )
      );
      setPersonalMembers(
        personalMembers.map((item) =>
          item.id == member.id ? { ...item, role: memberData.role } : item
        )
      );
    }
  };

  const handleRemove = async () => {
    try {
      // Optimistic update
      queryClient.setQueryData(
        ["membersData", member.project_id, member.page_id],
        (oldData: MemberData[] = []) =>
          oldData.filter((item) => item.id != member.id)
      );
      setPersonalMembers(
        personalMembers.filter((item) => item.id != member.id)
      );

      const { error } = await supabaseBrowser
        .from("personal_members")
        .delete()
        .eq("id", member.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Failed to remove project member", error);

      // revert optimistic update
      queryClient.setQueryData(
        ["membersData", member.project_id, member.page_id],
        (oldData: MemberData[] = []) => [...oldData, member]
      );
      setPersonalMembers([...personalMembers, member]);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 w-full p-2 px-4 hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-200 cursor-default transition">
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
                  value={member.role}
                  onChange={(newRole) => handleUpdateRole(newRole as PersonalRoleType)}
                  handleRemove={() => setConfirmRemove(true)}
                />
              ) : (
                <span className="text-xs text-text-500">{member.role}</span>
              )}
            </div>
          </div>
          <span className="text-xs text-text-500">{member.profile.email}</span>
        </div>
      </div>

      {confirmLeave && member.profile_id === profile?.id && (
        <ConfirmAlert
          onCancel={() => setConfirmLeave(false)}
          onConfirm={handleRemove}
          title={member.project_id ? "Leave Project" : "Leave Page"}
          description={
            <>
              You will be removed from the{" "}
              <span className="font-semibold">
                {member.project_id
                  ? projects.find((project) => project.id === member.project_id)
                      ?.name
                  : pages.find((page) => page.id === member.page_id)?.title}
              </span>{" "}
              {member.project_id ? "project" : "page"}. You will need to ask for
              access to rejoin the {member.project_id ? "project" : "page"}.
            </>
          }
          submitBtnText="Leave"
        />
      )}

      {confirmRemove && isCurrentUserAdmin && (
        <ConfirmAlert
          onCancel={() => setConfirmRemove(false)}
          onConfirm={handleRemove}
          title={`Remove ${
            member.role == PersonalRoleType.ADMIN
              ? "Admin"
              : member.role == PersonalRoleType.MEMBER
              ? "Member"
              : member.role == PersonalRoleType.COMMENTER
              ? "Commenter"
              : member.role == PersonalRoleType.VIEWER && "Viewer"
          }?`}
          description={
            <>
              <span className="font-semibold">{member.profile.full_name}</span>{" "}
              will be removed from the{" "}
              <span className="font-semibold">
                {member.project_id
                  ? projects.find((project) => project.id === member.project_id)
                      ?.name
                  : pages.find((page) => page.id === member.page_id)?.title}
              </span>{" "}
              {member.project_id ? "project" : "page"}.
            </>
          }
          submitBtnText="Remove"
        />
      )}
    </>
  );
};

export default MemberItem;
