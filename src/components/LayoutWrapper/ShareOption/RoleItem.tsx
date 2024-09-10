import AnimatedTaskCheckbox from "@/components/TaskViewSwitcher/AnimatedCircleCheck";
import Dropdown from "@/components/ui/Dropdown";
import { ProjectMemberType } from "@/types/team";
import { ProfileType } from "@/types/user";
import React, { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { RoleType } from "@/types/role";
import { TaskPriority } from "@/types/project";

interface MemberData extends ProjectMemberType {
  profile: ProfileType;
}

const RoleItem = ({
  onChange,
  value,
}: {
  value: RoleType;
  onChange: (newRole: RoleType) => void;
}) => {
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dropdown
      triggerRef={triggerRef}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      Label={({ onClick }) => (
        <button
          ref={triggerRef}
          onClick={onClick}
          className={`text-xs text-text-500 transition pl-2 p-1 rounded-lg flex items-center gap-1 whitespace-nowrap ${
            isOpen ? "bg-text-200" : "hover:bg-text-200"
          }`}
        >
          {value === RoleType.ADMIN
            ? "Project Admin"
            : value === RoleType.MEMBER
            ? "Member"
            : value === RoleType.COMMENTER
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
            onChange(RoleType.ADMIN);
          },
          summary:
            "Full access to change settings, modify, or delete the project.",
          divide: true,
          rightContent: (
            <AnimatedTaskCheckbox
              priority={TaskPriority.P3}
              playSound={false}
              handleCheckSubmit={() => onChange(RoleType.ADMIN)}
              is_completed={value === RoleType.ADMIN}
            />
          ),
        },
        {
          id: 2,
          label: "Member",
          onClick: () => {
            onChange(RoleType.MEMBER);
          },
          summary: "Can add, edit and delete anything in the project.",
          rightContent: (
            <AnimatedTaskCheckbox
              priority={TaskPriority.P3}
              playSound={false}
              handleCheckSubmit={() => onChange(RoleType.MEMBER)}
              is_completed={value === RoleType.MEMBER}
            />
          ),
          divide: true,
        },
        {
          id: 3,
          label: "Commenter",
          onClick: () => {
            onChange(RoleType.COMMENTER);
          },
          summary: "Can comment, but can't edit anything in the project.",
          rightContent: (
            <AnimatedTaskCheckbox
              priority={TaskPriority.P3}
              playSound={false}
              handleCheckSubmit={() => onChange(RoleType.COMMENTER)}
              is_completed={value === RoleType.COMMENTER}
            />
          ),
          divide: true,
        },
        {
          id: 4,
          label: "Viewer",
          onClick: () => {
            onChange(RoleType.VIEWER);
          },
          summary: "Can view, but can't add comments or edit the project.",
          rightContent: (
            <AnimatedTaskCheckbox
              priority={TaskPriority.P3}
              playSound={false}
              handleCheckSubmit={() => onChange(RoleType.VIEWER)}
              is_completed={value === RoleType.VIEWER}
            />
          ),
        },
      ]}
      contentWidthClass="w-72 py-1"
    />
  );
};

export default RoleItem;
