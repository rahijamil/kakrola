import AnimatedTaskCheckbox from "@/components/TaskViewSwitcher/AnimatedCircleCheck";
import Dropdown from "@/components/ui/Dropdown";
import React, { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  PersonalRoleType,
  TeamRoleType,
  WorkspaceRoleType,
} from "@/types/role";
import { TaskPriority } from "@/types/project";
import { TeamType } from "@/types/team";
import { WorkspaceType } from "@/types/workspace";

const RoleItem = ({
  onChange,
  value,
  handleRemove,
  handleRevoke,
  teamId,
  workspaceId,
}: {
  value: PersonalRoleType | TeamRoleType | WorkspaceRoleType;
  onChange: (
    newRole: PersonalRoleType | TeamRoleType | WorkspaceRoleType
  ) => void;
  handleRemove?: () => void;
  handleRevoke?: () => void;
  teamId?: TeamType["id"] | null;
  workspaceId?: WorkspaceType["id"] | null;
}) => {
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dropdown
      title="Role"
      triggerRef={triggerRef}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      Label={({ onClick }) => (
        <button
          ref={triggerRef}
          onClick={onClick}
          className={`text-xs text-text-500 transition pl-2 p-1 rounded-lg flex items-center gap-1 whitespace-nowrap ${
            isOpen
              ? handleRemove || handleRevoke
                ? "bg-primary-100"
                : "bg-text-100"
              : handleRemove || handleRevoke
              ? "hover:bg-primary-100"
              : "hover:bg-text-100"
          }`}
        >
          {value == WorkspaceRoleType.WORKSPACE_ADMIN
            ? "Workspace Admin"
            : value == WorkspaceRoleType.WORKSPACE_MEMBER
            ? "Member"
            : value == TeamRoleType.TEAM_ADMIN
            ? "Teamspace Admin"
            : value == TeamRoleType.TEAM_MEMBER
            ? "Teamspace Member"
            : value === PersonalRoleType.ADMIN
            ? "Project Admin"
            : value === PersonalRoleType.MEMBER
            ? "Member"
            : value === PersonalRoleType.COMMENTER
            ? "Commenter"
            : "Viewer"}

          <ChevronDown strokeWidth={1.5} size={16} />
        </button>
      )}
      items={
        workspaceId
          ? [
              {
                id: 1,
                label: "Workspace Admin",
                onClick: () => {
                  onChange(WorkspaceRoleType.WORKSPACE_ADMIN);
                },
                summary:
                  "Full access to change settings, modify, or delete the project.",
                divide: true,
                rightContent: value == WorkspaceRoleType.WORKSPACE_ADMIN && (
                  <AnimatedTaskCheckbox
                    priority={TaskPriority.P3}
                    playSound={false}
                    handleCheckSubmit={() =>
                      onChange(WorkspaceRoleType.WORKSPACE_ADMIN)
                    }
                    is_completed={value === WorkspaceRoleType.WORKSPACE_ADMIN}
                  />
                ),
              },
              {
                id: 2,
                label: "Member",
                onClick: () => {
                  onChange(WorkspaceRoleType.WORKSPACE_MEMBER);
                },
                summary: "Can add, edit and delete anything in the project.",
                rightContent: value == WorkspaceRoleType.WORKSPACE_MEMBER && (
                  <AnimatedTaskCheckbox
                    priority={TaskPriority.P3}
                    playSound={false}
                    handleCheckSubmit={() =>
                      onChange(WorkspaceRoleType.WORKSPACE_MEMBER)
                    }
                    is_completed={value === WorkspaceRoleType.WORKSPACE_MEMBER}
                  />
                ),
              },
            ]
          : teamId
          ? [
              {
                id: 1,
                label: "Teamspace Admin",
                onClick: () => {
                  onChange(TeamRoleType.TEAM_ADMIN);
                },
                summary:
                  "Full access to change settings, modify, or delete the project.",
                divide: true,
                rightContent: value == TeamRoleType.TEAM_ADMIN && (
                  <AnimatedTaskCheckbox
                    priority={TaskPriority.P3}
                    playSound={false}
                    handleCheckSubmit={() => onChange(TeamRoleType.TEAM_ADMIN)}
                    is_completed={value === TeamRoleType.TEAM_ADMIN}
                  />
                ),
              },
              {
                id: 2,
                label: "Teamspace Member",
                onClick: () => {
                  onChange(TeamRoleType.TEAM_MEMBER);
                },
                summary: "Can add, edit and delete anything in the project.",
                rightContent: value == TeamRoleType.TEAM_MEMBER && (
                  <AnimatedTaskCheckbox
                    priority={TaskPriority.P3}
                    playSound={false}
                    handleCheckSubmit={() => onChange(TeamRoleType.TEAM_MEMBER)}
                    is_completed={value === TeamRoleType.TEAM_MEMBER}
                  />
                ),
                divide: true,
              },
              ...(handleRemove
                ? [
                    {
                      id: 5,
                      label: "Remove from project",
                      textColor: "text-red-500",
                      onClick: handleRemove,
                    },
                  ]
                : handleRevoke
                ? [
                    {
                      id: 5,
                      label: "Revoke from project",
                      textColor: "text-red-500",
                      onClick: handleRevoke,
                    },
                  ]
                : []),
            ]
          : [
              {
                id: 1,
                label: "Project Admin",
                onClick: () => {
                  onChange(PersonalRoleType.ADMIN);
                },
                summary:
                  "Full access to change settings, modify, or delete the project.",
                divide: true,
                rightContent: value == PersonalRoleType.ADMIN && (
                  <AnimatedTaskCheckbox
                    priority={TaskPriority.P3}
                    playSound={false}
                    handleCheckSubmit={() => onChange(PersonalRoleType.ADMIN)}
                    is_completed={value === PersonalRoleType.ADMIN}
                  />
                ),
              },
              {
                id: 2,
                label: "Member",
                onClick: () => {
                  onChange(PersonalRoleType.MEMBER);
                },
                summary: "Can add, edit and delete anything in the project.",
                rightContent: value == PersonalRoleType.MEMBER && (
                  <AnimatedTaskCheckbox
                    priority={TaskPriority.P3}
                    playSound={false}
                    handleCheckSubmit={() => onChange(PersonalRoleType.MEMBER)}
                    is_completed={value === PersonalRoleType.MEMBER}
                    disabled
                  />
                ),
                divide: true,
                disabled: true,
                badge: "Plus",
              },
              {
                id: 3,
                label: "Commenter",
                onClick: () => {
                  onChange(PersonalRoleType.COMMENTER);
                },
                summary: "Can comment, but can't edit anything in the project.",
                rightContent: value == PersonalRoleType.COMMENTER && (
                  <AnimatedTaskCheckbox
                    priority={TaskPriority.P3}
                    playSound={false}
                    handleCheckSubmit={() =>
                      onChange(PersonalRoleType.COMMENTER)
                    }
                    is_completed={value === PersonalRoleType.COMMENTER}
                  />
                ),
                divide: true,
              },
              {
                id: 4,
                label: "Viewer",
                onClick: () => {
                  onChange(PersonalRoleType.VIEWER);
                },
                summary:
                  "Can view, but can't add comments or edit the project.",
                rightContent: value == PersonalRoleType.VIEWER && (
                  <AnimatedTaskCheckbox
                    priority={TaskPriority.P3}
                    playSound={false}
                    handleCheckSubmit={() => onChange(PersonalRoleType.VIEWER)}
                    is_completed={value === PersonalRoleType.VIEWER}
                  />
                ),
                divide: handleRemove || handleRevoke ? true : false,
              },
              ...(handleRemove
                ? [
                    {
                      id: 5,
                      label: "Remove from project",
                      textColor: "text-red-500",
                      onClick: handleRemove,
                    },
                  ]
                : handleRevoke
                ? [
                    {
                      id: 5,
                      label: "Revoke from project",
                      textColor: "text-red-500",
                      onClick: handleRevoke,
                    },
                  ]
                : []),
            ]
      }
      contentWidthClass="w-72 py-1"
    />
  );
};

export default RoleItem;
