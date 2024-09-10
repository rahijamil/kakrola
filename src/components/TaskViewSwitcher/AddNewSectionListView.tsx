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
    <>
      <div
        className={`flex items-center gap-2 ${showAddSection ? "pointer-events-none opacity-0 cursor-default" : "cursor-pointer opacity-0 hover:opacity-100"}`}
        onClick={() => setShowAddSection(section.id)}
      >
        <div className="flex-1 bg-primary-400 h-[1px]"></div>
        <div className="font-semibold text-primary-600 text-sm">Add section</div>
        <div className="flex-1 bg-primary-500 h-[1px]"></div>
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
            className="border border-text-200 focus:outline-none focus:border-text-400 w-full rounded px-2 py-1 font-semibold"
            autoFocus
          />

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-2 py-[6px] text-xs text-white bg-primary-500 rounded-lg hover:bg-primary-700 disabled:bg-primary-600 disabled:cursor-not-allowed transition disabled:opacity-50"
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
              className="px-3 py-[6px] text-xs text-text-600 transition bg-text-200 hover:bg-text-100 rounded-lg disabled:opacity-50 disabled:hover:bg-text-100 disabled:cursor-not-allowed"
              disabled={sectionAddLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default AddNewSectionListView;
