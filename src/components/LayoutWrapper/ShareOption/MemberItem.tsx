import AnimatedTaskCheckbox from "@/components/TaskViewSwitcher/AnimatedCircleCheck";
import Dropdown from "@/components/ui/Dropdown";
import { ProjectMemberType, RoleType } from "@/types/team";
import { ProfileType } from "@/types/user";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface MemberData extends ProjectMemberType {
  profile: ProfileType;
}

const MemberItem = ({ member }: { member: MemberData }) => {
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
    <div className="flex justify-between gap-4 items-center p-2 hover:bg-text-50 cursor-default rounded-2xl transition">
      <div className="flex items-center gap-2">
        <Image
          src={member.profile.avatar_url || "/default_avatar.png"}
          alt="Avatar"
          width={24}
          height={24}
          className="rounded-full object-cover max-w-6 max-h-6"
        />

        <div className="flex flex-col whitespace-nowrap">
          <span>{member.profile.full_name || "Unknown User"}</span>
          <span className="text-xs text-text-500">{member.profile.email}</span>
        </div>
      </div>

      <Dropdown
        triggerRef={triggerRef}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        Label={({ onClick }) => (
          <button
            ref={triggerRef}
            onClick={onClick}
            className={`text-xs text-text-500 transition px-2 py-1 rounded-2xl flex items-center gap-2 whitespace-nowrap ${
              isOpen ? "bg-text-200" : "hover:bg-text-200"
            }`}
          >
            {memberData.role === RoleType.ADMIN
              ? "Project Admin"
              : memberData.role === RoleType.MEMBER
              ? "Member"
              : memberData.role === RoleType.COMMENTER
              ? "Commenter"
              : "Viewer"}

            <ChevronDown strokeWidth={1.5} size={16} />
          </button>
        )}
        items={[
          {
            id: 1,
            label: "Project Admin",
            onClick: () => {
              handleUpdateRole(RoleType.ADMIN);
            },
            summary:
              "Full access to change settings, modify, or delete the project.",
            divide: true,
            rightContent: (
              <AnimatedTaskCheckbox
                priority={"P3"}
                playSound={false}
                handleCheckSubmit={() => handleUpdateRole(RoleType.ADMIN)}
                is_completed={memberData.role === RoleType.ADMIN}
              />
            ),
          },
          {
            id: 2,
            label: "Member",
            onClick: () => {
              handleUpdateRole(RoleType.MEMBER);
            },
            summary: "Can add, edit and delete anything in the project.",
            rightContent: (
              <AnimatedTaskCheckbox
                priority={"P3"}
                playSound={false}
                handleCheckSubmit={() => handleUpdateRole(RoleType.MEMBER)}
                is_completed={memberData.role === RoleType.MEMBER}
              />
            ),
            divide: true,
          },
          {
            id: 3,
            label: "Commenter",
            onClick: () => {
              handleUpdateRole(RoleType.COMMENTER);
            },
            summary: "Can comment, but can't edit anything in the project.",
            rightContent: (
              <AnimatedTaskCheckbox
                priority={"P3"}
                playSound={false}
                handleCheckSubmit={() => handleUpdateRole(RoleType.COMMENTER)}
                is_completed={memberData.role === RoleType.COMMENTER}
              />
            ),
            divide: true,
          },
          {
            id: 4,
            label: "Viewer",
            onClick: () => {
              handleUpdateRole(RoleType.VIEWER);
            },
            summary: "Can view, but can't add comments or edit the project.",
            rightContent: (
              <AnimatedTaskCheckbox
                priority={"P3"}
                playSound={false}
                handleCheckSubmit={() => handleUpdateRole(RoleType.VIEWER)}
                is_completed={memberData.role === RoleType.VIEWER}
              />
            ),
          },
        ]}
        contentWidthClass="w-72 py-1"
      />
    </div>
  );
};

export default MemberItem;
