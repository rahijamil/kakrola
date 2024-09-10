import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
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
  LogOut,
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
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import {
  canArchiveProject,
  canCreateProject,
  canDeleteProject,
  canEditProject,
} from "@/types/hasPermission";
import { useRole } from "@/context/RoleContext";
import { RoleType } from "@/types/role";

const SidebarProjectMoreOptions = ({
  project,
  stateActions: {
    setShowDeleteConfirm,
    setShowLeaveConfirm,
    setShowArchiveConfirm,
    setShowCommentOrActivity,
    setExportAsCSV,
    setImportFromCSV,
    setProjectEdit,
    setAboveBellow,
  },
  setIsDragDisabled,
}: {
  project: ProjectType;
  stateActions: {
    setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
    setShowLeaveConfirm: Dispatch<SetStateAction<boolean>>;
    setShowArchiveConfirm: Dispatch<SetStateAction<boolean>>;
    setShowCommentOrActivity: Dispatch<
      SetStateAction<"comment" | "activity" | null>
    >;
    setExportAsCSV: Dispatch<SetStateAction<boolean>>;
    setImportFromCSV: Dispatch<SetStateAction<boolean>>;
    setProjectEdit: Dispatch<SetStateAction<boolean>>;
    setAboveBellow: Dispatch<SetStateAction<"above" | "below" | null>>;
  };
  setIsDragDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const pathname = usePathname();

  const { handleFavorite } = useFavorite({ project });

  const { projectMembers } = useTaskProjectDataProvider();

  const { role } = useRole();

  const projectRole = role(project.id);

  const canCreate = projectRole ? canCreateProject(projectRole) : false;
  const canEdit = projectRole ? canEditProject(projectRole) : false;
  const canDelete = projectRole ? canDeleteProject(projectRole) : false;
  const canArchive = projectRole ? canArchiveProject(projectRole) : false;

  // Find the current user project settings for the given project
  const currentUserProject = projectMembers.find(
    (member) => member.project_id === project.id
  );

  // Determine the current favorite status
  const isFavorite = currentUserProject
    ? currentUserProject.project_settings.is_favorite
    : false;

  const handleCopyProjectLink = () => {
    navigator.clipboard.writeText(
      `https://kakrola.com/project/${project.slug}`
    );
  };

  useEffect(() => {
    if (isOpen && setIsDragDisabled) {
      setIsDragDisabled(true);
    }
  }, [isOpen, setIsDragDisabled]);

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
          } hover:bg-primary-200 rounded-lg sidebar_project_item_options w-7 h-7 ${
            isOpen ? "bg-primary-200" : "opacity-0"
          }`}
        >
          <Ellipsis className="w-5 h-5 text-text-700" strokeWidth={1.5} />
        </div>
      )}
      beforeItemsContent={
        currentUserProject?.role != RoleType.ADMIN ? (
          <p className="text-xs mb-1 p-2 whitespace-normal bg-text-50 rounded-lg">
            Some features are not available to project
            {currentUserProject?.role == RoleType.MEMBER
              ? " members"
              : currentUserProject?.role == RoleType.COMMENTER
              ? " commenters"
              : " viewers"}
            .
          </p>
        ) : null
      }
      items={[
        ...(canCreate
          ? [
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
            ]
          : []),
        ...(canEdit
          ? [
              {
                id: 3,
                label: "Edit",
                icon: <Pencil strokeWidth={1.5} className="w-4 h-4" />,
                onClick: () => {
                  setProjectEdit(true);
                },
              },
            ]
          : []),
        {
          id: 4,
          label: isFavorite ? "Remove from favorites" : "Add to favorites",
          icon: isFavorite ? (
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
        ...(canArchive
          ? [
              {
                id: 10,
                label: "Archive",
                icon: <Archive strokeWidth={1.5} className="w-4 h-4" />,
                onClick: () => {
                  setShowArchiveConfirm(true);
                },
              },
            ]
          : []),
        ...(canDelete
          ? [
              {
                id: 11,
                label: "Delete",
                textColor: "text-red-600",
                icon: <Trash2 strokeWidth={1.5} className="w-4 h-4" />,
                onClick: () => {
                  setShowDeleteConfirm(true);
                },
              },
            ]
          : [
              {
                id: 11,
                label: "Leave",
                textColor: "text-red-600",
                icon: <LogOut strokeWidth={1.5} className="w-4 h-4" />,
                onClick: () => {
                  setShowLeaveConfirm(true);
                },
              },
            ]),
      ]}
    />
  );
};

export default SidebarProjectMoreOptions;
