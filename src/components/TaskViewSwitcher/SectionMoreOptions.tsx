import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";
import Dropdown from "../ui/Dropdown";
import { Archive, Ellipsis, Palette, Pencil, Trash2 } from "lucide-react";
import { SectionType, TaskType } from "@/types/project";
import useTheme from "@/hooks/useTheme";

const colors = [
  "kakrola",
  "tangerine",
  "kale",
  "lavender",
  "raspberry",
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

  const { theme } = useTheme();

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
    const bgClassName =
      theme === "dark" ? `bg-${color}-400` : `bg-${color}-400`; // Adjusted class based on theme

    return (
      <button
        onClick={() => handleColor(color)}
        type="button"
        className={`${bgClassName} aspect-video w-full cursor-pointer hover:opacity-80 transition rounded-lg ${
          sections.find((s) => s.id === column.id)?.color === color &&
          "border-2 border-text-900"
        }`}
        title={color}
      ></button>
    );
  };

  const sectionColor = sections.find((s) => s.id == column.id)?.color || "gray";

  // Tailwind doesn't generate all color classes by default, so we need to explicitly define them
  const bgColorClass =
    theme == "dark"
      ? `bg-${sectionColor}-800 text-${sectionColor}-100`
      : `bg-${sectionColor}-100 text-${sectionColor}-600`;
  const hoverBgColorClass =
    theme == "dark"
      ? `hover:bg-${sectionColor}-400`
      : `hover:bg-${sectionColor}-100 hover:bg-text-100`;

  return (
    <Dropdown
      triggerRef={triggerRef}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      Label={({ onClick }) => (
        <button
          ref={triggerRef}
          className={`p-1.5 transition rounded-lg ${
            isOpen ? bgColorClass : hoverBgColorClass
          }`}
          onClick={onClick}
        >
          <Ellipsis strokeWidth={1.5} className={`w-4 h-4`} />
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
          divide: true,
        },
        {
          id: 2,
          label: "Section color",
          onClick: () => {},
          icon: <Palette strokeWidth={1.5} size={16} />,
          divide: true,
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
          textColor: "text-red-500",
          icon: <Trash2 strokeWidth={1.5} size={16} />,
        },
      ]}
      // contentWidthClass="w-80"
    />
  );
};

export default SectionMoreOptions;
