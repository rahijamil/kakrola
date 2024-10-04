import React, { Dispatch, SetStateAction} from "react";
import Dropdown from "@/components/ui/Dropdown";
import {
  Plus,
  CheckSquare,
  Columns,
  MessageSquarePlus,
  MessageSquareQuote,
  UserPlus,
} from "lucide-react";
import useScreen from "@/hooks/useScreen";

const SidebarCreateMore = ({
  quickActions: { isOpen },
  setQuickActions,
  triggerRef
}: {
  quickActions: {
    isOpen: boolean;
  };
  setQuickActions: Dispatch<
    SetStateAction<{
      showAddTaskModal: boolean;
      showAddSectionModal: boolean;
      showCreateDMModal: boolean;
      showCreateThreadModal: boolean;
      showCreateThreadReplyModal: boolean;
      isOpen: boolean;
    }>
  >;
  triggerRef: React.RefObject<HTMLButtonElement>;
}) => {
 const { screenWidth } = useScreen();

  return (
    <Dropdown
      title="Quick Access"
      isOpen={isOpen}
      setIsOpen={(value: boolean) =>
        setQuickActions((prev) => ({ ...prev, isOpen: value }))
      }
      triggerRef={triggerRef}
      Label={({ onClick }) =>
        screenWidth > 768 ? (
          <button
            onClick={onClick}
            className={`flex items-center justify-center w-7 h-7 text-primary-600 font-semibold rounded-lg transition-colors duration-150 z-10 ${isOpen ? "bg-primary-50" : "hover:bg-primary-100"}`}
          >
            <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-surface" strokeWidth={2} />
            </div>
          </button>
        ) : (
          <button
            onClick={onClick}
            // floating button best shadow
            className="bg-primary-10 text-primary-500 p-3 rounded-lg shadow-[2px_2px_16px_-4px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            aria-label="Add new task"
          >
            <Plus strokeWidth={2} className="w-6 h-6" aria-hidden="true" />
          </button>
        )
      }
      items={[
        {
          id: 1,
          label: "Create Task",
          icon: <CheckSquare strokeWidth={1.5} size={20} />,
          onClick: () =>
            setQuickActions((prev) => ({
              ...prev,
              showAddTaskModal: true,
            })),
          parentTitle: "Project",
        },
        {
          id: 2,
          label: "Create Section",
          icon: <Columns strokeWidth={1.5} size={20} />,
          onClick: () =>
            setQuickActions((prev) => ({
              ...prev,
              showAddSectionModal: true,
            })),
          divide: true,
        },
        {
          id: 3,
          label: "Create Thread",
          icon: <MessageSquarePlus strokeWidth={1.5} size={20} />,
          onClick: () =>
            setQuickActions((prev) => ({
              ...prev,
              showCreateThreadModal: true,
            })),
          parentTitle: "Channel",
        },
        {
          id: 4,
          label: "Create Thread Reply",
          icon: <MessageSquareQuote strokeWidth={1.5} size={20} />,
          onClick: () =>
            setQuickActions((prev) => ({
              ...prev,
              showCreateThreadReplyModal: true,
            })),
          divide: true,
        },
        {
          id: 5,
          label: "Start Direct Message",
          icon: <UserPlus strokeWidth={1.5} size={20} />,
          onClick: () =>
            setQuickActions((prev) => ({
              ...prev,
              showCreateDMModal: true,
            })),
          parentTitle: "DMs",
        },
      ]}
    />
  );
};

export default SidebarCreateMore;
