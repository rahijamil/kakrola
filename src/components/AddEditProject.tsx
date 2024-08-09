import React, { FormEvent, useState } from "react";
import { Dialog, DialogHeader, DialogTitle } from "./ui";
import { ProjectType } from "@/types/project";
import LayoutView from "./LayoutView";
import { CircleHelp, SquareGanttChart } from "lucide-react";
import { ToggleSwitch } from "./ui/ToggleSwitch";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { useAuthProvider } from "@/context/AuthContext";
import Spinner from "./ui/Spinner";
import { supabaseBrowser } from "@/utils/supabase/client";

const AddEditProject = ({
  onClose,
  projectForEdit,
}: {
  onClose: () => void;
  projectForEdit?: ProjectType;
}) => {
  const { profile } = useAuthProvider();

  const [projectData, setProjectData] = useState<ProjectType>(
    projectForEdit
      ? projectForEdit
      : {
          team_id: null,
          profile_id: profile?.id || "",
          name: "",
          slug: "",
          icon_url: "",
          is_favorite: false,
          view: "List",
          updated_at: new Date().toISOString(),
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

    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    if (projectForEdit?.id) {
      const data: Partial<ProjectType> = {};

      if (projectData.name !== projectForEdit.name) {
        data["name"] = projectData.name;
      }

      if (projectData.icon_url !== projectForEdit.icon_url) {
        data["icon_url"] = projectData.icon_url;
      }

      if (projectData.is_favorite !== projectForEdit.is_favorite) {
        data["is_favorite"] = projectData.is_favorite;
      }

      if (projectData.view !== projectForEdit.view) {
        data["view"] = projectData.view;
      }

      if (Object.keys(data).length === 0) {
        setLoading(false); // Stop loading
        onClose(); // Close the dialog
        return;
      }

      const { error } = await supabaseBrowser
        .from("projects")
        .update(data)
        .eq("id", projectForEdit.id);
      if (error) {
        setError(error.message); // Set error if any
        setLoading(false); // Stop loading
        return;
      }
    } else {
      const { error } = await supabaseBrowser
        .from("projects")
        .insert(projectData);
      if (error) {
        setError(error.message); // Set error if any
        setLoading(false); // Stop loading
        return;
      }
    }

    setLoading(false); // Stop loading
    onClose(); // Close the dialog
  };

  return (
    <Dialog size="xs">
      <>
        <DialogHeader>
          <DialogTitle>Add project</DialogTitle>
          <button className="p-2 rounded-md hover:bg-gray-100 transition">
            <CircleHelp strokeWidth={1.5} className="w-5 h-5 text-gray-500" />
          </button>
        </DialogHeader>

        <form onSubmit={handleAddProject}>
          <div className="p-4 pb-8 space-y-4">
            <Input
              type="text"
              value={projectData?.name}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  name: e.target.value,
                  slug: e.target.value.replace(/\s+/g, "-").toLowerCase(),
                })
              }
              required
              autoFocus
              label="Name"
              Icon={SquareGanttChart}
              placeholder="Project name"
            />
            {/* <Input
              type="color"
              label="Color"
              value={projectData?.color}
              onChange={(e) =>
                setProjectData({ ...projectData, color: e.target.value })
              }
              required
            /> */}

            <div>
              <label htmlFor="workspace" className="font-bold">
                Workspace
              </label>
              <Select
                // label="Workspace"
                value={projectData.team_id ? "Shared" : "Personal"}
                onChange={(e) =>
                  setProjectData({
                    ...projectData,
                    team_id: parseInt(e.target.value),
                  })
                }
              >
                <option value={0}>Personal</option>
                <option value={1}>Shared</option>
              </Select>
            </div>

            <div>
              <button
                className="flex items-center space-x-2"
                type="button"
                onClick={() =>
                  setProjectData((prev) => ({
                    ...prev,
                    isFavorite: !prev.is_favorite,
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
