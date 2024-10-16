"use client";
import ActiveProjectMoreOptions from "@/components/LayoutWrapper/ActiveProjectMoreOptions";
import FilterOptions from "@/components/LayoutWrapper/FilterOptions";
import ShareOption from "@/components/LayoutWrapper/ShareOption";
import { Button } from "@/components/ui/button";
import { useAuthProvider } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import useScreen from "@/hooks/useScreen";
import { ChannelType } from "@/types/channel";
import { PageType } from "@/types/pageTypes";
import {
  ChevronLeft,
  Edit,
  Hash,
  Headphones,
  MoreVertical,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useRef, useState } from "react";

const ChannelWrapper = ({
  children,
  channel,
}: {
  children: ReactNode;
  channel: ChannelType;
}) => {
  const { screenWidth } = useScreen();
  const { teams, setPages, pages } = useSidebarDataProvider();
  const router = useRouter();
  const { profile } = useAuthProvider();
  const { role } = useRole();

  const [modalState, setModalState] = useState({
    projectEdit: false,
    saveTemplate: false,
    showImportFromCSV: false,
    showExportAsCSV: false,
    showCommentOrActivity: null as "comment" | "activity" | null,
    showArchiveConfirm: false,
    showDeleteConfirm: false,
    editTitle: false,
  });

  const [pageTitle, setPageTitle] = useState<string>(channel.name);

  const handleEditTitle = async () => {
    if (!profile?.id) return;

    if (
      channel &&
      pageTitle.trim().length &&
      channel.name !== pageTitle.trim()
    ) {
      setPages(
        pages.map((p) =>
          p.id === channel.id ? { ...p, title: pageTitle.trim() } : p
        )
      );

      // if (!canEditContent(role({ project, page: null }), !!project.team_id))
      //   return;

      // const { error } = await supabaseBrowser
      //   .from("projects")
      //   .update({ name: projectTitle.trim() })
      //   .eq("id", project.id);

      // if (error) console.log(error);

      // createActivityLog({
      //   actor_id: profile.id,
      //   action: ActivityAction.UPDATED_PROJECT,
      //   entity_type: EntityType.PROJECT,
      //   entity_id: project.id,
      //   metadata: {
      //     old_data: project,
      //     new_data: { ...project, name: projectTitle.trim() },
      //   },
      // });
    }
    setModalState((prev) => ({
      ...prev,
      editTitle: false,
      editTitleInListView: false,
    }));
  };

  const toggleModal = (key: keyof typeof modalState, value: boolean | null) =>
    setModalState((prev) => ({ ...prev, [key]: value }));

  const team = teams.find((t) => t.id === channel.team_id);
  const triggerRef = useRef(null);

  return (
    <>
      <div
        className={`flex flex-col h-full w-full flex-1 transition-all duration-300`}
      >
        <div
          className={`flex items-center justify-between gap-3 md:gap-0 border-b border-text-100 ${
            screenWidth > 768 ? "py-3 px-6" : "p-3"
          }`}
        >
          <div className={`flex items-center justify-end md:flex-1`}>
            <ul className="flex items-center" ref={triggerRef}>
              {/* <li>
              <Button icon={Edit} size="xs" onClick={() => router.push(`/app/ch/${channel.slug}/th/new`)}>
                New Thread
              </Button>
            </li> */}
              <li>
                <ShareOption triggerRef={triggerRef} teamId={channel.team_id} />
              </li>

              <li>
                <button className="text-text-500 hover:bg-text-100 p-1.5 rounded-lg transition flex items-center gap-1">
                  <MoreVertical strokeWidth={1.5} size={16} />
                </button>
              </li>

              {/* <li>
              {project && (
                <ActiveProjectMoreOptions
                  project={project}
                  stateActions={{
                    setProjectEdit: (value) =>
                      toggleModal("projectEdit", value as boolean),
                    setSaveTemplate: (value) =>
                      toggleModal("saveTemplate", value as boolean),
                    setImportFromCSV: (value) =>
                      toggleModal("showImportFromCSV", value as boolean),
                    setExportAsCSV: (value) =>
                      toggleModal("showExportAsCSV", value as boolean),
                    setShowArchiveConfirm: (value) =>
                      toggleModal("showArchiveConfirm", value as boolean),
                    setShowDeleteConfirm: (value) =>
                      toggleModal("showDeleteConfirm", value as boolean),
                    setShowCommentOrActivity: (value) =>
                      toggleModal("showCommentOrActivity", value as null),
                  }}
                />
              )}
            </li> */}
            </ul>
          </div>
        </div>

        {/* <div className="flex-1 flex flex-col h-full w-full overflow-y-auto">
          <div className="w-full h-60 min-h-60 bg-text-100"></div>

          {screenWidth > 768 && (
            <div className="relative px-80">
              <div className="absolute -top-1/2 translate-y-1/3">
                <Hash size={60} className={`text-${channel?.settings.color}`} />
              </div>
              <div className="mt-16 flex items-start justify-between gap-8">
                <h1 className="font-bold text-3xl">{channel.name}</h1>

                <Button
                  icon={Edit}
                  onClick={() => router.push(`/app/ch/${channel.slug}/th/new`)}
                >
                  New Thread
                </Button>
              </div>
            </div>
          )} */}

        <div className={`flex-1`}>{children}</div>
        {/* </div> */}
      </div>
    </>
  );
};

export default ChannelWrapper;
