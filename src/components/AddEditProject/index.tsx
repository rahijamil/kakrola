"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { Dialog, DialogHeader, DialogTitle } from "../ui";
import { ProjectType } from "@/types/project";
import LayoutView from "../LayoutView";
import {
  Check,
  ChevronDown,
  CircleHelp,
  SquareGanttChart,
  User,
} from "lucide-react";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { useAuthProvider } from "@/context/AuthContext";
import Spinner from "../ui/Spinner";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import WorkspaceSelector from "./WorkspaceSelector";
import CustomSelect from "../ui/CustomSelect";

const colors = [
  {
    id: 1,
    label: "Red",
    value: "red-500",
    color: "#ef4444",
  },
  {
    id: 2,
    label: "Orange",
    value: "orange-500",
    color: "#f97316",
  },
  {
    id: 3,
    label: "Yellow",
    value: "yellow-500",
    color: "#eab308",
  },
  {
    id: 4,
    label: "Green",
    value: "green-500",
    color: "#22c55e",
  },
  {
    id: 5,
    label: "Blue",
    value: "blue-500",
    color: "#3b82f6",
  },
  {
    id: 6,
    label: "Indigo",
    value: "indigo-500",
    color: "#6366f1",
  },
  {
    id: 7,
    label: "Violet",
    value: "violet-500",
    color: "#8b5cf6",
  },
  {
    id: 8,
    label: "Purple",
    value: "purple-500",
    color: "#a855f7",
  },
  {
    id: 9,
    label: "Pink",
    value: "pink-500",
    color: "#ec4899",
  },
  {
    id: 10,
    label: "Teal",
    value: "teal-500",
    color: "#14b8a6",
  },
  {
    id: 11,
    label: "Gray",
    value: "gray-500",
    color: "#64748b",
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
  const { projects, setProjects, teams, setTeams } =
    useTaskProjectDataProvider();

  const [projectData, setProjectData] = useState<Omit<ProjectType, "id">>(
    project && !aboveBellow
      ? project
      : {
          team_id: workspaceId || null,
          profile_id: profile?.id || "",
          name: "",
          slug: "",
          color: "gray-500",
          is_favorite: false,
          view: "List",
          updated_at: new Date().toISOString(),
          order: Math.max(...projects.map((p) => p.order), 0) + 1,
          is_archived: false,
        }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddProject = async (ev: FormEvent) => {
    ev.preventDefault();

    if (!projectData.name) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    if (project?.id) {
      const data: Partial<ProjectType> = {};
      const fields = ["name", "color", "is_favorite", "view"] as const;

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
    } else {
      const { data, error } = await supabaseBrowser
        .from("projects")
        .insert(projectData)
        .select()
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setProjects((projects) => {
        return [...projects, data];
      });
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

    if (project) {
      const currentIndex = projects.findIndex((p) => p.id === project.id);

      const prevOrder =
        position === "above"
          ? projects[currentIndex - 1]?.order || project.order - 1
          : project.order;

      const nextOrder =
        position === "below"
          ? projects[currentIndex + 1]?.order || project.order + 1
          : project.order;

      const newOrder = (prevOrder + nextOrder) / 2;

      // Insert the new project
      const { data: newProject, error: insertError } = await supabaseBrowser
        .from("projects")
        .insert({
          ...projectData,
          order: newOrder,
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
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

  const [workspaces, setWorkspaces] = useState<
    { team_id: number | null; name: string; avatar_url: string }[]
  >([]);

  useEffect(() => {
    setWorkspaces([
      {
        team_id: null,
        name: "My Projects",
        avatar_url: profile?.avatar_url || "",
      },
    ]);

    teams.forEach((team) => {
      if (!workspaces.some((w) => w.team_id === team.id)) {
        setWorkspaces((prev) => [
          ...prev,
          {
            team_id: team.id,
            name: team.name,
            avatar_url: team.avatar_url,
          } as {
            team_id: number;
            name: string;
            avatar_url: string;
          },
        ]);
      }
    });

    return () => {
      setWorkspaces([]);
    };
  }, [teams, profile?.avatar_url]);

  return (
    <Dialog size="xs" onClose={onClose}>
      <>
        <DialogHeader>
          <DialogTitle>Add project</DialogTitle>
          <button className="p-2 rounded-md hover:bg-gray-100 transition">
            <CircleHelp strokeWidth={1.5} className="w-5 h-5 text-gray-500" />
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
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  name: e.target.value,
                  slug: `${e.target.value
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]+/g, "")
                    .toLowerCase()}-${Date.now()}`,
                })
              }
              required
              autoFocus
              label="Name"
              Icon={SquareGanttChart}
              placeholder="Project name"
            />

            <CustomSelect
              id="color"
              label="Color"
              options={colors}
              value={projectData?.color}
              onChange={({ target: { value } }) =>
                setProjectData({ ...projectData, color: value })
              }
              placeholder="Select a color"
            />

            <WorkspaceSelector
              currentWorkspace={
                workspaces.find((w) => w.team_id === projectData?.team_id) ||
                workspaces[0]
              }
              workspaces={workspaces}
              onSelect={(workspace) =>
                setProjectData({ ...projectData, team_id: workspace.team_id })
              }
            />

            <div>
              <button
                className="flex items-center space-x-2 w-full"
                type="button"
                onClick={() =>
                  setProjectData((prev) => ({
                    ...prev,
                    is_favorite: !prev.is_favorite,
                  }))
                }
              >
                <ToggleSwitch
                  checked={projectData.is_favorite}
                  onCheckedChange={(value) =>
                    setProjectData((prev) => ({ ...prev, is_favorite: value }))
                  }
                />

                <span className="">Add to favorites</span>
              </button>
            </div>

            <div className="space-y-2 pt-3">
              <LayoutView
                view={projectData.view}
                setView={(value) =>
                  setProjectData({ ...projectData, view: value })
                }
              />
              <p className="text-gray-500 text-xs">
                Layout is synced between teammates in shared projects. Learn
                more.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-red-500 p-4 pt-0 text-center text-xs">{error}</p>
          )}

          <div className="flex justify-end gap-4 select-none border-t border-gray-200 p-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-indigo-600"
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
