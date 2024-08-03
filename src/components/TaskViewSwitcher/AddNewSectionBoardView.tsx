import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { SectionType, Task } from "@/types/project";
import React, { FormEvent, useState } from "react";

const AddNewSectionBoardView = ({
  sections,
  setShowUngroupedAddSection,
  columnId,
  columns,
  index,
}: {
  sections: SectionType[];
  setShowUngroupedAddSection: React.Dispatch<React.SetStateAction<boolean>>;
  columnId: string;
  columns: { id: string; title: string; tasks: Task[] }[];
  index: number;
}) => {
  const [showAddSection, setShowAddSection] = useState<string | null>(null);
  const [mouseOnAddSection, setMouseOnAddSection] = useState<boolean>(false);
  const [newSectionName, setNewSectionName] = useState<string>("");

  const { activeProject, setSections } = useTaskProjectDataProvider();

  const handleAddSection = (
    ev: FormEvent<HTMLFormElement>,
    positionIndex: number | null
  ) => {
    ev.preventDefault();

    if (activeProject && newSectionName.trim()) {
      const newSection: SectionType = {
        name: newSectionName.trim(),
        id: sections.length + 1,
        project: activeProject,
      };

      setSections((prevSections) => {
        if (positionIndex !== null) {
          // Insert the new section at the specified position
          const updatedSections = [...prevSections];
          updatedSections.splice(positionIndex, 0, newSection);
          return updatedSections;
        } else {
          // Add the new section at the beginning
          return [newSection, ...prevSections];
        }
      });

      setNewSectionName("");
      setShowAddSection(null);
      setShowUngroupedAddSection(false);
    }
  };

  return (
    <div>
      {showAddSection !== columnId && (
        <>
          {columns.length - 1 == index ? (
            <div className="bg-gray-100 p-3 py-2 rounded-lg min-w-[300px] h-fit ml-5">
              <button
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1 w-full group py-1 whitespace-nowrap"
                onClick={() => setShowAddSection(columnId)}
                onMouseOver={() => setMouseOnAddSection(true)}
                onMouseOut={() => setMouseOnAddSection(false)}
              >
                {mouseOnAddSection ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M19.5 20a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15zM18 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12zm-6 3a.5.5 0 0 0-.5.5v2h-2a.5.5 0 0 0-.492.41L9 12a.5.5 0 0 0 .5.5h2v2a.5.5 0 0 0 .41.492L12 15a.5.5 0 0 0 .5-.5v-2h2a.5.5 0 0 0 .492-.41L15 12a.5.5 0 0 0-.5-.5h-2v-2a.5.5 0 0 0-.41-.492zm7.5-6a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M19.5 20a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15zM18 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12zm0 1H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-6 2a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 12 9zm7.5-6a.5.5 0 0 1 0 1h-15a.5.5 0 0 1 0-1h15z"
                    ></path>
                  </svg>
                )}

                <span>Add section</span>
              </button>
            </div>
          ) : (
            <div className="relative w-3 h-full group cursor-pointer">
              <div
                className="absolute -left-[36px] flex-col items-center gap-2 hidden group-hover:flex cursor-pointer transition whitespace-nowrap h-full"
                onClick={() => setShowAddSection(columnId)}
              >
                <div className="flex-1 bg-gray-400 w-[1px]"></div>
                <div className="font-bold text-gray-600 text-sm">
                  Add section
                </div>
                <div className="flex-1 bg-gray-500 w-[1px]"></div>
              </div>
            </div>
          )}
        </>
      )}

      {showAddSection == columnId && (
        <form
          className="space-y-2 min-w-[300px] mx-5"
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
              className="px-2 py-[6px] text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-600 disabled:cursor-not-allowed transition disabled:opacity-50"
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

export default AddNewSectionBoardView;
