import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { ChevronRight, Ellipsis, Plus } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TeamspaceMoreDropdown from "./TeamspaceMoreDropdown";
import InviteTeamspaceMembers from "./InviteTeamspaceMembers";

const TeamspaceForSidebar = ({
  team,
  sidebarWidth,
  isFirstTeamspace,
}: {
  team: TeamType;
  sidebarWidth: number;
  isFirstTeamspace: boolean;
}) => {
  const { projects, pages, channels, sidebarLoading, teamMembers } =
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
      setTeamChannels(
        channels
          .filter((c) => c.team_id === team.id)
          .sort((a, b) => a.settings.order - b.settings.order)
      );
    }
  }, [team, projects, pages, channels]);

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

  const [isShowTeamspaceMore, setIsShowTeamspaceMore] = useState(false);
  const [isOpenPlusDropdown, setIsOpenPlusDropdown] = useState(false);
  const [showInviteTeamspace, setShowInviteTeamspace] = useState(false);

  return (
    <>
      <div id="joyride_teamspaces">
        {sidebarLoading ? (
          <Skeleton width={20} borderRadius={9999} />
        ) : (
          <div
            className={`flex items-center transition-colors duration-150 font-medium pr-4 md:font-normal w-full md:border-l-4 group h-9 active:bg-text-100 cursor-pointer md:hover:bg-primary-50 border-transparent md:hover:border-primary-200 text-text-700`}
            onClick={() => setShowProjects(!showProjects)}
            onTouchStart={(ev) => ev.currentTarget.classList.add("bg-text-100")}
            onTouchEnd={(ev) =>
              ev.currentTarget.classList.remove("bg-text-100")
            }
            data-state="teamspace"
          >
            <div
              // href={`/app/${team.id}`}
              className={`w-full flex items-center justify-between pl-4 py-[7px] gap-1`}
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
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={team.avatar_url as string} />
                    <AvatarFallback>{team.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`font-medium transition overflow-hidden whitespace-nowrap text-ellipsis`}
                  >
                    {team.name}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`${
                screenWidth > 768 &&
                !showAddProjectModal &&
                !showAddChannel &&
                !isOpenPlusDropdown &&
                !isShowTeamspaceMore &&
                "opacity-0 group-data-[state=teamspace]:group-hover:opacity-100"
              } transition flex items-center`}
              onClick={(ev) => ev.stopPropagation()}
            >
              <TeamspaceMoreDropdown
                team={team}
                isOpen={isShowTeamspaceMore}
                setIsOpen={setIsShowTeamspaceMore}
                setShowInviteTeamspace={setShowInviteTeamspace}
              />
              <SidebarPlusDropdown
                teamId={team.id}
                modalStates={{
                  setShowAddProjectModal,
                  setShowAddChannel,
                  showAddProjectModal,
                  showAddChannel,
                }}
                isOpen={isOpenPlusDropdown}
                setIsOpen={setIsOpenPlusDropdown}
              />
            </div>
          </div>
        )}

        {showProjects && (
          <motion.div

          // className="bg-text-100 dark:bg-surface md:bg-transparent md:dark:bg-transparent md:rounded-none overflow-hidden"
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
                          draggableId={page.id?.toString()}
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

      {showInviteTeamspace && (
        <InviteTeamspaceMembers
          team={team}
          onClose={() => setShowInviteTeamspace(false)}
        />
      )}
    </>
  );
};

export default TeamspaceForSidebar;
