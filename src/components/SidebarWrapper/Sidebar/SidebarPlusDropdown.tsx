import useAddPage from "@/app/app/page/[page_slug]/useAddPage";
import AddEditChannel from "@/components/AddEditChannel";
import AddEditProject from "@/components/AddEditProject";
import Dropdown from "@/components/ui/Dropdown";
import { TeamType } from "@/types/team";
import { AnimatePresence } from "framer-motion";
import { CheckCircle, FileText, Hash, Plus, UserPlus } from "lucide-react";
import React, { Dispatch, SetStateAction, useRef } from "react";

const SidebarPlusDropdown = ({
  teamId,
  modalStates: {
    setShowAddProjectModal,
    showAddProjectModal,
    setShowAddChannel,
    showAddChannel,
  },
  isOpen,
  setIsOpen,
}: {
  teamId?: TeamType["id"];
  modalStates: {
    showAddProjectModal: boolean;
    setShowAddProjectModal: Dispatch<SetStateAction<boolean>>;
    showAddChannel?: boolean;
    setShowAddChannel?: Dispatch<SetStateAction<boolean>>;
  };
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const triggerRef = useRef(null);
  const { handleCreatePage } = useAddPage({ teamId });

  return (
    <>
      <Dropdown
        title="Create"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        triggerRef={triggerRef}
        Label={({ onClick }) => (
          <button
            ref={triggerRef}
            className={`p-1 rounded-lg transition md:hover:bg-primary-100 ${
              isOpen ? "md:bg-primary-50" : ""
            }`}
            onClick={onClick}
          >
            <Plus
              strokeWidth={1.5}
              className={`w-5 md:w-[18px] h-5 md:h-[18px] transition-transform duration-150`}
            />
          </button>
        )}
        items={[
          {
            id: 1,
            label: "New Project",
            icon: <CheckCircle strokeWidth={1.5} size={20} />,
            onClick: () => {
              setShowAddProjectModal(true);
            },
            summary: "Plan tasks and collaborate.",
          },
          {
            id: 2,
            label: "New Page",
            icon: <FileText strokeWidth={1.5} size={20} />,
            onClick: () =>
              handleCreatePage({
                aboveBellow: null,
              }),
            summary: "Create and share docs.",
          },
          ...(!teamId
            ? []
            : setShowAddChannel
            ? [
                {
                  id: 3,
                  label: "New Channel",
                  icon: <Hash strokeWidth={1.5} size={20} />,
                  onClick: () => {
                    setShowAddChannel(true);
                  },
                  summary: "Set up team channels.",
                },
              ]
            : []),
        ]}
      />

      <AnimatePresence>
        {showAddProjectModal && !teamId && (
          <AddEditProject onClose={() => setShowAddProjectModal(false)} />
        )}

        {teamId && showAddProjectModal && (
          <AddEditProject
            team_id={teamId}
            onClose={() => {
              setShowAddProjectModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {teamId && showAddChannel && setShowAddChannel && (
        <AddEditChannel
          teamId={teamId}
          onClose={() => {
            setShowAddChannel(false);
          }}
        />
      )}
    </>
  );
};

export default SidebarPlusDropdown;
