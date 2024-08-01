import React, { FormEvent, useState } from "react";
import { Dialog, DialogHeader, DialogTitle, Input } from "./ui";
import { ProjectType } from "@/types/project";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import LayoutView from "./LayoutView";
import { ViewTypes } from "@/types/viewTypes";

const AddProject = ({ onClose }: { onClose: () => void }) => {
  const { setProjects } = useTaskProjectDataProvider();

  const [projectData, setProjectData] = useState<ProjectType>({
    id: 0,
    name: "",
    slug: "",
    icon: null,
    color: "gray",
  });

  const [view, setView] = useState<ViewTypes["view"]>("List");

  const handleAddProject = (ev: FormEvent) => {
    ev.preventDefault();

    setProjects((prev) => [...prev, { ...projectData, id: prev.length + 1 }]);

    onClose();
  };

  return (
    <Dialog>
      <>
        <DialogHeader>
          <DialogTitle>Add project</DialogTitle>
          <button className="p-2 rounded-md hover:bg-gray-100 transition">
            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-500" />
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
                  slug: e.target.value.toLowerCase(),
                })
              }
              required
              autoFocus
              label="Name"
            />
            {/* <Input
              type="color"
              label="Color"
              value={projectData?.color}
              onChange={(e) =>
                setProjectData({ ...projectData, color: e.target.value })
              }
              required
            />

            <Input
              type="text"
              label="Workspace"
              value={projectData?.color}
              onChange={(e) =>
                setProjectData({ ...projectData, color: e.target.value })
              }
              required
            />
            <div>Add to favorites</div> */}

            <div className="space-y-2 pt-3">
              <LayoutView view={view} setView={setView} />
              <p className="text-gray-500 text-xs">
                Layout is synced between teammates in shared projects. Learn
                more.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 select-none border-t border-gray-200 p-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 text-xs font-semibold"
            >
              Add
            </button>
          </div>
        </form>
      </>
    </Dialog>
  );
};

export default AddProject;
