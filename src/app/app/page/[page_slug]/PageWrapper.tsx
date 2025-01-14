"use client";
import FilterOptions from "@/components/LayoutWrapper/FilterOptions";
import ShareOption from "@/components/LayoutWrapper/ShareOption";
import { useAuthProvider } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import useScreen from "@/hooks/useScreen";
import { PageType } from "@/types/pageTypes";
import {
  ChevronLeft,
  FileText,
  Heart,
  HeartOff,
  ImageIcon,
  MessageSquareText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useRef, useState } from "react";
import ActivePageMoreOptions from "./ActivePageMoreOptions";
import LeaveConfirm from "@/components/SidebarWrapper/Sidebar/LeaveConfirm";
import DeleteConfirm from "@/components/SidebarWrapper/Sidebar/DeleteConfirm";
import ArchiveConfirm from "@/components/SidebarWrapper/Sidebar/ArchiveConfirm";
import CommentOrActivityModal from "@/components/LayoutWrapper/CommentOrActivityModal";
import useFavorite from "@/hooks/useFavorite";
import { SavePageAsTemplate } from "./SavePageAsTemplate";
import { supabaseBrowser } from "@/utils/supabase/client";

const PageWrapper = ({
  children,
  page,
}: {
  children: ReactNode;
  page: PageType;
}) => {
  const { screenWidth } = useScreen();
  const { teams, setPages, pages, personalMembers } = useSidebarDataProvider();
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
    leaveConfirm: false,
  });

  const [pageTitle, setPageTitle] = useState<string>(page.title);

  const handleEditTitle = async () => {
    if (!profile?.id) return;

    if (page && pageTitle.trim().length && page.title !== pageTitle.trim()) {
      setPages(
        pages.map((p) =>
          p.id === page.id ? { ...p, title: pageTitle.trim() } : p
        )
      );
      // if (!canEditContent(role({ project, page: null }), !!project.team_id))
      //   return;

      const { error } = await supabaseBrowser
        .from("pages")
        .update({ title: pageTitle.trim() })
        .eq("id", page.id);

      if (error) console.log(error);

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

  const triggerRef = useRef(null);

  const { handleFavorite } = useFavorite({
    column_value: Number(page.id),
    column_name: "page_id",
  });

  return (
    <>
      <div
        className={`flex flex-col h-full w-full flex-1 transition-all duration-300`}
      >
        <div
          className={`flex items-center justify-between ${
            screenWidth > 768 ? "py-3 px-6" : "p-3"
          }`}
        >
          {screenWidth > 768 ? (
            <div className="flex items-center w-64 whitespace-nowrap">
              <Link
                href={`/app/projects`}
                className="hover:bg-text-100 p-1 py-0.5 rounded-lg transition-colors"
              >
                {teams.find((t) => t.id === page.team_id)?.name ?? "Personal"}
              </Link>
              <span className="text-text-400">/</span>
              {/* {project ? (
                        modalState.editTitle ? (
                          <input
                            type="text"
                            className="font-semibold border border-text-300 rounded-lg p-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 bg-transparent"
                            value={projectTitle}
                            onBlur={handleEditTitle}
                            autoFocus
                            onChange={(ev) => setProjectTitle(ev.target.value)}
                            onKeyDown={(ev) =>
                              ev.key === "Enter" && handleEditTitle()
                            }
                          />
                        ) : (
                          <h1
                            className="font-semibold border border-transparent hover:border-text-100 rounded-lg w-full p-1 py-0.5 cursor-text inline-block overflow-hidden text-ellipsis"
                            onClick={() => toggleModal("editTitle", true)}
                          >
                            {page.name}
                          </h1>
                        )
                      ) : (
                        <h1
                          className={`font-semibold inline-block overflow-hidden text-ellipsis p-1 py-0.5 ${
                            (headline == "Filters & Labels" ||
                              headline == "Upcoming") &&
                            "mt-6"
                          }`}
                        >
                          {headline}
                        </h1>
                      )} */}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="w-6 h-6">
                <ChevronLeft strokeWidth={1.5} size={24} />
              </button>
              <div className="flex items-center gap-1">
                <FileText
                  size={24}
                  className={`text-${page?.settings.color}`}
                />
                {modalState.editTitle ? (
                  <input
                    type="text"
                    className="font-semibold border border-text-300 rounded-lg p-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 bg-transparent"
                    value={pageTitle}
                    onBlur={handleEditTitle}
                    autoFocus
                    onChange={(ev) => setPageTitle(ev.target.value)}
                    onKeyDown={(ev) => ev.key === "Enter" && handleEditTitle()}
                  />
                ) : (
                  <h1
                    className="font-semibold border border-transparent hover:border-text-100 rounded-lg w-full p-1 py-0.5 cursor-text inline-block overflow-hidden text-ellipsis"
                    onClick={() => toggleModal("editTitle", true)}
                  >
                    {page.title}
                  </h1>
                )}
              </div>
            </div>
          )}

          <div className={`flex items-center justify-end flex-1`}>
            <ul className="flex items-center" ref={triggerRef}>
              <li>
                <ShareOption pageId={Number(page.id)} triggerRef={triggerRef} />
              </li>

              {screenWidth > 768 && (
                <li>
                  <button
                    onClick={handleFavorite}
                    className={`hover:bg-text-100 transition p-1.5 rounded-lg cursor-pointer flex items-center gap-1 text-text-500`}
                  >
                    {personalMembers.find((m) => m.page_id === page.id)
                      ?.settings.is_favorite ? (
                      <Heart
                        strokeWidth={1.5}
                        fill="currentColor"
                        className="w-4 h-4 text-raspberry-500"
                      />
                    ) : (
                      <Heart strokeWidth={1.5} className="w-4 h-4" />
                    )}
                  </button>
                </li>
              )}

              {page && (
                <li>
                  <ActivePageMoreOptions
                    triggerRef={triggerRef}
                    page={page}
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
                      setShowLeaveConfirm: (value) =>
                        toggleModal("leaveConfirm", value as boolean),
                    }}
                  />
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full w-full overflow-y-auto">
          <div className="group">
            {/* unplash free api for banner image */}
            {/* <div className="w-full h-60 min-h-60 bg-text-50 relative">
              <Image
                src="/images/page_banner.jpg"
                alt="page banner"
                fill
                className="object-cover"
              />
            </div> */}

            {screenWidth > 768 && (
              <div className="relative px-80">
                {/* <div className="absolute -top-1/2 translate-y-1/3">
                  <FileText
                    size={60}
                    className={`text-${page?.settings.color} bg-background rounded-lg shadow-lg`}
                  />
                </div> */}
                <div className="pt-16_if_icon pt-12 relative">
                  {/* <div className="absolute top-4 items-center hidden group-hover:flex select-none">
                    <button className="flex items-center gap-1 text-text-500 p-1 px-1.5 rounded-lg hover:bg-text-100 transition">
                      <ImageIcon strokeWidth={1.5} size={16} />
                      Add banner
                    </button>
                    <button className="flex items-center gap-1 text-text-500 p-1 px-1.5 rounded-lg hover:bg-text-100 transition">
                      <MessageSquareText strokeWidth={1.5} size={16} />
                      Add comment
                    </button>
                  </div> */}

                  <input
                    type="text"
                    className="text-3xl font-bold border-none rounded-lg focus-visible:outline-none p-1.5 bg-transparent w-full"
                    value={pageTitle}
                    onBlur={handleEditTitle}
                    onChange={(ev) => setPageTitle(ev.target.value)}
                    onKeyDown={(ev) => ev.key === "Enter" && handleEditTitle()}
                  />
                </div>
              </div>
            )}
          </div>
          <div className={`flex-1`}>{children}</div>
        </div>
      </div>

      {modalState.saveTemplate && page && (
        <SavePageAsTemplate
          page={page}
          onClose={() => toggleModal("saveTemplate", false)}
        />
      )}

      {modalState.leaveConfirm && (
        <LeaveConfirm
          setShowLeaveConfirm={() =>
            setModalState((prev) => ({ ...prev, leaveConfirm: false }))
          }
          page={page}
        />
      )}

      {modalState.showDeleteConfirm && (
        <DeleteConfirm
          setShowDeleteConfirm={() =>
            setModalState((prev) => ({ ...prev, showDeleteConfirm: false }))
          }
          page={page}
        />
      )}

      {modalState.showArchiveConfirm && (
        <ArchiveConfirm
          setShowArchiveConfirm={() =>
            setModalState((prev) => ({ ...prev, showArchiveConfirm: false }))
          }
          page={page}
        />
      )}

      {modalState.showCommentOrActivity && (
        <CommentOrActivityModal
          onClose={() =>
            setModalState((prev) => ({ ...prev, showCommentOrActivity: null }))
          }
          showCommentOrActivity={modalState.showCommentOrActivity}
          setShowCommentOrActivity={() =>
            setModalState((prev) => ({ ...prev, showCommentOrActivity: null }))
          }
          page={page}
        />
      )}
    </>
  );
};

export default PageWrapper;
