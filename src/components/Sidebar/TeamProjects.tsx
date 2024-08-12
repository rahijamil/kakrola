import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ChevronRight, Plus } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ProjectItem from "./ProjectItem";
import { usePathname } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";
import Image from "next/image";
import { useAuthProvider } from "@/context/AuthContext";
import { TeamType } from "@/types/team";
import { ProjectType } from "@/types/project";
import AddEditProject from "../AddEditProject";

const TeamProjects = ({
  team,
  sidebarWidth,
}: {
  team: TeamType;
  sidebarWidth: number;
}) => {
  const { profile } = useAuthProvider();
  const { projects, teams, setTeams } = useTaskProjectDataProvider();
  const pathname = usePathname();
  const [showProjects, setShowProjects] = useState(true);
  const [teamProjects, setTeamProjects] = useState<ProjectType[]>([]);
  const [teamId, setTeamId] = useState<number | null>(null);

  useEffect(() => {
    if (team) {
      setTeamProjects(projects.filter((p) => p.team_id === team.id));
    }
  }, [team]);

  const handleOnDragEnd = async (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const reorderedTeams = [...teams];
    const [movedTeam] = reorderedTeams.splice(source.index, 1);
    reorderedTeams.splice(destination.index, 0, movedTeam);

    // Calculate new order values
    const newOrderTeams = reorderedTeams.map((team, index) => ({
      ...team,
      order: index + 1, // Set order based on index
    }));

    // Update local state
    setTeams(newOrderTeams);

    try {
      // Update Supabase
      const updatePromises = newOrderTeams.map((team) =>
        supabaseBrowser
          .from("teams")
          .update({ order: team.order })
          .eq("id", team.id)
      );

      const results = await Promise.all(updatePromises);

      // Check for errors
      results.forEach(({ error }, index) => {
        if (error) {
          console.error(
            `Error updating project order for project ID ${newOrderTeams[index].id}:`,
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
                maxWidth: `${sidebarWidth - 80}px`,
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
                <div className="w-5 h-5 min-w-5 min-h-5 bg-indigo-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-[10px] font-medium">
                    {team.name.slice(0, 1).toUpperCase()}
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

          <div className="opacity-0 group-hover:opacity-100 transition flex items-center">
            <button
              className="p-1 hover:bg-gray-100 rounded-md transition"
              onClick={() => setTeamId(team.id)}
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
