import {
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  Copy,
  Ellipsis,
  Heart,
  HeartOff,
  Link,
  Logs,
  PencilLine,
  SlidersHorizontal,
  SwatchBook,
  Trash2,
} from "lucide-react";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { ProjectType } from "@/types/project";
import Dropdown from "../ui/Dropdown";
import useFavorite from "@/hooks/useFavorite";
import { useRouter } from "next/navigation";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import useScreen from "@/hooks/useScreen";

const ActiveProjectMoreOptions = ({
  project,
  stateActions: {
    setShowDeleteConfirm,
    setShowArchiveConfirm,
    setShowCommentOrActivity,
    setExportAsCSV,
    setImportFromCSV,
    setProjectEdit,
    setSaveTemplate,
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
    setSaveTemplate: Dispatch<SetStateAction<boolean>>;
  };
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const triggerRef = useRef(null);

  const router = useRouter();

  const { handleFavorite } = useFavorite({ project });

  const { projectMembers, setIsShowViewModal } = useSidebarDataProvider();

  // Find the current user project settings for the given project
  const currentProjectMember = projectMembers.find(
    (member) => member.project_id === project.id
  );

  // Determine the current favorite status
  const isFavorite = currentProjectMember
    ? currentProjectMember.project_settings.is_favorite
    : false;

  const handleCopyProjectLink = () => {
    navigator.clipboard.writeText(
      `https://kakrola.com/project/${project.slug}`
    );
  };

  const { screenWidth } = useScreen();

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <button
          ref={triggerRef}
          className={`${
            isOpen ? "bg-text-100" : "hover:bg-text-100"
          } transition p-1 rounded-lg cursor-pointer ml-1`}
          onClick={onClick}
        >
          <Ellipsis strokeWidth={1.5} className="w-5 h-5 text-text-500" />
        </button>
      )}
      contentWidthClass="w-60 py-1"
      items={[
        {
          id: 1,
          label: "Edit",
          icon: <PencilLine strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setProjectEdit(true);
          },
        },
        ...(screenWidth <= 768
          ? [
              {
                id: 2,
                label: "View",
                icon: <SlidersHorizontal strokeWidth={1.5} className="w-4 h-4" />,
                onClick: () => {
                  setIsShowViewModal(true);
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
          id: 3,
          label: "Copy project link",
          icon: <Link strokeWidth={1.5} className="w-4 h-4" />,
          onClick: handleCopyProjectLink,
          divide: true,
        },
        {
          id: 4,
          label: "Save as template",
          icon: <Copy strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setSaveTemplate(true);
          },
        },
        {
          id: 5,
          label: "Templates",
          icon: <SwatchBook strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            router.push("/app/templates");
          },
          divide: true,
        },
        {
          id: 6,
          label: "Import from CSV",
          icon: <ArrowDownToLine strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setImportFromCSV(true);
          },
        },
        {
          id: 7,
          label: "Export as CSV",
          icon: <ArrowUpFromLine strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setExportAsCSV(true);
          },
          divide: true,
        },
        {
          id: 8,
          label: "Activity log",
          icon: <Logs strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setShowCommentOrActivity("activity");
          },
          divide: true,
        },
        {
          id: 9,
          label: "Archive",
          icon: <Archive strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setShowArchiveConfirm(true);
          },
        },
        {
          id: 10,
          label: "Delete",
          textColor: "text-red-500",
          icon: <Trash2 strokeWidth={1.5} className="w-4 h-4" />,
          onClick: () => {
            setShowDeleteConfirm(true);
          },
        },
      ]}
      content={
        <div>
          <div>
            {/* <button className="w-full text-left px-4 py-2 text-sm text-text-700 hover:bg-text-100 transition flex items-center">
        <CopyPlusIcon className="w-4 h-4 mr-4" /> Duplicate
      </button> */}
            {/* <button className="w-full text-left px-4 py-2 text-sm text-text-700 hover:bg-text-100 transition flex items-center">
        <span className="w-5 h-5 mr-4 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19.5 20a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15zM18 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12zm0 1H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-6 2a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 12 9zm7.5-6a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15z"
            ></path>
          </svg>
        </span>{" "}
        Add section
      </button> */}
          </div>
        </div>
      }
    />
  );
};

export default ActiveProjectMoreOptions;
