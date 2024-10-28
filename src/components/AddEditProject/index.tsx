"use client";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ProjectType, TaskPriority } from "@/types/project";
import { CheckCircle, ChevronLeft, SquareGanttChart, X } from "lucide-react";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { Input } from "../ui/input";
import { useAuthProvider } from "@/context/AuthContext";
import Spinner from "../ui/Spinner";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import TeamspaceSelector from "./TeamspaceSelector";
import ColorSelector from "./ColorSelector";
import { generateSlug } from "@/utils/generateSlug";
import AnimatedCircleCheck from "@/components/TaskViewSwitcher/AnimatedCircleCheck";
import { PersonalMemberForProjectType, TeamType } from "@/types/team";
import { PersonalRoleType } from "@/types/role";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useRole } from "@/context/RoleContext";
import { Button } from "../ui/button";
import "react-loading-skeleton/dist/skeleton.css";
import ViewSkeleton from "../ViewSkeleton";
import { projectViewsToSelect } from "@/data/project_views";
import useScreen from "@/hooks/useScreen";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { canEditContent } from "@/utils/permissionUtils";
import { useRouter } from "next/navigation";

const AddEditProject = ({
  team_id,
  onClose,
  project,
  aboveBellow,
}: {
  team_id?: TeamType["id"] | null;
  onClose: () => void;
  project?: ProjectType;
  aboveBellow?: "above" | "below" | null;
}) => {
  const { profile } = useAuthProvider();
  const { projects, setProjects, teams, personalMembers, setPersonalMembers } =
    useSidebarDataProvider();
  const { screenWidth } = useScreen();

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  const initialProjectData: Omit<ProjectType, "id" | "workspace_id"> = useMemo(
    () =>
      project && !aboveBellow
        ? project
        : {
            team_id: team_id || null,
            profile_id: profile?.id || "",
            name: "",
            slug: "",
            settings: {
              color: "gray-500",
              view: "List",
              selected_views: ["List"],
            },
            updated_at: new Date().toISOString(),
            is_archived: false,
          },
    [project, team_id, aboveBellow, profile?.id]
  );

  const findProjectMember = useCallback(
    (projectId?: ProjectType["id"]) =>
      personalMembers.find((member) => member.project_id === projectId),
    [personalMembers]
  );

  const initialProjectMembersData = useMemo(
    () =>
      findProjectMember(project?.id) || {
        profile_id: profile?.id || "",
        project_id: project?.id || 0,
        role: PersonalRoleType.ADMIN,
        settings: {
          is_favorite: false,
          order: 0,
        },
      },
    [project?.id, profile?.id, findProjectMember]
  );

  const [projectData, setProjectData] =
    useState<Omit<ProjectType, "id" | "workspace_id">>(initialProjectData);
  const [projectMembersData, setPersonalMembersData] = useState(
    initialProjectMembersData
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const teamspaces = useMemo(() => {
    const initialWorkspaces = [
      {
        team_id: null,
        name: "Personal",
        avatar_url: profile?.avatar_url || "",
      },
    ];

    return [
      ...initialWorkspaces,
      ...teams.map((team) => ({
        team_id: team.id,
        name: team.name,
        avatar_url: team.avatar_url,
      })),
    ];
  }, [teams, profile?.avatar_url]);

  const currentTeamspace = useMemo(
    () =>
      teamspaces.find((team) => team.team_id === projectData?.team_id) ||
      teamspaces[0],
    [teamspaces, projectData?.team_id]
  );

  const handleProjectDataChange = useCallback(
    (field: keyof ProjectType, value: any) => {
      setProjectData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    },
    []
  );

  const handleProjectMembersDataChange = useCallback(
    (field: keyof PersonalMemberForProjectType, value: any) => {
      setPersonalMembersData((prevData) => ({
        ...prevData,
        settings: {
          ...prevData.settings,
          [field]: value,
        },
      }));
    },
    []
  );

  const { role } = useRole();

  const handleAddProject = async (ev: FormEvent) => {
    try {
      ev.preventDefault();

      if (!profile?.id || !profile.metadata?.current_workspace_id) return;

      if (!projectData.name) {
        setError("Project name is required.");
        return;
      }

      setLoading(true);
      setError(null);

      if (project?.id) {
        if (!canEditContent(role({ project, page: null }), !!project.team_id))
          return;

        const data: Partial<ProjectType> = {};
        const fields = ["name"] as const;

        fields.forEach((field) => {
          if (projectData[field] !== project[field]) {
            data[field] = projectData[field] as any;
          }
        });

        if (Object.keys(data).length === 0) {
          setLoading(false);
          onClose();
          return;
        }

        const { error } = await supabaseBrowser
          .from("projects")
          .update(data)
          .eq("id", project.id);

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        createActivityLog({
          actor_id: profile.id,
          action: ActivityAction.UPDATED_PROJECT,
          entity: {
            type: EntityType.PROJECT,
            id: project.id,
            name: project.name,
          },
          metadata: {
            old_data: project,
            new_data: data,
          },
        });

        setProjects(
          projects.map((p) => {
            if (p.id === project.id) {
              return {
                ...p,
                ...data,
              };
            }
            return p;
          })
        );

        if (projectMembersData) {
          const { error: projectMembersError } = await supabaseBrowser
            .from("personal_members")
            .update({
              ...projectMembersData,
            })
            .eq("project_id", project.id);

          if (projectMembersError) {
            setError(projectMembersError.message);
            setLoading(false);
            console.error(projectMembersError);
            return;
          }

          createActivityLog({
            actor_id: profile.id,
            action: ActivityAction.UPDATED_PROJECT,
            entity: {
              type: EntityType.PROJECT,
              id: project.id,
              name: project.name,
            },
            metadata: {
              old_data: initialProjectMembersData,
              new_data: projectMembersData,
            },
          });
        }
      } else {
        const { data, error } = await supabaseBrowser.rpc(
          "insert_project_with_member",
          {
            _team_id: projectData.team_id,
            _workspace_id: profile.metadata.current_workspace_id,
            _profile_id: profile.id,
            _project_name: projectData.name,
            _project_slug: projectData.slug,
            _project_color: projectData.settings.color,
            _view: projectData.settings.view,
            _selected_views: projectData.settings.selected_views,
            _is_favorite: projectMembersData.settings.is_favorite,
            _order: projects.length + 1,
          }
        );

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        createActivityLog({
          actor_id: profile.id,
          action: ActivityAction.CREATED_PROJECT,
          entity: {
            type: EntityType.PROJECT,
            id: data.project_id,
            name: projectData.name,
          },
          metadata: {},
        });

        if (data) {
          setProjects([
            ...projects,
            {
              ...projectData,
              id: data[0].project_id,
              workspace_id: profile.metadata?.current_workspace_id,
            },
          ]);
          setPersonalMembers([
            ...personalMembers,
            {
              ...projectMembersData,
              project_id: data[0].project_id,
              id: data[0].member_id,
            },
          ]);
          console.log("Project and member created:", { data });
        }
      }

      router.push("/app/project/" + projectData.slug);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProjectAboveBellow = async (
    ev: FormEvent,
    position: "above" | "below"
  ) => {
    ev.preventDefault();

    if (!profile?.metadata?.current_workspace_id) return;

    if (!projectData.name) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    if (project && profile?.id) {
      const currentIndex = projects.findIndex((p) => p.id === project.id);

      // Retrieve the current order values from userProjectSettings
      const currentProjectMember = personalMembers.find(
        (m) => m.project_id === project.id
      );

      const prevOrder =
        position === "above"
          ? personalMembers
              .filter(
                (m) =>
                  m.settings.order < (currentProjectMember?.settings.order || 0)
              )
              .sort((a, b) => b.settings.order - a.settings.order)[0].settings
              .order || (currentProjectMember?.settings.order || 0) - 1
          : currentProjectMember?.settings.order || 0;

      const nextOrder =
        position === "below"
          ? personalMembers
              .filter(
                (m) =>
                  m.settings.order > (currentProjectMember?.settings.order || 0)
              )
              .sort((a, b) => a.settings.order - b.settings.order)[0]?.settings
              .order || (currentProjectMember?.settings.order || 0) + 1
          : currentProjectMember?.settings.order || 0;

      const newOrder = (prevOrder + nextOrder) / 2;

      // Insert the new project
      const { data, error } = await supabaseBrowser.rpc(
        "insert_project_with_member",
        {
          _team_id: projectData.team_id,
          _workspace_id: profile.metadata.current_workspace_id,
          _profile_id: profile.id,
          _project_name: projectData.name,
          _project_slug: projectData.slug,
          _project_color: projectData.settings.color,
          _view: projectData.settings.view,
          _selected_views: projectData.settings.selected_views,
          _is_favorite: projectMembersData.settings.is_favorite,
          _order: newOrder,
        }
      );

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.CREATED_PROJECT,
        entity: {
          type: EntityType.PROJECT,
          id: data.project_id,
          name: projectData.name,
        },
        metadata: {},
      });

      // // Update local state without needing to reorder everything
      // const updatedProjects = [
      //   ...projects.slice(0, currentIndex + (position === "below" ? 1 : 0)),
      //   newProject,
      //   ...projects.slice(currentIndex + (position === "below" ? 1 : 0)),
      // ];

      // setProjects(updatedProjects);
    }

    setLoading(false);
    router.push("/app/project/" + projectData.slug);
    onClose();
  };

  return (
    portalContainer &&
    createPortal(
      <motion.div
        initial={{
          opacity: 0,
          y: -10,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: -10,
          scale: 0.95,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-surface md:bg-background fixed inset-0 z-20 flex flex-col"
      >
        {screenWidth > 768 && (
          <div className="flex justify-end p-4 md:pr-6">
            <button
              className="p-1 rounded-lg hover:bg-text-100 transition"
              onClick={onClose}
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
        )}

        <div className="w-full md:w-11/12 mx-auto flex flex-1 gap-16">
          <div className="w-full space-y-6 md:space-y-8 md:max-w-sm">
            {screenWidth > 768 ? (
              <h1 className="font-medium text-xl md:text-3xl">
                {project && !aboveBellow ? "Edit project" : "New Project"}
              </h1>
            ) : (
              <div className="flex justify-between items-center px-4 py-2 border-b border-text-100">
                <div className="flex items-center gap-3">
                  <button onClick={onClose} className="w-6 h-6">
                    <ChevronLeft strokeWidth={1.5} size={24} />
                  </button>
                  <h1 className="font-semibold">
                    {project && !aboveBellow ? "Edit project" : "New Project"}
                  </h1>
                </div>

                <Button
                  type="submit"
                  size="xs"
                  disabled={loading || !projectData.name.trim()}
                  variant="ghost"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner color="white" />

                      {project && !aboveBellow ? (
                        <span>Editing...</span>
                      ) : (
                        <span>Creating...</span>
                      )}
                    </div>
                  ) : project && !aboveBellow ? (
                    "Edit"
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            )}

            <form
              onSubmit={(ev) => {
                if (aboveBellow) {
                  handleAddProjectAboveBellow(ev, aboveBellow);
                } else {
                  handleAddProject(ev);
                }
              }}
              className="space-y-6 md:space-y-8"
            >
              <Input
                type="text"
                value={projectData?.name}
                onChange={(e) => {
                  handleProjectDataChange("name", e.target.value);
                  handleProjectDataChange("slug", generateSlug(e.target.value));
                }}
                required
                autoFocus
                label="Name"
                Icon={SquareGanttChart}
                placeholder="Project name"
              />

              <ColorSelector
                value={projectData.settings.color}
                onChange={(color) =>
                  handleProjectDataChange("settings", {
                    ...projectData.settings,
                    color,
                  })
                }
                Icon={CheckCircle}
              />

              <TeamspaceSelector
                currentTeamspace={currentTeamspace}
                teamspaces={teamspaces}
                onSelect={(teamspace) =>
                  handleProjectDataChange("team_id", teamspace.team_id)
                }
              />

              <div className="space-y-6 md:space-y-8 px-4 md:px-0">
                <div>
                  <button
                    className="flex items-center space-x-2 w-full"
                    type="button"
                    onClick={() =>
                      setPersonalMembersData((prev) => ({
                        ...prev,
                        settings: {
                          ...projectMembersData?.settings,
                          is_favorite:
                            !projectMembersData?.settings.is_favorite,
                        },
                      }))
                    }
                  >
                    <ToggleSwitch
                      checked={projectMembersData.settings.is_favorite}
                      onCheckedChange={(value) =>
                        setPersonalMembersData((prev) => ({
                          ...prev,
                          settings: {
                            ...projectMembersData.settings,
                            is_favorite: value,
                          },
                        }))
                      }
                    />

                    <label className="block font-semibold text-text-700">
                      Add to favorites
                    </label>
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="block font-bold text-text-700">View</p>
                  <ul className="flex gap-4 items-center">
                    {projectViewsToSelect.map((v) => (
                      <li
                        key={v.id}
                        tabIndex={0}
                        className={`flex items-center justify-center cursor-pointer rounded-lg px-4 border w-full aspect-square relative ${
                          projectData.settings.view === v.name
                            ? "border-primary-500 bg-primary-25"
                            : "border-text-100 hover:bg-text-50"
                        } focus:outline-none`}
                        onClick={() =>
                          setProjectData({
                            ...projectData,
                            settings: {
                              ...projectData.settings,
                              view: v.name,
                            },
                          })
                        }
                      >
                        <div className="flex flex-col items-center gap-1">
                          {v.icon}
                          <span className="text-text-700">{v.name}</span>
                        </div>

                        <div className="absolute top-1.5 right-1.5">
                          <AnimatedCircleCheck
                            handleCheckSubmit={() =>
                              setProjectData({
                                ...projectData,
                                settings: {
                                  ...projectData.settings,
                                  view: v.name,
                                },
                              })
                            }
                            priority={TaskPriority.P3}
                            is_completed={projectData.settings.view === v.name}
                            playSound={false}
                            disabled
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {error && (
                <p className="text-red-500 p-4 pt-0 text-center text-xs whitespace-normal">
                  {error}
                </p>
              )}

              {screenWidth > 768 && (
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading || !projectData.name.trim()}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner color="white" />

                      {project && !aboveBellow ? (
                        <span>Editing...</span>
                      ) : (
                        <span>Creating...</span>
                      )}
                    </div>
                  ) : project && !aboveBellow ? (
                    "Edit project"
                  ) : (
                    "Create Project"
                  )}
                </Button>
              )}
            </form>
          </div>

          {screenWidth > 768 &&
            profile?.metadata &&
            profile.metadata.current_workspace_id && (
              <ViewSkeleton
                projectData={{
                  ...projectData,
                  workspace_id: profile.metadata.current_workspace_id,
                }}
                activeView={projectData.settings.view}
              />
            )}
        </div>
      </motion.div>,
      portalContainer
    )
  );
};

export default AddEditProject;
