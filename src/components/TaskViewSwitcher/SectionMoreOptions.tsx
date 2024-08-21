import React, {
  Dispatch,
  LegacyRef,
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from "react";
import Dropdown from "../ui/Dropdown";
import { Archive, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { TaskType } from "@/types/project";

const SectionMoreOptions = ({
  setEditColumnTitle,
  column,
  setShowArchiveConfirm,
  setShowDeleteConfirm,
}: {
  setEditColumnTitle: Dispatch<SetStateAction<boolean>>;
  column: {
    id: string;
    title: string;
    tasks: TaskType[];
    is_archived?: boolean;
  };
  setShowArchiveConfirm: Dispatch<
    SetStateAction<{
      id: string;
      title: string;
      tasks: TaskType[];
      is_archived?: boolean;
    } | null>
  >;
  setShowDeleteConfirm: Dispatch<
    SetStateAction<{
      id: string;
      title: string;
    } | null>
  >;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const triggerRef = useRef(null);

  return (
    <Dropdown
      triggerRef={triggerRef}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      Label={({ onClick }) => (
        <button
          ref={triggerRef}
          className={`p-1 transition rounded-lg ${
            isOpen ? "bg-gray-200" : "hover:bg-gray-200"
          }`}
          onClick={onClick}
        >
          <Ellipsis strokeWidth={1.5} className="w-5 h-5 text-gray-700" />
        </button>
      )}
      items={[
        {
          id: 1,
          label: "Edit",
          onClick: () => {
            setEditColumnTitle(true);
            onClose();
          },
          icon: <Pencil strokeWidth={1.5} size={16} />,
        },
        {
          id: 2,
          label: column?.is_archived ? "Unarchive" : "Archive",
          onClick: () => {
            setShowArchiveConfirm(column);
            onClose();
          },
          icon: <Archive strokeWidth={1.5} size={16} />,
          devide: true,
        },
        {
          id: 3,
          label: "Delete",
          onClick: () => {
            setShowDeleteConfirm(column);
            onClose();
          },
          icon: <Trash2 strokeWidth={1.5} size={16} />,
          className: "text-red-600",
        },
      ]}
    />
  );
};

export default SectionMoreOptions;
