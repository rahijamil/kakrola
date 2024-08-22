import { TaskType } from "@/types/project";
import React, { Dispatch, FormEvent, SetStateAction } from "react";
import Spinner from "../ui/Spinner";

const AddNewSectionListView = ({
  section,
  index,
  setNewSectionName,
  newSectionName,
  handleAddSection,
  setShowAddSection,
  showAddSection,
  sectionAddLoading,
}: {
  section: {
    id: string;
    title: string;
    tasks: TaskType[];
    is_archived?: boolean;
  };
  index: number;
  newSectionName: string;
  setNewSectionName: Dispatch<SetStateAction<string>>;
  handleAddSection: (ev: FormEvent<HTMLFormElement>, index: number) => void;
  showAddSection: string | number | null;
  setShowAddSection: Dispatch<SetStateAction<string | number | null>>;
  sectionAddLoading: boolean;
}) => {
  return (
    <div>
      <div
        className={`flex items-center gap-2 pl-7 transition ${showAddSection ? "pointer-events-none opacity-0 cursor-default" : "cursor-pointer opacity-0 hover:opacity-100"}`}
        onClick={() => setShowAddSection(section.id)}
      >
        <div className="flex-1 bg-indigo-400 h-[1px]"></div>
        <div className="font-semibold text-indigo-600 text-sm">Add section</div>
        <div className="flex-1 bg-indigo-500 h-[1px]"></div>
      </div>

      {showAddSection == section.id && (
        <form
          className="space-y-2 pl-7"
          onSubmit={(ev) => handleAddSection(ev, index)}
        >
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Name this section"
            className="border border-gray-200 focus:outline-none focus:border-gray-400 w-full rounded px-2 py-1 font-semibold"
            autoFocus
          />

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-2 py-[6px] text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-600 disabled:cursor-not-allowed transition disabled:opacity-50"
              disabled={!newSectionName.trim() || sectionAddLoading}
            >
              {sectionAddLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner color="white" />
                  Adding...
                </div>
              ) : (
                "Add section"
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowAddSection(null)}
              className="px-3 py-[6px] text-xs text-gray-600 transition bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:hover:bg-gray-100 disabled:cursor-not-allowed"
              disabled={sectionAddLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddNewSectionListView;
