import React, {
  Dispatch,
  LegacyRef,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Dropdown from "../ui/Dropdown";
import { Archive, Ellipsis, Palette, Pencil, Trash2 } from "lucide-react";
import { SectionType, TaskType } from "@/types/project";

const colors = [
  "indigo",
  "purple",
  "green",
  "yellow",
  "teal",
  "lime",
  "pink",
  "gray",
];

const SectionMoreOptions = ({
  setEditColumnTitle,
  column,
  setShowArchiveConfirm,
  setShowDeleteConfirm,
  setSections,
  sections,
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
  setSections: (updatedSections: SectionType[]) => void;
  sections: SectionType[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const triggerRef = useRef(null);

  const handleColor = (color: string) => {
    setSections(
      sections.map((section) => {
        if (section.id == column.id) {
          return {
            ...section,
            color,
          };
        }
        return section;
      })
    );
  };

  const ColorButton = ({ color }: { color: string }) => {
    const bgClassName = `bg-${color}-500`;

    return (
      <button
        onClick={() => handleColor(color)}
        type="button"
        className={`${bgClassName} aspect-video w-full cursor-pointer hover:opacity-80 transition rounded-lg ${
          sections.find((s) => s.id == column.id)?.color === color &&
          "border-2 border-black"
        }`}
        title={color}
      ></button>
    );
  };

  return (
    <Dropdown
      triggerRef={triggerRef}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      Label={({ onClick }) => (
        <button
          ref={triggerRef}
          className={`p-1 transition rounded-lg ${
            isOpen
              ? `bg-${
                  sections.find((s) => s.id == column.id)?.color || "gray"
                }-100`
              : `hover:bg-${
                  sections.find((s) => s.id == column.id)?.color || "gray"
                }-200`
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
          devide: true,
        },
        {
          id: 2,
          label: "Section color",
          onClick: () => {},
          icon: <Palette strokeWidth={1.5} size={16} />,
          devide: true,
          content: (
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <ColorButton key={color} color={color} />
              ))}
            </div>
          ),
        },
        {
          id: 3,
          label: column?.is_archived ? "Unarchive" : "Archive",
          onClick: () => {
            setShowArchiveConfirm(column);
            onClose();
          },
          icon: <Archive strokeWidth={1.5} size={16} />,
        },
        {
          id: 4,
          label: "Delete",
          onClick: () => {
            setShowDeleteConfirm(column);
            onClose();
          },
          icon: <Trash2 strokeWidth={1.5} size={16} />,
          className: "text-red-600",
        },
      ]}
      // contentWidthClass="w-80"
    />
  );
};

export default SectionMoreOptions;
