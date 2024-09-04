"use client";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Dialog, DialogHeader, DialogTitle } from "../ui";
import { ProjectType } from "@/types/project";
import { CircleHelp, SquareGanttChart, SquareKanban } from "lucide-react";
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

const projectViewsToSelect: {
  id: number;
  name: ViewTypes["view"];
  icon: React.JSX.Element;
  visible: boolean;
}[] = [
  {
    id: 1,
    name: "List",
    icon: <SquareKanban size={16} strokeWidth={1.5} className="-rotate-90" />,
    visible: true,
  },
  {
    id: 2,
    name: "Board",
    icon: <SquareKanban size={16} strokeWidth={1.5} />,
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

  const initialProjectData = useMemo(
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

  const [projectData, setProjectData] = useState(initialProjectData);
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

      setProjects((projects) => {
        return projects.map((p) => {
          if (p.id === project.id) {
            return {
              ...p,
              ...data,
            };
          }
          return p;
        });
      });

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
      const { data: newProject, error: insertError } = await supabaseBrowser
        .from("projects")
        .insert({
          ...projectData,
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      // Update userProjectSettings with the new order
      const newProjectMembersData: Omit<ProjectMemberType, "id"> = {
        project_id: newProject.id,
        profile_id: profile.id,
        role: RoleType.ADMIN,
        project_settings: {
          is_favorite:
            projectMembersData?.project_settings.is_favorite || false,
          order: newOrder,
        },
      };

      const { error: settingsError } = await supabaseBrowser
        .from("project_members")
        .insert(newProjectMembersData);

      if (settingsError) {
        setError(settingsError.message);
        setLoading(false);
        console.error(settingsError);
        return;
      }

      // Update local state without needing to reorder everything
      const updatedProjects = [
        ...projects.slice(0, currentIndex + (position === "below" ? 1 : 0)),
        newProject,
        ...projects.slice(currentIndex + (position === "below" ? 1 : 0)),
      ];

      setProjects(updatedProjects);
    }

    setLoading(false);
    onClose();
  };

  return (
    <Dialog size="xs" onClose={onClose}>
      <>
        <DialogHeader>
          <DialogTitle>Add project</DialogTitle>
          <button className="p-2 rounded-full hover:bg-text-100 transition">
            <CircleHelp strokeWidth={1.5} className="w-5 h-5 text-text-500" />
          </button>
        </DialogHeader>

        <form
          onSubmit={(ev) => {
            if (aboveBellow) {
              handleAddProjectAboveBellow(ev, aboveBellow);
            } else {
              handleAddProject(ev);
            }
          }}
        >
          <div className="p-4 pb-8 space-y-4">
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
              className="h-12"
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

            <div className="space-y-2 pt-3">
              <div className="space-y-1">
                <p className="block font-bold text-text-700">View</p>
                <ul className="flex gap-4 items-center">
                  {projectViewsToSelect.map((v) => (
                    <li
                      key={v.id}
                      tabIndex={0}
                      className={`flex items-center justify-between cursor-pointer h-12 rounded-full px-4 border w-full ${
                        projectData.settings.view === v.name
                          ? "border-primary-500"
                          : "border-text-200"
                      } focus:outline-none hover:bg-text-50`}
                      onClick={() =>
                        setProjectData({
                          ...projectData,
                          settings: { ...projectData.settings, view: v.name },
                        })
                      }
                    >
                      <div className="flex items-center gap-2">
                        {v.icon}
                        <span className="text-text-700">{v.name}</span>
                      </div>
                      <div>
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
                          priority={"P3"}
                          is_completed={projectData.settings.view === v.name}
                          playSound={false}
                          disabled
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-text-500 text-xs">
                Layout is synced between teammates in shared projects. Learn
                more.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-red-500 p-4 pt-0 text-center text-xs whitespace-normal">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-4 select-none border-t border-text-200 p-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-600 bg-text-200 rounded hover:bg-text-300 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-text-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-primary-500 rounded hover:bg-primary-700 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-primary-600"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner color="white" />

                  <span>Adding...</span>
                </div>
              ) : (
                "Add"
              )}
            </button>
          </div>
        </form>
      </>
    </Dialog>
  );
};

export default AddEditProject;
