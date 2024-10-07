import { ProjectInviteType, PageInviteType } from "@/types/team";
import React, { useState } from "react";
import RoleItem from "./RoleItem";
import { RoleType } from "@/types/role";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmAlert from "@/components/AlertBox/ConfirmAlert";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";

const PendingItem = ({
  invite,
  isCurrentUserAdmin,
}: {
  invite: ProjectInviteType | PageInviteType;
  isCurrentUserAdmin: boolean;
}) => {
  const { projects, pages } = useSidebarDataProvider();
  const [pendingData, setPendingData] = useState(invite);
  const queryClient = useQueryClient();
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  const handleUpdateRole = async (newRole: RoleType) => {
    try {
      // Optimistic update
      queryClient.setQueryData(
        ["pendingUsers", invite.project_id, invite.page_id],
        (oldData: PageInviteType[] | ProjectInviteType[]) =>
          oldData.map((item) =>
            item.id == invite.id ? { ...item, role: newRole } : item
          )
      );
      const { error } = await supabaseBrowser
        .from("invites")
        .update({ role: newRole })
        .eq("id", invite.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Failed to update invite role", error);

      // revert optimistic update
      queryClient.setQueryData(
        ["pendingUsers", invite.project_id, invite.page_id],
        (oldData: PageInviteType[] | ProjectInviteType[]) =>
          oldData.map((item) =>
            item.id == invite.id ? { ...item, role: pendingData.role } : item
          )
      );
    }
  };

  const handleRemove = async () => {
    try {
      // Optimistic update
      queryClient.setQueryData(
        ["pendingUsers", invite.project_id, invite.page_id],
        (oldData: PageInviteType[] | ProjectInviteType[]) =>
          oldData.filter((item) => item.id != invite.id)
      );

      const { error } = await supabaseBrowser
        .from("invites")
        .delete()
        .eq("id", invite.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Failed to remove invite", error);

      // revert optimistic update
      queryClient.setQueryData(
        ["pendingUsers", invite.project_id, invite.page_id],
        (oldData: PageInviteType[] | ProjectInviteType[]) => [
          ...oldData,
          invite,
        ]
      );
    }
  };

  return (
    <>
      <div className="flex justify-between gap-4 items-center p-2 px-4 hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-200 cursor-default transition">
        <div className="flex items-center gap-2">
          <div className="rounded-lg w-6 h-6 bg-text-100 flex items-center justify-center">
            {invite.email?.slice(0, 1).toUpperCase()}
          </div>

          <div className="flex flex-col whitespace-nowrap">
            <span>{invite.email}</span>
            <span className="text-xs text-text-500">{invite.status}</span>
          </div>
        </div>

        <RoleItem
          value={invite.role}
          onChange={(newRole) => handleUpdateRole(newRole)}
          handleRemove={handleRemove}
        />
      </div>

      {confirmRevoke && isCurrentUserAdmin && (
        <ConfirmAlert
          onCancel={() => setConfirmRevoke(false)}
          onConfirm={handleRemove}
          title={`Revoke ${invite.project_id ? "project" : "page"} invite?`}
          description={
            <>
              The{" "}
              <span className="font-semibold">
                {invite.project_id
                  ? projects.find((project) => project.id === invite.project_id)
                      ?.name
                  : pages.find((page) => page.id === invite.page_id)?.title}
              </span>{" "}
              {invite.project_id ? "project" : "page"} invite for {invite.email?.split("@")[0]}{" "}
              will be revoked.
            </>
          }
          submitBtnText="Revoke"
        />
      )}
    </>
  );
};

export default PendingItem;
