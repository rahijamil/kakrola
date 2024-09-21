import { useSidebarDataProvider } from "@/context/SidebarDataContext";
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
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SidebarPlusDropdown from "./SidebarPlusDropdown";
import useScreen from "@/hooks/useScreen";
import { PageType } from "@/types/pageTypes";
import PageItem from "./PageItem";
import { ChannelType } from "@/types/channel";
import ChannelItem from "./ChannelItem";

const TeamProjects = ({
  team,
  sidebarWidth,
}: {
  team: TeamType;
  sidebarWidth: number;
}) => {
  const { projects, pages, channels, sidebarLoading } =
    useSidebarDataProvider();
  const pathname = usePathname();
  const [showProjects, setShowProjects] = useState(true);
  const [teamProjects, setTeamProjects] = useState<ProjectType[]>([]);
  const [teamPages, setTeamPages] = useState<PageType[]>([]);
  const [teamChannels, setTeamChannels] = useState<ChannelType[]>([]);

  const [isDragDisabled, setIsDragDisabled] = useState(false);

  useEffect(() => {
    if (team) {
      setTeamProjects(projects.filter((p) => p.team_id === team.id));
      setTeamPages(pages.filter((p) => p.team_id === team.id));
      setTeamChannels(channels.filter((p) => p.team_id === team.id));
    }
  }, [team, projects, pages]);

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

  const { screenWidth } = useScreen();
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddChannel, setShowAddChannel] = useState(false);

  return (
    <>
      <div>
        {sidebarLoading ? (
          <Skeleton width={20} borderRadius={9999} />
        ) : (
          <div
            onTouchStart={(ev) =>
              ev.currentTarget.classList.add("bg-primary-50")
            }
            onTouchEnd={(ev) =>
              ev.currentTarget.classList.remove("bg-primary-50")
            }
            className="relative text-text-600 md:hover:bg-primary-50 rounded-lg transition flex items-center justify-between pr-1"
          >
            <Link
              href={`/app/${team.id}`}
              className={`w-full flex items-center justify-between pl-2 py-[7px] gap-1`}
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
                      className="rounded-md"
                    />
                  ) : (
                    <div className="w-5 h-5 min-w-5 min-h-5 bg-primary-500 rounded-md flex items-center justify-center">
                      <span className="text-surface text-[10px] font-bold">
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

            <div
              className={`${
                screenWidth > 768 &&
                !showAddProjectModal &&
                !showAddChannel &&
                "opacity-0 group-hover:opacity-100"
              } transition flex items-center`}
            >
              <SidebarPlusDropdown
                teamId={team.id}
                modalStates={{
                  setShowAddProjectModal,
                  setShowAddChannel,
                  showAddProjectModal,
                  showAddChannel,
                }}
              />

              <button
                className="p-1 hover:bg-primary-100 rounded-lg transition duration-150"
                onClick={() => setShowProjects(!showProjects)}
              >
                <ChevronRight
                  strokeWidth={1.5}
                  className={`w-[18px] h-[18px] transition-transform duration-150 transform ${
                    showProjects ? "rotate-90" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        )}

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
                    <ul ref={provided.innerRef} {...provided.droppableProps}>
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

                      {teamPages.map((page, index) => (
                        <Draggable
                          key={page.id}
                          draggableId={page.id.toString()}
                          index={index}
                          isDragDisabled={isDragDisabled}
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
                                <PageItem
                                  page={page}
                                  pathname={pathname}
                                  isDragging={snapshot.isDragging}
                                  setIsDragDisabled={setIsDragDisabled}
                                />
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}

                      {teamChannels.map((channel, index) => (
                        <Draggable
                          key={channel.id}
                          draggableId={channel.id.toString()}
                          index={index}
                          isDragDisabled={isDragDisabled}
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
                                <ChannelItem
                                  channel={channel}
                                  pathname={pathname}
                                  isDragging={snapshot.isDragging}
                                  setIsDragDisabled={setIsDragDisabled}
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

        <div className="space-y-2">
          {sidebarLoading &&
            [1, 2, 3, 4, 5].map((_i, index) => (
              <div key={_i} className="flex items-center gap-2">
                <Skeleton height={28} width={28} borderRadius={9999} />
                <Skeleton height={20} borderRadius={9999} width={150} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default TeamProjects;
