import { useAuthProvider } from "@/context/AuthContext";
import { ProjectType, SectionType, TaskType } from "@/types/project";
import { supabaseBrowser } from "@/utils/supabase/client";
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Spinner from "../ui/Spinner";
import { v4 as uuidv4 } from "uuid";

const AddNewSectionBoardView = ({
  setShowUngroupedAddSection,
  showUngroupedAddSection,
  columnId,
  columns,
  index,
  project,
  sections,
  setSections,
}: {
  setShowUngroupedAddSection: React.Dispatch<React.SetStateAction<boolean>>;
  showUngroupedAddSection?: boolean;
  columnId?: string;
  columns?: { id: string; title: string; tasks: TaskType[] }[];
  index?: number;
  project: ProjectType | null;
  sections: SectionType[];
  setSections: (updatedSections: SectionType[]) => void;
}) => {
  const [showAddSection, setShowAddSection] = useState<string | null>(null);
  const [mouseOnAddSection, setMouseOnAddSection] = useState<boolean>(false);
  const [newSectionName, setNewSectionName] = useState<string>("");

  const { profile } = useAuthProvider();

  const [loading, setLoading] = useState(false);

  const handleAddSection = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!profile?.id || !newSectionName.trim()) {
      return;
    }

    setLoading(true);

    let newOrder: number;

    if (sections.length > 0) {
      if (index !== undefined && index < sections.length) {
        // If inserting after an existing section
        const currentOrder = sections[index].order;
        const nextOrder =
          index < sections.length - 1
            ? sections[index + 1].order
            : currentOrder + 1;
        newOrder = (currentOrder + nextOrder) / 2;
      } else {
        // If adding to the end
        newOrder = Math.max(...sections.map((s) => s.order)) + 1;
      }
    } else {
      // If it's the first section
      newOrder = 1;
    }

    console.log("Calculated newOrder:", newOrder);

    const newSection: SectionType = {
      id: uuidv4(), // temporary placeholder ID
      name: newSectionName.trim(),
      project_id: project?.id || null,
      profile_id: profile.id,
      is_collapsed: false,
      is_inbox: project ? false : true,
      is_archived: false,
      order: newOrder,
      updated_at: new Date().toISOString(),
    };

    // Optimistically update the state
    const updatedSections = [
      ...sections.slice(0, index ?? sections.length),
      newSection,
      ...sections.slice(index ?? sections.length),
    ].sort((a, b) => a.order - b.order);

    setSections(updatedSections);
    setLoading(false);

    try {
      const { data, error } = await supabaseBrowser
        .from("sections")
        .insert([
          {
            name: newSection.name,
            project_id: newSection.project_id,
            profile_id: newSection.profile_id,
            is_collapsed: newSection.is_collapsed,
            is_inbox: newSection.is_inbox,
            order: newOrder,
            updated_at: newSection.updated_at,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update section with actual ID from database
      setSections(
        sections
          .map((s) =>
            s.id === newSection.id ? { ...newSection, id: data.id } : s
          )
          .sort((a, b) => a.order - b.order)
      );
    } catch (error) {
      console.error("Error inserting section:", error);
      // Revert the optimistic update if there's an error
      setSections(sections);
    } finally {
      setNewSectionName("");
      setShowAddSection(null);
      setShowUngroupedAddSection(false);
      setLoading(false);
    }
  };

  return (
    <div>
      {(columnId ? showAddSection !== columnId : !showUngroupedAddSection) && (
        <>
          {(columns ? columns.length - 1 == index : true) ? (
            <div className="bg-text-50 p-3 py-2 rounded-lg min-w-[300px] h-fit ml-5">
              <button
                className="text-text-500 hover:text-primary-600 flex items-center gap-2 w-full group py-1 whitespace-nowrap"
                onClick={() =>
                  columnId
                    ? setShowAddSection(columnId)
                    : setShowUngroupedAddSection(true)
                }
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
                className="absolute -left-[1px] flex-col items-center gap-2 hidden group-hover:flex cursor-pointer transition whitespace-nowrap h-full w-3"
                onClick={() =>
                  columnId
                    ? setShowAddSection(columnId)
                    : setShowUngroupedAddSection(true)
                }
              >
                <div className="flex-1 bg-primary-400 w-[1px]"></div>
                <div className="font-medium text-primary-600 text-sm">
                  Add section
                </div>
                <div className="flex-1 bg-primary-500 w-[1px]"></div>
              </div>
            </div>
          )}
        </>
      )}

      {(columnId ? showAddSection === columnId : showUngroupedAddSection) && (
        <form
          className="space-y-2 min-w-[300px] mx-5"
          onSubmit={(ev) => handleAddSection(ev)}
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
              className="px-2 py-[6px] text-xs text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-600 disabled:cursor-not-allowed transition disabled:opacity-50"
              disabled={!newSectionName.trim() || loading}
            >
              {loading ? (
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
              onClick={() => {
                setShowAddSection(null);
                setShowUngroupedAddSection(false);
              }}
              className="px-3 py-[6px] text-xs text-text-600 transition bg-text-50 hover:bg-primary-50 rounded-lg disabled:opacity-50 disabled:hover:bg-primary-50 disabled:cursor-not-allowed"
              disabled={loading}
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
