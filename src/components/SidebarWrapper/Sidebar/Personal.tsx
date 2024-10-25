import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { ChevronRight, Plus } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
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
import { useAuthProvider } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SidebarPlusDropdown from "./SidebarPlusDropdown";
import useScreen from "@/hooks/useScreen";
import PageItem from "./PageItem";

const Personal = ({ sidebarWidth }: { sidebarWidth: number }) => {
  const { profile } = useAuthProvider();
  const {
    projects: allProjects,
    setProjects,
    sidebarLoading,
    pages,
    personalMembers,
  } = useSidebarDataProvider();
  const pathname = usePathname();
  const [showProjects, setShowProjects] = useState(true);
  const projects = allProjects.filter((p) => !p.team_id);
  const [isDragDisabled, setIsDragDisabled] = useState(false);

  const handleOnDragEnd = async (result: DropResult) => {
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

  const { screenWidth } = useScreen();
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {sidebarLoading ? (
        <Skeleton height={16} width={150} borderRadius={9999} />
      ) : (
        <div
          // className={`flex items-center transition-colors duration-150 font-medium pr-1 md:font-normal w-full border-l-4 group h-9
          //   ${
          //   pathname.startsWith("/app/projects")
          //     ? "md:bg-primary-100 text-text-900 md:border-primary-200"
          //     : "md:hover:bg-primary-50 border-transparent md:hover:border-primary-200 text-text-700"
          // }
          // `}
          className={`flex items-center text-text-700 font-medium md:font-normal w-full group h-9 cursor-pointer md:border-l-4 pr-4 active:bg-text-100 ${
            pathname.startsWith("/app/projects")
              ? "md:bg-primary-100 text-text-900 md:border-primary-200"
              : "md:hover:bg-primary-50 border-transparent md:hover:border-primary-200 text-text-700"
          }`}
          onClick={() => setShowProjects(!showProjects)}
          onTouchStart={(ev) => ev.currentTarget.classList.add("bg-text-100")}
          onTouchEnd={(ev) => ev.currentTarget.classList.remove("bg-text-100")}
          data-state="personal"
        >
          <div
            className={`w-full flex items-center justify-between py-2 pl-4 gap-1`}
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
                <span
                  className={`font-medium text-xs transition duration-150 overflow-hidden whitespace-nowrap text-ellipsis`}
                >
                  Personal
                </span>
              </div>
              {projects.length > 3 && (
                <span className="bg-text-300 text-text-700 px-1 py-[1px] rounded-lg uppercase text-[11px] whitespace-nowrap font-medium">
                  Used: {projects.length}/{5}
                </span>
              )}
            </div>
          </div>

          <div
            className={`${
              screenWidth > 768 &&
              !showAddProjectModal &&
              !isOpen &&
              "opacity-0 group-data-[state=personal]:group-hover:opacity-100"
            } transition flex items-center`}
            onClick={(ev) => ev.stopPropagation()}
          >
            {/* <button
              // className="p-1 hover:bg-primary-100 rounded-lg transition duration-150"
              onClick={() => setShowProjects(!showProjects)}
            >
              <ChevronRight
                strokeWidth={1.5}
                className={`w-[18px] h-[18px] transition-transform duration-150 transform ${
                  showProjects ? "rotate-90" : ""
                }`}
              />
            </button> */}

            <SidebarPlusDropdown
              modalStates={{
                setShowAddProjectModal,
                showAddProjectModal,
              }}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>
        </div>
      )}

      {showProjects && (
        <motion.div

        // className="bg-text-100 dark:bg-surface md:bg-transparent md:dark:bg-transparent md:rounded-none overflow-hidden"
        >
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="projects">
              {(provided) => {
                return (
                  <ul ref={provided.innerRef} {...provided.droppableProps}>
                    {personalMembers
                      .sort((a, b) => a.settings.order - b.settings.order)
                      .map((personalMember, index) => {
                        const project = projects
                          .filter((p) => !p.team_id)
                          .find((p) => p.id === personalMember.project_id);
                        if (!project) return null;
                        return (
                          <Draggable
                            key={project.id}
                            draggableId={project.id?.toString()}
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
                                  <ProjectItem
                                    project={project}
                                    pathname={pathname}
                                    isDragging={snapshot.isDragging}
                                    setIsDragDisabled={setIsDragDisabled}
                                  />
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}

                    {personalMembers
                      .sort((a, b) => a.settings.order - b.settings.order)
                      .map((personalMember, index) => {
                        const page = pages
                          .filter((p) => !p.team_id)
                          .find((p) => p.id === personalMember.page_id);
                        if (!page) return null;
                        return (
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
                        );
                      })}

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
              <Skeleton height={16} borderRadius={9999} width={150} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Personal;
