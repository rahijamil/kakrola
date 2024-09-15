import AddEditProject from "@/components/AddEditProject";
import Dropdown from "@/components/ui/Dropdown";
import { CheckCircle, File, Hash, Plus } from "lucide-react";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";

const ProjectPlusDropdown = ({
  forPersonal,
  setShowAddProjectModal,
  setTeamId,
  teamId,
}: {
  forPersonal?: boolean;
  setShowAddProjectModal?: Dispatch<SetStateAction<boolean>>;
  teamId?: number | null;
  setTeamId?: Dispatch<SetStateAction<number | null>>;
}) => {
  const triggerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dropdown
        mobileBottomSheet={false}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        triggerRef={triggerRef}
        Label={({ onClick }) => (
          <button
            ref={triggerRef}
            className={`p-1 rounded-lg transition ${
              isOpen ? "bg-primary-100" : "hover:bg-primary-100"
            }`}
            onClick={onClick}
          >
            <Plus
              strokeWidth={1.5}
              className={`w-[18px] h-[18px] transition-transform duration-150`}
            />
          </button>
        )}
        items={[
          {
            id: 1,
            label: "New Project",
            icon: <CheckCircle strokeWidth={1.5} size={20} />,
            onClick: () =>
              setShowAddProjectModal
                ? setShowAddProjectModal(true)
                : setTeamId && teamId
                ? setTeamId(teamId)
                : null,
            summary: "Plan tasks and collaborate.",
          },
          {
            id: 2,
            label: "New Page",
            icon: <File strokeWidth={1.5} size={20} />,
            onClick: () => {
              // onChange(RoleType.ADMIN);
            },
            summary: "Create and share docs.",
          },
          ...(forPersonal
            ? []
            : [
                {
                  id: 3,
                  label: "New Channel",
                  icon: <Hash strokeWidth={1.5} size={20} />,
                  onClick: () => {
                    // onChange(RoleType.ADMIN);
                  },
                  //   slack like channel
                  summary: "Set up team channels.",
                },
              ]),
        ]}
      />
    </>
  );
};

export default ProjectPlusDropdown;
