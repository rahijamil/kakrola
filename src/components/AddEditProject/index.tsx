"use client";
import React, { FormEvent, useCallback, useMemo, useState } from "react";
import { DialogTitle } from "../ui";
import { ProjectType, TaskPriority } from "@/types/project";
import {
  AlignLeft,
  CalendarDays,
  CalendarRange,
  Check,
  CheckCircle,
  CircleChevronUp,
  FoldHorizontal,
  MoreHorizontal,
  SquareGanttChart,
  SquareKanban,
  Tag,
  UnfoldHorizontal,
  UserPlus,
  X,
} from "lucide-react";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { Input } from "../ui/input";
import { useAuthProvider } from "@/context/AuthContext";
import Spinner from "../ui/Spinner";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import WorkspaceSelector from "./WorkspaceSelector";
import ColorSelector from "./ColorSelector";
import { generateSlug } from "@/utils/generateSlug";
import AnimatedCircleCheck from "@/components/TaskViewSwitcher/AnimatedCircleCheck";
import { ViewTypes } from "@/types/viewTypes";
import { ProjectMemberType } from "@/types/team";
import { RoleType } from "@/types/role";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { useRole } from "@/context/RoleContext";
import { canEditProject } from "@/types/hasPermission";
import { Button } from "../ui/button";
import LayoutView from "../LayoutView";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const projectViewsToSelect: {
  id: number;
  name: ViewTypes["view"];
  icon: React.JSX.Element;
  visible: boolean;
}[] = [
  {
    id: 1,
    name: "List",
    icon: <SquareKanban size={24} strokeWidth={1.5} className="-rotate-90" />,
    visible: true,
  },
  {
    id: 2,
    name: "Board",
    icon: <SquareKanban size={24} strokeWidth={1.5} />,
    visible: true,
  },
  {
    id: 3,
    name: "Calendar",
    icon: <CalendarDays size={24} strokeWidth={1.5} />,
    visible: true,
  },
];

const AddEditProject = ({
  workspaceId,
  onClose,
  project,
  aboveBellow,
}: {
  workspaceId?: number | null;
  onClose: () => void;
  project?: ProjectType;
  aboveBellow?: "above" | "below" | null;
}) => {
  const { profile } = useAuthProvider();
  const { projects, setProjects, teams, projectMembers } =
    useTaskProjectDataProvider();

  const initialProjectData: Omit<ProjectType, "id"> = useMemo(
    () =>
      project && !aboveBellow
        ? project
        : {
            team_id: workspaceId || null,
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
    [project, workspaceId, aboveBellow, profile?.id]
  );

  const findProjectMember = useCallback(
    (projectId?: ProjectType["id"]) =>
      projectMembers.find((member) => member.project_id === projectId),
    [projectMembers]
  );

  const initialProjectMembersData = useMemo(
    () =>
      findProjectMember(project?.id) || {
        profile_id: profile?.id || "",
        project_id: project?.id || 0,
        role: RoleType.MEMBER,
        project_settings: {
          is_favorite: false,
          order: 0,
        },
      },
    [project?.id, profile?.id, findProjectMember]
  );

  const [projectData, setProjectData] =
    useState<Omit<ProjectType, "id">>(initialProjectData);
  const [projectMembersData, setProjectMembersData] = useState(
    initialProjectMembersData
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workspaces = useMemo(() => {
    const initialWorkspaces = [
      {
        team_id: null,
        name: "My Projects",
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

  const currentWorkspace = useMemo(
    () =>
      workspaces.find((w) => w.team_id === projectData?.team_id) ||
      workspaces[0],
    [workspaces, projectData?.team_id]
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
    (field: keyof ProjectMemberType, value: any) => {
      setProjectMembersData((prevData) => ({
        ...prevData,
        project_settings: {
          ...prevData.project_settings,
          [field]: value,
        },
      }));
    },
    []
  );

  const { role } = useRole();

  const handleAddProject = async (ev: FormEvent) => {
    ev.preventDefault();

    if (!profile?.id) return;

    if (!projectData.name) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    if (project?.id) {
      const userRole = role(project.id);
      const canUpdateSection = userRole ? canEditProject(userRole) : false;
      if (!canUpdateSection) return;

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
        entity_type: EntityType.PROJECT,
        entity_id: project.id,
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
          .from("project_members")
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
          entity_type: EntityType.PROJECT,
          entity_id: project.id,
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
          _profile_id: profile.id,
          _project_name: projectData.name,
          _project_slug: projectData.slug,
          _project_color: projectData.settings.color,
          _view: projectData.settings.view,
          _selected_views: projectData.settings.selected_views,
          _is_favorite: projectMembersData.project_settings.is_favorite,
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
        entity_type: EntityType.PROJECT,
        entity_id: data.project_id,
        metadata: {},
      });

      if (data) {
        // const [newProject, newMember] = data;

        // if (newProject) {
        //   setProjects((projects) => [...projects, newProject]);
        // }

        console.log("Project and member created:", { data });
      }
    }

    setLoading(false);
    onClose();
  };

  const handleAddProjectAboveBellow = async (
    ev: FormEvent,
    position: "above" | "below"
  ) => {
    ev.preventDefault();

    if (!projectData.name) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    if (project && profile?.id) {
      const currentIndex = projects.findIndex((p) => p.id === project.id);

      // Retrieve the current order values from userProjectSettings
      const currentProjectMember = projectMembers.find(
        (m) => m.project_id === project.id
      );

      const prevOrder =
        position === "above"
          ? projectMembers
              .filter(
                (m) =>
                  m.project_settings.order <
                  (currentProjectMember?.project_settings.order || 0)
              )
              .sort(
                (a, b) => b.project_settings.order - a.project_settings.order
              )[0].project_settings.order ||
            (currentProjectMember?.project_settings.order || 0) - 1
          : currentProjectMember?.project_settings.order || 0;

      const nextOrder =
        position === "below"
          ? projectMembers
              .filter(
                (m) =>
                  m.project_settings.order >
                  (currentProjectMember?.project_settings.order || 0)
              )
              .sort(
                (a, b) => a.project_settings.order - b.project_settings.order
              )[0]?.project_settings.order ||
            (currentProjectMember?.project_settings.order || 0) + 1
          : currentProjectMember?.project_settings.order || 0;

      const newOrder = (prevOrder + nextOrder) / 2;

      // Insert the new project
      const { data, error } = await supabaseBrowser.rpc(
        "insert_project_with_member",
        {
          _team_id: projectData.team_id,
          _profile_id: profile.id,
          _project_name: projectData.name,
          _project_slug: projectData.slug,
          _project_color: projectData.settings.color,
          _view: projectData.settings.view,
          _selected_views: projectData.settings.selected_views,
          _is_favorite: projectMembersData.project_settings.is_favorite,
          _order: newOrder,
        }
      );

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.CREATED_PROJECT,
        entity_type: EntityType.PROJECT,
        entity_id: data.project_id,
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
    onClose();
  };

  return (
    <div className="bg-background fixed inset-0 z-20 flex flex-col">
      <div className="flex justify-end p-4 pr-6">
        <button
          className="p-1 rounded-lg hover:bg-text-100 transition"
          onClick={onClose}
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="w-11/12 mx-auto flex flex-1 gap-16">
        <div className="w-full space-y-8 max-w-sm">
          <h1 className="font-medium text-3xl">New project</h1>

          <form
            onSubmit={(ev) => {
              if (aboveBellow) {
                handleAddProjectAboveBellow(ev, aboveBellow);
              } else {
                handleAddProject(ev);
              }
            }}
            className="space-y-8"
          >
            <div className="space-y-8">
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
              />

              <WorkspaceSelector
                currentWorkspace={currentWorkspace}
                workspaces={workspaces}
                onSelect={(workspace) =>
                  handleProjectDataChange("team_id", workspace.team_id)
                }
              />

              <div>
                <button
                  className="flex items-center space-x-2 w-full"
                  type="button"
                  onClick={() =>
                    setProjectMembersData((prev) => ({
                      ...prev,
                      project_settings: {
                        ...projectMembersData?.project_settings,
                        is_favorite:
                          !projectMembersData?.project_settings.is_favorite,
                      },
                    }))
                  }
                >
                  <ToggleSwitch
                    checked={projectMembersData.project_settings.is_favorite}
                    onCheckedChange={(value) =>
                      setProjectMembersData((prev) => ({
                        ...prev,
                        project_settings: {
                          ...projectMembersData.project_settings,
                          is_favorite: value,
                        },
                      }))
                    }
                  />

                  <span className="">Add to favorites</span>
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
                          : "border-text-200 hover:bg-text-50"
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

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner color="white" />

                  <span>Creating...</span>
                </div>
              ) : (
                "Create Project"
              )}
            </Button>
          </form>
        </div>

        <div className="rounded-lg border border-text-400 cursor-default select-none pointer-events-none w-full p-4 space-y-2 h-[666px]">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <CheckCircle
                size={28}
                className={`text-${projectData.settings.color}`}
              />
              <h1 className="text-[26px] font-bold p-1.5 h-8">
                {projectData.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Skeleton
                width={24}
                height={24}
                enableAnimation={false}
                borderRadius={"8px"}
              />
              <Skeleton
                width={24}
                height={24}
                enableAnimation={false}
                borderRadius={"8px"}
              />
              <Skeleton
                width={24}
                height={24}
                enableAnimation={false}
                borderRadius={"8px"}
              />
            </div>
          </div>

          <div>
            <LayoutView
              view={projectData.settings.view}
              setView={(v) => {}}
              forPreview
            />

            <div>
              {projectData.settings.view == "List" ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-y border-text-200 text-xs whitespace-nowrap grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200">
                      <th className="p-2 text-left font-medium flex items-center gap-2 pl-8">
                        <AlignLeft strokeWidth={2} className="w-4 h-4" />
                        <span>Task name</span>
                      </th>
                      <th className="p-2 text-left font-medium flex items-center gap-2">
                        <UserPlus strokeWidth={2} className="w-4 h-4" />
                        <span>Assignee</span>
                      </th>
                      <th className="p-2 text-left font-medium flex items-center gap-2">
                        <CalendarRange strokeWidth={2} className="w-4 h-4" />
                        <span>Dates</span>
                      </th>
                      <th className="p-2 text-left font-medium flex items-center gap-2">
                        <CircleChevronUp strokeWidth={2} className="w-4 h-4" />
                        <span>Priority</span>
                      </th>
                      <th className="p-2 text-left font-medium flex items-center gap-2">
                        <Tag strokeWidth={2} className="w-4 h-4" />
                        <span>Labels</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td colSpan={5} className="p-0 w-full pb-4">
                        <tr className="border-b border-text-200 block">
                          <td colSpan={5} className=" p-2">
                            <h3 className="font-bold">To do</h3>
                          </td>
                        </tr>
                        <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                          <td className="p-2 flex items-center gap-2">
                            <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                              <Check strokeWidth={1.5} size={16} />
                            </div>

                            <div className="w-full">
                              <Skeleton enableAnimation={false} width={"60%"} />
                            </div>
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                        </tr>
                        <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                          <td className="p-2 flex items-center gap-2">
                            <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                              <Check strokeWidth={1.5} size={16} />
                            </div>

                            <div className="w-full">
                              <Skeleton enableAnimation={false} width={"60%"} />
                            </div>
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                        </tr>
                        <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                          <td className="p-2 flex items-center gap-2">
                            <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                              <Check strokeWidth={1.5} size={16} />
                            </div>

                            <div className="w-full">
                              <Skeleton enableAnimation={false} width={"60%"} />
                            </div>
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                        </tr>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={5} className="p-0 w-full pb-4">
                        <tr className="border-b border-text-200 block">
                          <td colSpan={5} className=" p-2">
                            <h3 className="font-bold">In Progress</h3>
                          </td>
                        </tr>
                        <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                          <td className="p-2 flex items-center gap-2">
                            <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                              <Check strokeWidth={1.5} size={16} />
                            </div>

                            <div className="w-full">
                              <Skeleton enableAnimation={false} width={"60%"} />
                            </div>
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                        </tr>
                        <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                          <td className="p-2 flex items-center gap-2">
                            <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                              <Check strokeWidth={1.5} size={16} />
                            </div>

                            <div className="w-full">
                              <Skeleton enableAnimation={false} width={"60%"} />
                            </div>
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                        </tr>
                        <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                          <td className="p-2 flex items-center gap-2">
                            <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                              <Check strokeWidth={1.5} size={16} />
                            </div>

                            <div className="w-full">
                              <Skeleton enableAnimation={false} width={"60%"} />
                            </div>
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                        </tr>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={5} className="p-0 w-full pb-12">
                        <tr className="border-b border-text-200 block">
                          <td colSpan={5} className=" p-2">
                            <h3 className="font-bold">Complete</h3>
                          </td>
                        </tr>
                        <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                          <td className="p-2 flex items-center gap-2">
                            <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                              <Check strokeWidth={1.5} size={16} />
                            </div>

                            <div className="w-full">
                              <Skeleton enableAnimation={false} width={"60%"} />
                            </div>
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                        </tr>
                        <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                          <td className="p-2 flex items-center gap-2">
                            <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                              <Check strokeWidth={1.5} size={16} />
                            </div>

                            <div className="w-full">
                              <Skeleton enableAnimation={false} width={"60%"} />
                            </div>
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                        </tr>
                        <tr className="grid grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-200">
                          <td className="p-2 flex items-center gap-2">
                            <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                              <Check strokeWidth={1.5} size={16} />
                            </div>

                            <div className="w-full">
                              <Skeleton enableAnimation={false} width={"60%"} />
                            </div>
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                          <td className="p-2">
                            <Skeleton enableAnimation={false} width={"60%"} />
                          </td>
                        </tr>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : projectData.settings.view == "Board" ? (
                <div className="space-x-4 flex">
                  <div className="bg-text-100 p-2 rounded-lg w-72 space-y-2">
                    <div className="flex justify-between items-center gap-8">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold pl-[6px]">To do</h3>
                        <p className="text-sm text-text-600">3</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <FoldHorizontal
                          strokeWidth={1.5}
                          className="w-5 h-5 text-text-700"
                        />

                        <MoreHorizontal
                          strokeWidth={1.5}
                          className="w-5 h-5 text-text-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"60%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"70%"} />
                        </div>
                      </div>
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"60%"} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-text-100 p-2 rounded-lg w-72 space-y-2">
                    <div className="flex justify-between items-center gap-8">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold pl-[6px]">In progress</h3>
                        <p className="text-sm text-text-600">1</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <FoldHorizontal
                          strokeWidth={1.5}
                          className="w-5 h-5 text-text-700"
                        />

                        <MoreHorizontal
                          strokeWidth={1.5}
                          className="w-5 h-5 text-text-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2 flex items-center gap-2 bg-background rounded-lg">
                        <div className="w-5 h-5 min-w-5 min-h-5 flex items-center justify-center border border-text-500 rounded-full">
                          <Check strokeWidth={1.5} size={16} />
                        </div>

                        <div className="w-full">
                          <Skeleton enableAnimation={false} width={"60%"} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`bg-text-100 p-2 flex flex-col py-4 px-2 h-fit items-center justify-center gap-4 rounded-lg hover:transition-colors cursor-pointer `}
                  >
                    <button className={`p-1 pointer-events-none`}>
                      <UnfoldHorizontal
                        strokeWidth={1.5}
                        className="w-5 h-5 text-text-700"
                      />
                    </button>

                    <h3 className="font-bold vertical-text">Complete</h3>

                    <p className="text-sm text-text-600 vertical-text">4</p>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditProject;
