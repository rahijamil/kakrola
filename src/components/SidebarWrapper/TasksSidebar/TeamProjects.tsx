import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ChevronRight, Plus } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import ProjectItem from "./ProjectItem";
import { usePathname } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";
import Image from "next/image";
import { TeamType } from "@/types/team";
import { ProjectType } from "@/types/project";
import AddEditProject from "../../AddEditProject";
import Link from "next/link";
import { motion } from "framer-motion";

const TeamProjects = ({
  team,
  sidebarWidth,
}: {
  team: TeamType;
  sidebarWidth: number;
}) => {
  const { projects } = useTaskProjectDataProvider();
  const pathname = usePathname();
  const [showProjects, setShowProjects] = useState(true);
  const [teamProjects, setTeamProjects] = useState<ProjectType[]>([]);
  const [teamId, setTeamId] = useState<number | null>(null);

  useEffect(() => {
    if (team) {
      setTeamProjects(projects.filter((p) => p.team_id === team.id));
    }
  }, [team, projects]);

  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const reorderedProjects = [...teamProjects];
    const [movedProject] = reorderedProjects.splice(source.index, 1);
    reorderedProjects.splice(destination.index, 0, movedProject);

    // Calculate new order values
    const newOrderProjects = reorderedProjects.map((project, index) => ({
      ...project,
      order: index + 1, // Set order based on index
    }));

    // Update local state
    setTeamProjects(newOrderProjects);

    try {
      // Update Supabase
      const updatePromises = newOrderProjects.map((project) =>
        supabaseBrowser
          .from("projects")
          .update({ order: project.order })
          .eq("team_id", team.id)
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
    <>
      <div className="mt-4 px-2">
        <div className="relative text-text-700 hover:bg-primary-50 rounded-lg transition">
          <Link
            href={`/app/${team.id}`}
            className={`w-full flex items-center justify-between pl-2 py-[6px] gap-1`}
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
                  maxWidth: `${sidebarWidth - 80}px`,
                }}
              >
                {team.avatar_url ? (
                  <Image
                    src={team.avatar_url}
                    alt={team.name}
                    width={20}
                    height={20}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="w-5 h-5 min-w-5 min-h-5 bg-primary-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-[10px] font-medium">
                      {team.name?.slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                )}
                <span
                  className={`font-medium transition overflow-hidden whitespace-nowrap text-ellipsis`}
                >
                  {team.name}
                </span>
              </div>
            </div>
          </Link>

          <div className="opacity-0 group-hover:opacity-100 transition flex items-center absolute right-0 top-1/2 -translate-y-1/2">
            <button
              className="p-1 hover:bg-primary-50 rounded-lg transition"
              onClick={() => setTeamId(team.id)}
            >
              <Plus
                strokeWidth={1.5}
                className={`w-[18px] h-[18px] transition-transform`}
              />
            </button>
            <button
              className="p-1 hover:bg-primary-50 rounded-lg transition"
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
          <motion.div
            initial={{ opacity: 0.5, height: 0, y: -10 }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
              transition: { type: "spring" },
            }}
            exit={{ opacity: 0.5, height: 0, y: -10 }}
          >
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="teams">
                {(provided) => {
                  return (
                    <ul
                      className="ml-2"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {teamProjects.map((project, index) => (
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
                                className={`${
                                  snapshot.isDragging && "bg-surface"
                                }`}
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
          </motion.div>
        )}
      </div>

      {teamId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddEditProject
            workspaceId={teamId}
            onClose={() => setTeamId(null)}
          />
        </div>
      )}
    </>
  );
};

export default TeamProjects;
