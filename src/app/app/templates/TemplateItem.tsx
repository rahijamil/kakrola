import Dropdown from "@/components/ui/Dropdown";
import { TemplateProjectType } from "@/types/template";
import { Ellipsis, SquareKanban, Trash2 } from "lucide-react";
import React from "react";

const TemplateItem = ({ project }: { project: TemplateProjectType }) => {
  const triggerRef = React.useRef(null);

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-150 border border-text-100 shadow-[1px_1px_8px_rgba(0,0,0,0.1)] hover:shadow-[2px_2px_16px_rgba(0,0,0,0.2)] cursor-pointer relative group w-72 flex flex-col`}
    >
      <div
        className={`w-full flex-1 aspect-video relative flex justify-center items-center bg-${
          project.color.split("-")[0]
        }-50`}
      >
        {/* <Image src={project.preview_image} alt={project.name} fill /> */}

        <span
          className={`text-5xl rounded-full w-20 h-20 flex items-center justify-center bg-${
            project.color.split("-")[0]
          }-200 text-${project.color}`}
          style={{ fontFamily: "fantasy" }}
        >
          #
        </span>
      </div>

      <div className="p-4 gap-4 border-t border-text-100 flex flex-col flex-1">
        <div className="space-y-4 flex-1">
          <h3 className="font-semibold">{project.name}</h3>
          <p className="text-text-500 text-xs line-clamp-4">
            {project.description ||
              "Template for managing the Kakrola project, including tasks for vision..."}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {project.view == "List" ? (
              <>
                <SquareKanban
                  size={20}
                  strokeWidth={1.5}
                  className="-rotate-90"
                />
                <span>List</span>
              </>
            ) : (
              project.view == "Board" && (
                <>
                  <SquareKanban size={20} strokeWidth={1.5} />

                  <span>Board</span>
                </>
              )
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-2 right-2 hidden group-hover:block">
        <Dropdown
          triggerRef={triggerRef}
          Label={({ onClick }) => (
            <button
              ref={triggerRef}
              className={`p-1.5 transition rounded-full ${
                isOpen ? "bg-text-100" : "hover:bg-text-100"
              }`}
              onClick={(ev) => {
                ev.stopPropagation();
                onClick();
              }}
            >
              <Ellipsis strokeWidth={1.5} className="w-5 h-5" />
            </button>
          )}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          items={[
            {
              id: 1,
              label: "Delete",
              icon: <Trash2 size={20} />,
              textColor: "text-red-500",
              onClick: () => console.log("Delete"),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TemplateItem;
