import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useAuthProvider } from "@/context/AuthContext";
import Dropdown from "../ui/Dropdown";

type Workspace = {
  team_id: number | null;
  name: string;
  avatar_url: string | null;
};

interface WorkspaceSelectorProps {
  currentWorkspace?: Workspace;
  workspaces: Workspace[];
  onSelect: (workspace: Workspace) => void;
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
  currentWorkspace,
  workspaces,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuthProvider();

  const triggerRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       selectRef.current &&
  //       !selectRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < workspaces.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === "Enter" && highlightedIndex !== -1) {
      e.preventDefault();
      onSelect(workspaces[highlightedIndex]);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={selectRef}>
      <label
        htmlFor={"workspace"}
        className="block font-semibold text-text-700 mb-2 pl-4 md:pl-0"
      >
        Teamspace
      </label>

      <Dropdown
        title="Teamspace"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        triggerRef={triggerRef}
        Label={({ onClick }) => (
          <div
            ref={triggerRef}
            className="flex items-center justify-between w-full h-10 border-b md:border border-text-300 md:rounded-lg md:cursor-pointer hover:border-text-400 px-4 py-2 pr-3 md:focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-primary-300 focus:border-text-300"
            onClick={onClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={"workspace"}
            aria-controls="listbox"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-5 h-5 min-w-5 min-h-5 bg-primary-500 rounded-lg flex items-center justify-center">
                {currentWorkspace?.team_id == null ? (
                  <Image
                    src={profile?.avatar_url || ""}
                    alt={currentWorkspace?.name || ""}
                    width={20}
                    height={20}
                    className="rounded-md object-cover max-w-[20px] max-h-[20px]"
                  />
                ) : (
                  <>
                    {currentWorkspace?.avatar_url ? (
                      <Image
                        src={currentWorkspace?.avatar_url}
                        alt={currentWorkspace?.name}
                        width={20}
                        height={20}
                        className="rounded-md object-cover max-w-[20px] max-h-[20px]"
                      />
                    ) : (
                      <span className="text-surface text-[10px] font-medium">
                        {currentWorkspace?.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </>
                )}
              </div>
              <span className="truncate text-text-900">
                {currentWorkspace?.name}
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-text-400 flex-shrink-0 ml-2" />
          </div>
        )}
        items={workspaces.map((workspace, index) => ({
          id: index,
          label: workspace.name,
          className: "py-2",
          onClick: () => {
            onSelect(workspace);
          },
          icon: (
            <div className="w-5 h-5 min-w-5 min-h-5 bg-primary-500 rounded-lg flex items-center justify-center">
              {workspace?.team_id == null ? (
                <Image
                  src={profile?.avatar_url || ""}
                  alt={workspace?.name || ""}
                  width={20}
                  height={20}
                  className="rounded-md object-cover max-w-[20px] max-h-[20px]"
                />
              ) : (
                <>
                  {workspace?.avatar_url ? (
                    <Image
                      src={workspace?.avatar_url}
                      alt={workspace?.name}
                      width={20}
                      height={20}
                      className="rounded-md object-cover max-w-[20px] max-h-[20px]"
                    />
                  ) : (
                    <span className="text-surface text-[10px] font-medium">
                      {workspace?.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </>
              )}
            </div>
          ),
          rightContent: currentWorkspace?.team_id === workspace.team_id && (
            <Check
              strokeWidth={1.5}
              className="w-4 h-4 text-primary-600 flex-shrink-0"
            />
          ),
        }))}
        contentWidthClass="w-full max-w-sm py-1 max-h-72 overflow-y-auto"
      />
    </div>
  );
};

export default WorkspaceSelector;
