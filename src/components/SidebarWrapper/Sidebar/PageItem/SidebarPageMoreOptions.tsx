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
  SquarePen,
  Trash2,
  UserPlus,
} from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
import { usePathname } from "next/navigation";
import useFavorite from "@/hooks/useFavorite";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import {
  canArchiveProject,
  canCreateProject,
  canDeleteProject,
  canEditProject,
} from "@/types/hasPermission";
import { useRole } from "@/context/RoleContext";
import { RoleType } from "@/types/role";
import { PageType } from "@/types/pageTypes";
import useAddPage from "@/app/app/page/[page_slug]/useAddPage";

const SidebarPageMoreOptions = ({
  page,
  stateActions: {
    setShowDeleteConfirm,
    setShowLeaveConfirm,
    setShowArchiveConfirm,
    setShowCommentOrActivity,
    setExportAsCSV,
    setImportFromCSV,
    setProjectEdit,
  },
  setIsDragDisabled,
}: {
  page: PageType;
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
  };
  setIsDragDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const pathname = usePathname();

  const { handleFavorite } = useFavorite({
    column_name: "page_id",
    column_value: page.id as number,
  });

  const { personalMembers } = useSidebarDataProvider();

  const { role } = useRole();

  const pageRole = role({
    _page_id: page.id,
  });

  const canCreate = pageRole ? canCreateProject(pageRole) : false;
  const canEdit = pageRole ? canEditProject(pageRole) : false;
  const canDelete = pageRole ? canDeleteProject(pageRole) : false;
  const canArchive = pageRole ? canArchiveProject(pageRole) : false;

  // Find the current user project settings for the given project
  const currentUserPage = personalMembers.find(
    (member) => member.page_id === page.id
  );

  // Determine the current favorite status
  const isFavorite = currentUserPage
    ? currentUserPage.settings.is_favorite
    : false;

  const handleCopyProjectLink = () => {
    navigator.clipboard.writeText(`https://kakrola.com/app/page/${page.slug}`);
  };

  useEffect(() => {
    if (isOpen && setIsDragDisabled) {
      setIsDragDisabled(true);
    }
  }, [isOpen, setIsDragDisabled]);

  const { handleCreatePage } = useAddPage({});

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <div
          ref={triggerRef}
          onClick={onClick}
          className={`flex items-center justify-center absolute inset-0 z-10 cursor-pointer ${
            pathname === `/app/page/${page.slug}`
              ? "bg-primary-200 hover:bg-primary-200"
              : "bg-primary-50 hover:bg-primary-100"
          } rounded-lg sidebar_project_item_options w-7 h-7 ${
            isOpen ? "bg-primary-200" : "opacity-0"
          }`}
        >
          <Ellipsis className="w-5 h-5 text-text-700" strokeWidth={1.5} />
        </div>
      )}
      beforeItemsContent={
        currentUserPage?.role != RoleType.ADMIN ? (
          <p className="text-xs mb-1 p-2 whitespace-normal bg-text-100 px-6 text-text-700">
            Some features are not available to page
            {currentUserPage?.role == RoleType.MEMBER
              ? " members"
              : currentUserPage?.role == RoleType.COMMENTER
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
                label: "Add page above",
                icon: <ArrowUp strokeWidth={1.5} className="w-4 h-4" />,
                onClick: () => {
                  handleCreatePage({
                    aboveBellow: "above",
                    currentPageOrder: currentUserPage?.settings.order,
                  });
                },
              },
              {
                id: 2,
                label: "Add page below",
                icon: <ArrowDown strokeWidth={1.5} className="w-4 h-4" />,
                onClick: () => {
                  handleCreatePage({
                    aboveBellow: "below",
                    currentPageOrder: currentUserPage?.settings.order,
                  });
                },
                divide: true,
              },
            ]
          : []),
        ...(canEdit
          ? [
              {
                id: 3,
                label: "Rename",
                icon: <SquarePen strokeWidth={1.5} className="w-4 h-4" />,
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
        // {
        //   id: 65,
        //   label: "Share",
        //   icon: <UserPlus strokeWidth={1.5} className="w-4 h-4" />,
        //   onClick: () => {},
        //   divide: true,
        // },
        {
          id: 6,
          label: "Copy link",
          icon: <Link strokeWidth={1.5} className="w-4 h-4" />,
          onClick: handleCopyProjectLink,
          divide: true,
        },
        // {
        //   id: 7,
        //   label: "Import from CSV",
        //   icon: <ArrowDownToLine strokeWidth={1.5} className="w-4 h-4" />,
        //   onClick: () => {
        //     setImportFromCSV(true);
        //   },
        // },
        // {
        //   id: 8,
        //   label: "Export as CSV",
        //   icon: <ArrowUpFromLine strokeWidth={1.5} className="w-4 h-4" />,
        //   onClick: () => {
        //     setExportAsCSV(true);
        //   },
        //   divide: true,
        // },
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
                textColor: "text-red-500",
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
                textColor: "text-red-500",
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

export default SidebarPageMoreOptions;
