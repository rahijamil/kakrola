import React, { Dispatch, RefObject, SetStateAction, useRef } from "react";
import {
  Archive,
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  ArrowUpFromLine,
  Ellipsis,
  Heart,
  HeartOff,
  HeartOffIcon,
  Link,
  Logs,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";
import { ProjectType } from "@/types/project";
import DeleteOption from "./DeleteOption";
import ArchiveOption from "./ArchiveOption";
import CopyProjectLinkOption from "./CopyProjectLinkOption";
import Dropdown from "@/components/ui/Dropdown";
import { usePathname } from "next/navigation";
import useFavorite from "@/hooks/useFavorite";

const SidebarProjectMoreOptions = ({
  project,
  stateActions: {
    setShowDeleteConfirm,
    setShowArchiveConfirm,
    setShowCommentOrActivity,
    setExportAsCSV,
    setImportFromCSV,
    setProjectEdit,
    setAboveBellow,
  },
}: {
  project: ProjectType;
  stateActions: {
    setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
    setShowArchiveConfirm: Dispatch<SetStateAction<boolean>>;
    setShowCommentOrActivity: Dispatch<
      SetStateAction<"comment" | "activity" | null>
    >;
    setExportAsCSV: Dispatch<SetStateAction<boolean>>;
    setImportFromCSV: Dispatch<SetStateAction<boolean>>;
    setProjectEdit: Dispatch<SetStateAction<boolean>>;
    setAboveBellow: Dispatch<SetStateAction<"above" | "below" | null>>;
  };
}) => {
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const pathname = usePathname();

  const { handleFavorite } = useFavorite({ project });

  const handleCopyProjectLink = () => {
    navigator.clipboard.writeText(`https://ekta.com/project/${project.slug}`);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <div
          ref={triggerRef}
          onClick={(ev) => {
            ev.stopPropagation();
            onClick();
          }}
          className={`flex items-center justify-center absolute inset-0 z-10 cursor-pointer ${
            pathname === `/app/project/${project.slug}`
              ? "bg-primary-200"
              : "bg-primary-100"
          } hover:bg-primary-200 rounded-full sidebar_project_item_options w-7 h-7 ${
            isOpen ? "bg-primary-200" : "opacity-0"
          }`}
        >
          <Ellipsis className="w-5 h-5 text-text-700" strokeWidth={1.5} />
        </div>
      )}
      items={[
        {
          id: 1,
          label: "Add project above",
          icon: <ArrowUp strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setAboveBellow("above");
          },
        },
        {
          id: 2,
          label: "Add project below",
          icon: <ArrowUp strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setAboveBellow("below");
          },
          divide: true,
        },
        {
          id: 3,
          label: "Edit",
          icon: <Pencil strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setProjectEdit(true);
          },
        },
        {
          id: 4,
          label: project.is_favorite
            ? "Remove from favorites"
            : "Add to favorites",
          icon: project.is_favorite ? (
            <HeartOff className="w-4 h-4" />
          ) : (
            <Heart strokeWidth={1.5} className="w-4 h-4" />
          ),
          onClick: handleFavorite,
          divide: true,
        },
        {
          id: 65,
          label: "Share",
          icon: <UserPlus strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {},
          divide: true,
        },
        {
          id: 6,
          label: "Copy project link",
          icon: <Link strokeWidth={1.5} className="w-4 h-4" />,
          onClick: handleCopyProjectLink,
          divide: true,
        },
        {
          id: 7,
          label: "Import from CSV",
          icon: <ArrowDownToLine strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setImportFromCSV(true);
          },
        },
        {
          id: 8,
          label: "Export as CSV",
          icon: <ArrowUpFromLine strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setExportAsCSV(true);
          },
          divide: true,
        },
        {
          id: 9,
          label: "Activity log",
          icon: <Logs strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setShowCommentOrActivity("activity");
          },
          divide: true,
        },
        {
          id: 10,
          label: "Archive",
          icon: <Archive strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setShowArchiveConfirm(true);
          },
        },
        {
          id: 11,
          label: "Delete",
          textColor: "text-red-600",
          icon: <Trash2 strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setShowDeleteConfirm(true);
          },
        },
      ]}
    />
  );
};

export default SidebarProjectMoreOptions;
