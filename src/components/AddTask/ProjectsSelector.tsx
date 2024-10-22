import { useAuthProvider } from "@/context/AuthContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { TaskType } from "@/types/project";
import { Check, ChevronDown, CheckCircle, Inbox } from "lucide-react";
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
  const {
    projects,
    sectionsForProjectSelector: sections,
    teams,
  } = useSidebarDataProvider();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter projects based on the search query
  const personalProjects = projects.filter(
    (project) =>
      !project.team_id &&
      project.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
      fullMode
      title="Select Project"
      triggerRef={triggerRef}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      Label={({ onClick }) =>
        forTaskModal ? (
          <div
            onClick={onClick}
            className={`flex items-center justify-between group cursor-pointer transition py-2 px-4 w-full rounded-lg ${
              isOpen ? "bg-primary-50" : "hover:bg-text-100"
            }`}
          >
            <button
              ref={triggerRef}
              className={`flex items-center justify-between`}
            >
              {task.is_inbox ? (
                <div className="flex items-center gap-2">
                  <Inbox strokeWidth={1.5} className="w-4 h-4" />
                  Inbox
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle strokeWidth={1.5} className="w-4 h-4" />
                    {projects.find((p) => p.id == task.project_id)?.name}
                  </div>
                  <div>/</div>
                  <div className="flex items-center gap-2">
                    {sections.find((s) => s.id == task.section_id)?.name}
                  </div>
                </div>
              )}
            </button>

            <ChevronDown
              strokeWidth={1.5}
              className={`w-4 h-4 transition text-text-500 ${
                !isOpen && "opacity-0 group-hover:opacity-100"
              }`}
            />
          </div>
        ) : (
          <div
            ref={triggerRef}
            className={`flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-lg ${
              isOpen ? "bg-text-50" : "hover:bg-text-100"
            }`}
            onClick={onClick}
          >
            <button
              type="button"
              className={`w-full flex items-center text-xs transition-colors text-text-700 gap-1 ${
                isSmall && "max-w-[100px]"
              }`}
            >
              {task.is_inbox ? (
                <Inbox strokeWidth={1.5} className="w-4 h-4 min-w-4 min-h-4" />
              ) : (
                <CheckCircle
                  strokeWidth={1.5}
                  className="w-4 h-4 min-w-4 min-h-4"
                />
              )}

              <div
                className={`${
                  task.is_inbox
                    ? "flex"
                    : task.section_id
                    ? "grid grid-cols-[55%_45%]"
                    : "flex"
                } items-center gap-1`}
              >
                <span className="font-bold text-xs truncate">
                  {task.project_id
                    ? projects.find((p) => p.id === task.project_id)?.name
                    : "Inbox"}
                </span>

                {task.project_id && task.section_id && (
                  <div className="flex items-center gap-1">
                    <span>/</span>
                    <span className="font-bold text-xs truncate flex-1">
                      {sections.find((s) => s.id === task.section_id)?.name}
                    </span>
                  </div>
                )}
              </div>
            </button>
            <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
          </div>
        )
      }
      beforeItemsContent={
        <div className="px-4 py-2">
          <Input
            howBig="xs"
            fullWidth
            type="text"
            placeholder="Type a project name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      }
      content={
        <div className="max-h-[300px]overflow-y-auto text-text-700 pb-2">
          {/* Show Inbox if it matches the search query */}
          {isInbox && inboxMatches && (
            <div
              className="text-text-700 cursor-pointer w-full text-left px-4 py-1.5 hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-200 transition flex items-center gap-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
              onClick={() => {
                setTask({
                  ...task,
                  project_id: null,
                  is_inbox: true,
                });
                onClose();
              }}
            >
              <Inbox strokeWidth={1.5} className="w-4 h-4" />
              Inbox
              {task.is_inbox && (
                <Check strokeWidth={1.5} className="w-4 h-4 ml-auto" />
              )}
            </div>
          )}

          {/* Show Personal header only if there's no search query */}
          {!searchQuery && (
            <div
              className={`font-medium text-xs transition duration-150 overflow-hidden whitespace-nowrap text-ellipsis pl-4 py-2`}
            >
              Personal
            </div>
          )}
          <ul>
            {personalProjects.map((project) => (
              <div key={project.id}>
                <li
                  className="text-text-700 cursor-pointer w-full text-left px-4 py-1.5 hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-200 transition flex items-center gap-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
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
                  <CheckCircle strokeWidth={1.5} className="w-4 h-4" />
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
                        className="text-text-700 cursor-pointer w-full text-left px-4 pl-8 py-1.5 hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-200 transition flex items-center gap-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
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

          {!searchQuery && (
            <span
              className={`font-medium text-xs transition duration-150 overflow-hidden whitespace-nowrap text-ellipsis pl-4 py-2`}
            >
              Teamspaces
            </span>
          )}

          {/* Show Team Projects */}
          {teamProjects.map(({ team, projects }) =>
            projects.length > 0 ? (
              <div key={team.id}>
                {!searchQuery && (
                  <div className="px-4 py-1.5 rounded-lg flex items-center gap-2">
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
                )}
                <ul>
                  {projects.map((project) => (
                    <div key={project.id}>
                      <li
                        className="text-text-700 cursor-pointer w-full text-left px-4 pl-5 py-1.5 hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-200 transition flex items-center gap-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
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
                        <CheckCircle strokeWidth={1.5} className="w-4 h-4" />
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
                              className="text-text-700 cursor-pointer w-full text-left px-4 pl-8 py-1.5 hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-200 transition flex items-center gap-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
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
      }
      contentWidthClass="w-[300px]"
    />
  );
};

export default ProjectsSelector;
