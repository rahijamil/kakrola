"use client";
import { useAuthProvider } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import useScreen from "@/hooks/useScreen";
import { PageType } from "@/types/pageTypes";
import { ChevronLeft, File } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";

const PageWrapper = ({
  children,
  page,
}: {
  children: ReactNode;
  page: PageType;
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

  const [pageTitle, setPageTitle] = useState<string>(page.title);

  const handleEditTitle = async () => {
    if (!profile?.id) return;

    if (page && pageTitle.trim().length && page.title !== pageTitle.trim()) {
      setPages(
        pages.map((p) =>
          p.id === page.id ? { ...p, title: pageTitle.trim() } : p
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

  return (
    <div
      className={`flex flex-col h-full w-full flex-1 transition-all duration-300`}
    >
      <div
        className={`flex items-center justify-between ${
          screenWidth > 768 ? "py-3 px-6 pb-0" : "p-3"
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
                            className="font-semibold border border-transparent hover:border-text-200 rounded-lg w-full p-1 py-0.5 cursor-text inline-block overflow-hidden text-ellipsis"
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
              <File size={24} className={`text-${page?.settings.color}`} />
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
                  className="font-semibold border border-transparent hover:border-text-200 rounded-lg w-full p-1 py-0.5 cursor-text inline-block overflow-hidden text-ellipsis"
                  onClick={() => toggleModal("editTitle", true)}
                >
                  {page.title}
                </h1>
              )}
            </div>
          </div>
        )}
        {/* 
        <div className={`flex items-center justify-end flex-1`}>
          <ul className="flex items-center">
            {typeof setShowShareOption === "function" &&
              headline !== "Today" && (
                <li>
                  <ShareOption
                    projectId={project?.id}
                    teamId={project?.team_id}
                  />
                </li>
              )}
            {screenWidth > 768 && (
              <li>
                <FilterOptions
                  hideCalendarView={hideCalendarView}
                  setTasks={setTasks}
                  tasks={tasks}
                />
              </li>
            )}
            {headline !== "Today" && (
              <li>
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
              </li>
            )}
          </ul>
        </div> */}
      </div>

      <div className="flex-1 flex flex-col h-full max-w-5xl w-11/12 mx-auto">
        {screenWidth > 768 && (
          <div className="flex items-center gap-2">
            <File size={28} className={`text-${page?.settings.color}`} />
            <input
              type="text"
              className="text-[26px] font-bold border-none rounded-lg focus-visible:outline-none p-1.5 bg-transparent w-full"
              value={pageTitle}
              onBlur={handleEditTitle}
              onChange={(ev) => setPageTitle(ev.target.value)}
              onKeyDown={(ev) => ev.key === "Enter" && handleEditTitle()}
            />
          </div>
        )}

        <div className={`flex-1`}>{children}</div>
      </div>
    </div>
  );
};

export default PageWrapper;
