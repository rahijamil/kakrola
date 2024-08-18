import { useAuthProvider } from "@/context/AuthContext";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { SectionType, TaskType } from "@/types/project";
import { Check, Hash, Inbox } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Input } from "../ui/input";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProjectsSelector = ({
  onClose,
  isInbox,
  task,
  setTask,
  positionClassNames,
}: {
  onClose: () => void;
  isInbox?: boolean;
  task: TaskType;
  setTask: Dispatch<SetStateAction<TaskType>>;
  positionClassNames?: string;
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

  return (
    <>
      <div
        className={`absolute bg-white border rounded-md overflow-hidden z-20 text-xs w-[300px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] ${
          positionClassNames ? positionClassNames : "top-full left-1/2 -translate-x-1/2"
        }`}
      >
        <div className="p-2 border-b border-gray-200">
          <Input
            howBig="sm"
            fullWidth
            type="text"
            placeholder="Type a project name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Show Inbox if it matches the search query */}
        {isInbox && inboxMatches && (
          <div
            className="flex items-center p-2 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
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
          <div className="font-bold p-2 flex items-center gap-2">
            <Image
              src={profile?.avatar_url || "/default_avatar.png"}
              alt={profile?.full_name || profile?.username || "avatar"}
              width={20}
              height={20}
              className="rounded-md"
            />
            <span>My Projects</span>
          </div>
        )}
        <ul>
          {personalProjects.map((project) => (
            <div key={project.id}>
              <li
                className="flex items-center pl-6 p-2 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                {task.project_id === project.id && task.section_id == null && (
                  <Check
                    strokeWidth={2}
                    className="w-4 h-4 ml-auto text-indigo-600"
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
                      className="flex items-center justify-between pl-8 p-2 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                          className="w-4 h-4 ml-auto text-indigo-600"
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
                <div className="font-bold p-2 flex items-center gap-2">
                  {team.avatar_url ? (
                    <Image
                      src={team.avatar_url}
                      alt={team.name}
                      width={20}
                      height={20}
                      className="rounded-md"
                    />
                  ) : (
                    <div className="w-5 h-5 min-w-5 min-h-5 bg-indigo-500 rounded-md flex items-center justify-center">
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
                      className="flex items-center pl-6 px-2 py-2 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                          className="w-4 h-4 ml-auto text-indigo-600"
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
                            className="flex items-center justify-between pl-8 p-2 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                                className="w-4 h-4 ml-auto text-indigo-600"
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

      <div
        className="fixed top-0 left-0 bottom-0 right-0 z-10"
        onClick={onClose}
      ></div>
    </>
  );
};

export default ProjectsSelector;
