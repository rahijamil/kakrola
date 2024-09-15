import { ProjectMemberType } from "@/types/team";
import { ProfileType } from "@/types/user";
import Image from "next/image";
import React, { useRef, useState } from "react";
import RoleItem from "./RoleItem";
import { RoleType } from "@/types/role";

interface MemberData extends ProjectMemberType {
  profile: ProfileType;
}

const MemberItem = ({ member }: { member: MemberData }) => {
  const [memberData, setMemberData] = useState(member);

  const handleUpdateRole = async (newRole: RoleType) => {
    try {
      // const { error } = await supabaseBrowser
      //   .from("project_members")
      //   .update({ role: newRole })
      //   .eq("id", memberData.id);
      // if (error) {
      //   console.error("Failed to update project member role", error);
      //   return;
      // }

      setMemberData({ ...memberData, role: newRole });

      // setIsOpen(false);
      // console.log("Project member role updated successfully");
    } catch (error) {
      console.error("Failed to update project member role", error);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full p-2 hover:bg-text-50 cursor-default rounded-lg transition">
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
            <RoleItem
              value={memberData.role}
              onChange={(newRole) => handleUpdateRole(newRole)}
            />
          </div>
        </div>
        <span className="text-xs text-text-500">{member.profile.email}</span>
      </div>
    </div>
  );
};

export default MemberItem;
