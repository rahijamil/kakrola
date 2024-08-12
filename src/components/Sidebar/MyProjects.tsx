import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ChevronRight, Plus } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ProjectItem from "./ProjectItem";
import { usePathname } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";
import Image from "next/image";
import { useAuthProvider } from "@/context/AuthContext";
import AddEditProject from "../AddEditProject";

const MyProjects = ({ sidebarWidth }: { sidebarWidth: number }) => {
  const { profile } = useAuthProvider();
  const { projects: allProjects, setProjects } = useTaskProjectDataProvider();
  const pathname = usePathname();
  const [showProjects, setShowProjects] = useState(true);
  const projects = allProjects.filter((p) => !p.team_id);

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

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  return (
    <>
      <div className="mt-4 px-2">
        <div
          className={`w-full flex items-center justify-between p-1 pl-2 text-gray-700 hover:bg-gray-200 rounded-md transition gap-1`}
        >
          <div
            className={`flex items-center ${
              sidebarWidth > 220 ? "gap-2" : "gap-1"
            }`}
          >
            <div
              className={`flex items-center ${
                sidebarWidth > 220 ? "gap-2" : "gap-1"
              }`}
              style={{
                maxWidth: `${
                  sidebarWidth - (projects.length > 3 ? 150 : 80)
                }px`,
              }}
            >
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || profile.username}
                  width={20}
                  height={20}
                  className="rounded-md"
                />
              ) : (
                <div className="w-5 h-5 min-w-5 min-h-5 bg-black rounded-md"></div>
              )}
              <span
                className={`font-medium transition overflow-hidden whitespace-nowrap text-ellipsis`}
              >
                My Projects
              </span>
            </div>
            {projects.length > 3 && (
              <span className="bg-gray-300 text-gray-700 px-1 py-[1px] rounded-md uppercase text-[11px] whitespace-nowrap font-medium">
                Used: {projects.length}/{5}
              </span>
            )}
          </div>

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
                    className="ml-2"
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

      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddEditProject onClose={() => setShowAddProjectModal(false)} />
        </div>
      )}
    </>
  );
};

export default MyProjects;
