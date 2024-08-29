import { useAuthProvider } from "@/context/AuthContext";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { TaskType } from "@/types/project";
import { Check, ChevronDown, Hash, Inbox } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Input } from "../ui/input";
import "react-loading-skeleton/dist/skeleton.css";
import Dropdown from "../ui/Dropdown";

const ProjectsSelector = ({
  isInbox,
  task,
  setTask,
  isSmall,
  forTaskModal,
}: {
  isInbox?: boolean;
  task: TaskType;
  setTask: Dispatch<SetStateAction<TaskType>>;
  isSmall?: boolean;
  forTaskModal?: boolean;
}) => {
  const { profile } = useAuthProvider();
  const { projects, teams, sections } = useTaskProjectDataProvider();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter projects based on the search query
  const personalProjects = projects.filter(
    (project) =>
      !project.team_id &&
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const teamProjects = teams.map((team) => ({
    team,
    projects: projects.filter(
      (project) =>
        project.team_id === team.id &&
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  // Check if the search query matches "Inbox"
  const inboxMatches = "inbox".includes(searchQuery.toLowerCase());

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const triggerRef = useRef(null);

  return (
    <Dropdown
      triggerRef={triggerRef}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      Label={({ onClick }) =>
        forTaskModal ? (
          <button
            onClick={() => setIsOpen(true)}
            className={`flex items-center justify-between rounded-full cursor-pointer transition p-[6px] px-2 group w-full ${
              isOpen ? "bg-primary-100" : "hover:bg-text-100"
            }`}
          >
            {task.is_inbox ? (
              <div className="flex items-center gap-2 text-xs">
                <Inbox strokeWidth={1.5} className="w-3 h-3" />
                Inbox
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Hash strokeWidth={1.5} className="w-3 h-3" />
                  {projects.find((p) => p.id == task.project_id)?.name}
                </div>
                <div>/</div>
                <div className="flex items-center gap-2">
                  {sections.find((s) => s.id == task.section_id)?.name}
                </div>
              </div>
            )}

            <ChevronDown
              strokeWidth={1.5}
              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition"
            />
          </button>
        ) : (
          <div
            ref={triggerRef}
            className={`flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-full ${
              isOpen ? "bg-text-50" : "hover:bg-text-100"
            }`}
            onClick={onClick}
          >
            <button
              type="button"
              className={`w-full flex items-center text-xs transition-colors text-text-700 gap-2 ${
                isSmall && "max-w-[100px]"
              }`}
            >
              {task.is_inbox ? (
                <Inbox strokeWidth={1.5} className="w-4 h-4" />
              ) : (
                <Hash strokeWidth={1.5} className="w-4 h-4" />
              )}
              <span className="font-bold text-xs truncate">
                {task.project_id
                  ? projects.find((p) => p.id === task.project_id)?.name
                  : "Inbox"}
              </span>
            </button>
            <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
          </div>
        )
      }
      content={
        <div className="text-[13px]">
          <div className="p-2 border-b border-text-200">
            <Input
              howBig="xs"
              fullWidth
              type="text"
              placeholder="Type a project name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto py-1">
            {/* Show Inbox if it matches the search query */}
            {isInbox && inboxMatches && (
              <div
                className="flex items-center px-3 py-1.5 rounded-2xl transition-colors text-text-700 hover:bg-text-100 cursor-pointer"
                onClick={() => {
                  setTask({
                    ...task,
                    project_id: null,
                    is_inbox: true,
                  });
                  onClose();
                }}
              >
                <Inbox strokeWidth={1.5} className="w-4 h-4 mr-3" />
                Inbox
                {task.is_inbox && (
                  <Check strokeWidth={1.5} className="w-4 h-4 ml-auto" />
                )}
              </div>
            )}

            {/* Show My Projects header only if there's no search query */}
            {!searchQuery && (
              <div className="font-bold px-3 py-1.5 rounded-2xl flex items-center gap-2">
                <Image
                  src={profile?.avatar_url || "/default_avatar.png"}
                  alt={profile?.full_name || profile?.username || "avatar"}
                  width={20}
                  height={20}
                  className="rounded-full object-cover max-w-[20px] max-h-[20px]"
                />
                <span>My Projects</span>
              </div>
            )}
            <ul>
              {personalProjects.map((project) => (
                <div key={project.id}>
                  <li
                    className="flex items-center ml-3 px-3 py-1.5 rounded-2xl transition-colors text-text-700 hover:bg-text-100 cursor-pointer"
                    onClick={() => {
                      setTask({
                        ...task,
                        project_id: project.id,
                        section_id: null,
                        is_inbox: false,
                      });
                      onClose();
                    }}
                  >
                    <Hash strokeWidth={1.5} className="w-4 h-4 mr-2" />
                    {project.name}
                    {task.project_id === project.id &&
                      task.section_id == null && (
                        <Check
                          strokeWidth={2}
                          className="w-4 h-4 ml-auto text-primary-600"
                        />
                      )}
                  </li>
                  {/* Render sections under the project */}
                  <ul>
                    {sections
                      .filter((section) => section.project_id === project.id)
                      .map((section) => (
                        <li
                          key={section.id}
                          className="flex items-center justify-between ml-6 px-3 py-1.5 rounded-2xl transition-colors text-text-700 hover:bg-text-100 cursor-pointer"
                          onClick={() => {
                            setTask({
                              ...task,
                              project_id: section.project_id,
                              section_id: section.id,
                            });
                            onClose();
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M17.5 20a.5.5 0 0 1 0 1h-11a.5.5 0 0 1 0-1h11zM16 8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h8zm0 1H8a1 1 0 0 0-.993.883L7 10v5a1 1 0 0 0 .883.993L8 16h8a1 1 0 0 0 .993-.883L17 15v-5a1 1 0 0 0-.883-.993L16 9zm1.5-5a.5.5 0 0 1 0 1h-11a.5.5 0 0 1 0-1h11z"
                              ></path>
                            </svg>

                            <span>{section.name}</span>
                          </div>

                          {task.section_id === section.id && (
                            <Check
                              strokeWidth={2}
                              className="w-4 h-4 ml-auto text-primary-600"
                            />
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </ul>

            {/* Show Team Projects */}
            {teamProjects.map(({ team, projects }) =>
              projects.length > 0 ? (
                <div key={team.id}>
                  {!searchQuery && (
                    <div className="font-bold px-3 py-1.5 rounded-2xl flex items-center gap-2">
                      {team.avatar_url ? (
                        <Image
                          src={team.avatar_url}
                          alt={team.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-5 h-5 min-w-5 min-h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px] font-medium">
                            {team.name?.slice(0, 1).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span>{team.name}</span>
                    </div>
                  )}
                  <ul>
                    {projects.map((project) => (
                      <div key={project.id}>
                        <li
                          className="flex items-center ml-3 px-3 py-1.5 rounded-2xl transition-colors text-text-700 hover:bg-text-100 cursor-pointer"
                          onClick={() => {
                            setTask({
                              ...task,
                              project_id: project.id,
                              section_id: null,
                              is_inbox: false,
                            });
                            onClose();
                          }}
                        >
                          <Hash strokeWidth={1.5} className="w-4 h-4 mr-2" />
                          {project.name}
                          {task.project_id === project.id && (
                            <Check
                              strokeWidth={2}
                              className="w-4 h-4 ml-auto text-primary-600"
                            />
                          )}
                        </li>
                        {/* Render sections under the project */}
                        <ul>
                          {sections
                            .filter(
                              (section) => section.project_id === project.id
                            )
                            .map((section) => (
                              <li
                                key={section.id}
                                className="flex items-center justify-between ml-6 px-3 py-1.5 rounded-2xl transition-colors text-text-700 hover:bg-text-100 cursor-pointer"
                                onClick={() => {
                                  setTask({
                                    ...task,
                                    project_id: section.project_id,
                                    section_id: section.id,
                                  });
                                  onClose();
                                }}
                              >
                                <span>{section.name}</span>
                                {task.section_id === section.id && (
                                  <Check
                                    strokeWidth={2}
                                    className="w-4 h-4 ml-auto text-primary-600"
                                  />
                                )}
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </div>
        </div>
      }
      contentWidthClass="w-[300px]"
    />
  );
};

export default ProjectsSelector;
