import { InviteType } from "@/types/team";
import Image from "next/image";
import React, { useState } from "react";
import RoleItem from "./RoleItem";
import { RoleType } from "@/types/role";

const PendingItem = ({ invite }: { invite: InviteType }) => {
  const [pendingData, setPendingData] = useState(invite);

  const handleUpdateRole = async (newRole: RoleType) => {
    try {
      // const { error } = await supabaseBrowser
      //   .from("personal_members")
      //   .update({ role: newRole })
      //   .eq("id", memberData.id);
      // if (error) {
      //   console.error("Failed to update project member role", error);
      //   return;
      // }

      setPendingData({ ...pendingData, role: newRole });

      // setIsOpen(false);
      // console.log("Project member role updated successfully");
    } catch (error) {
      console.error("Failed to update project member role", error);
    }
  };

  return (
    <div className="flex justify-between gap-4 items-center p-2 hover:bg-text-50 cursor-default rounded-lg transition">
      <div className="flex items-center gap-2">
        <div className="rounded-lg w-6 h-6 bg-text-200 flex items-center justify-center">
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
      />
    </div>
  );
};

export default PendingItem;
