import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ChevronRight, Plus } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ProjectItem from "../ProjectItem";
import { usePathname } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

const MyProjects = ({
  setShowAddProjectModal,
}: {
  setShowAddProjectModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { projects, setProjects } = useTaskProjectDataProvider();
  const pathname = usePathname();
  const [showProjects, setShowProjects] = useState(true);

  const handleOnDragEnd = async (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const reorderedProjects = [...projects];
    const [movedProject] = reorderedProjects.splice(source.index, 1);
    reorderedProjects.splice(destination.index, 0, movedProject);

    // Calculate new order values
    const newOrderProjects = reorderedProjects.map((project, index) => ({
      ...project,
      order: index + 1, // Set order based on index
    }));

    // Update local state
    setProjects(newOrderProjects);

    try {
      // Update Supabase
      const updatePromises = newOrderProjects.map((project) =>
        supabaseBrowser
          .from("projects")
          .update({ order: project.order })
          .eq("id", project.id)
      );

      const results = await Promise.all(updatePromises);

      // Check for errors
      results.forEach(({ error }, index) => {
        if (error) {
          console.error(
            `Error updating project order for project ID ${newOrderProjects[index].id}:`,
            error
          );
          // Optionally, revert state changes if needed
          // setProjects(projects); // or handle error state
        }
      });
    } catch (err) {
      console.error("Error updating project order:", err);
      // Optionally, revert state changes if needed
      // setProjects(projects); // or handle error state
    }
  };

  return (
    <div className="mt-4 px-2">
      <div className="w-full flex items-center justify-between p-1 text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
        <span className="font-medium">My Projects</span>

        <div className="opacity-0 group-hover:opacity-100 transition flex items-center">
          <button
            className="p-1 hover:bg-gray-100 rounded-md transition"
            onClick={() => setShowAddProjectModal(true)}
          >
            <Plus
              strokeWidth={1.5}
              className={`w-[18px] h-[18px] transition-transform`}
            />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded-md transition"
            onClick={() => setShowProjects(!showProjects)}
          >
            <ChevronRight
              strokeWidth={1.5}
              className={`w-[18px] h-[18px] transition-transform transform ${
                showProjects ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {showProjects && (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="projects">
            {(provided) => {
              return (
                <ul
                  className="mt-1 ml-2 space-y-1"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {projects.map((project, index) => (
                    <Draggable
                      key={project.id}
                      draggableId={project.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging && "bg-white"}`}
                          >
                            <ProjectItem
                              project={project}
                              pathname={pathname}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        );
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              );
            }}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default MyProjects;
