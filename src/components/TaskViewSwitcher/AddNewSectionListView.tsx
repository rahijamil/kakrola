import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { SectionType } from "@/types/project";
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";

const AddNewSectionListView = ({
  setShowUngroupedAddSection,
  section,
  index,
  setNewSectionName,
  newSectionName,
  handleAddSection,
  setShowAddSection,
  showAddSection
}: {
  setShowUngroupedAddSection: Dispatch<SetStateAction<boolean>>;
  section: SectionType;
  index: number;
  newSectionName: string;
  setNewSectionName: Dispatch<SetStateAction<string>>;
  handleAddSection: (ev: FormEvent<HTMLFormElement>, index: number | null) => void;
  showAddSection: number | null;
  setShowAddSection: Dispatch<SetStateAction<number | null>>;
}) => {
  

  return (
    <div>
      {!showAddSection && (
        <div
          className="flex items-center gap-2 pl-7 opacity-0 hover:opacity-100 cursor-pointer transition"
          onClick={() => setShowAddSection(section.id)}
        >
          <div className="flex-1 bg-gray-400 h-[1px]"></div>
          <div className="font-bold text-gray-600 text-sm">Add section</div>
          <div className="flex-1 bg-gray-500 h-[1px]"></div>
        </div>
      )}

      {showAddSection == section.id && (
        <form
          className="space-y-2 pl-7"
          onSubmit={(ev) => handleAddSection(ev, index + 1)}
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
              className="px-2 py-[6px] text-xs text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-600 disabled:cursor-not-allowed transition disabled:opacity-50"
              disabled={!newSectionName.trim()}
            >
              Add section
            </button>

            <button
              type="button"
              onClick={() => setShowAddSection(null)}
              className="px-3 py-[6px] text-xs text-gray-600 transition bg-gray-100 hover:bg-gray-200 rounded-md"
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
