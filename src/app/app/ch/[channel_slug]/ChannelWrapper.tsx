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
import { ChevronLeft, Edit, Hash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import AddEditThread from "./AddEditThread";

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

      // const userRole = role(project.id);
      // const canUpdateSection = userRole ? canEditProject(userRole) : false;
      // if (!canUpdateSection) return;

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

  return (
    <>
      <div
        className={`flex flex-col h-full w-full flex-1 transition-all duration-300`}
      >
        <div
          className={`flex items-center justify-between gap-3 md:gap-0 ${
            screenWidth > 768 ? "py-3 px-6" : "p-3"
          }`}
        >
          {screenWidth > 768 ? (
            <div className="flex items-center w-64 whitespace-nowrap gap-1">
              <Link
                href={`/app/projects`}
                className="hover:bg-text-100 p-1 py-0.5 rounded-lg transition-colors flex items-center gap-1"
              >
                {team ? (
                  <>
                    {team.avatar_url ? (
                      <Image
                        src={team.avatar_url}
                        alt={team.name}
                        width={20}
                        height={20}
                        className="rounded-md"
                      />
                    ) : (
                      <div className="w-5 h-5 min-w-5 min-h-5 bg-primary-500 rounded-md flex items-center justify-center">
                        <span className="text-surface text-[10px] font-bold">
                          {team.name?.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span
                      className={`font-medium transition overflow-hidden whitespace-nowrap text-ellipsis`}
                    >
                      {team.name}
                    </span>{" "}
                  </>
                ) : (
                  "Personal"
                )}
              </Link>
              <span className="text-text-400">/</span>

              <div className="flex items-center">
                <div className="bg-surface rounded-md w-5 h-5 min-w-5 min-h-5 flex items-center justify-center">
                  <Hash
                    size={16}
                    className={`text-${channel?.settings.color}`}
                  />
                </div>
                {modalState.editTitle ? (
                  <input
                    type="text"
                    className="font-medium border border-text-300 rounded-lg p-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 bg-transparent"
                    value={pageTitle}
                    onBlur={handleEditTitle}
                    autoFocus
                    onChange={(ev) => setPageTitle(ev.target.value)}
                    onKeyDown={(ev) => ev.key === "Enter" && handleEditTitle()}
                  />
                ) : (
                  <h1
                    className="font-medium border border-transparent hover:border-text-100 rounded-lg w-full p-1 py-0.5 cursor-text inline-block overflow-hidden text-ellipsis"
                    onClick={() => toggleModal("editTitle", true)}
                  >
                    {channel.name}
                  </h1>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="w-6 h-6">
                <ChevronLeft strokeWidth={1.5} size={24} />
              </button>
              <div className="flex items-center gap-1">
                <Hash size={24} className={`text-${channel?.settings.color}`} />
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
                    {channel.name}
                  </h1>
                )}
              </div>
            </div>
          )}

          {screenWidth <= 768 && (
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => router.push(`/app/ch/${channel.slug}/th/new`)}
                type="button"
                className="flex items-center gap-1 bg-primary-600 hover:bg-primary-500 text-surface p-1 px-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit size={20} />
                Thread
              </button>
            </div>
          )}

          <div className={`flex items-center justify-end md:flex-1`}>
            <ul className="flex items-center">
              {/* <li>
              <Button icon={Edit} size="xs" onClick={() => router.push(`/app/ch/${channel.slug}/th/new`)}>
                New Thread
              </Button>
            </li> */}
              <li>
                <ShareOption projectId={null} />
              </li>

              {screenWidth > 768 && (
                <li>
                  <FilterOptions
                    hideCalendarView={true}
                    // setTasks={setTasks}
                    // tasks={tasks}
                  />
                </li>
              )}
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

        <div className="flex-1 flex flex-col h-full w-full overflow-y-auto">
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
          )}

          <div className={`flex-1`}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default ChannelWrapper;
