import { useAuthProvider } from "@/context/AuthContext";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType, TaskType } from "@/types/project";
import { Check, Hash, Inbox } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "../ui/input";

const ProjectsSelector = ({
  onClose,
  onInboxClick,
  task,
  onProjectSelect,
  positionClasses,
}: {
  onClose: () => void;
  onInboxClick: () => void;
  task: TaskType;
  onProjectSelect: (project: ProjectType) => void;
  positionClasses?: string;
}) => {
  const { profile } = useAuthProvider();
  const { projects, teams } = useTaskProjectDataProvider();
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
        className={`absolute bg-white border rounded-md overflow-hidden z-20 text-xs w-[300px] ${
          positionClasses ? positionClasses : "top-full -left-full"
        }`}
      >
        <div className="p-2 border-b border-gray-200">
          <Input
            fullWidth
            type="text"
            placeholder="Type a project name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Show Inbox if it matches the search query */}
        {onInboxClick && inboxMatches && (
          <div
            className="flex items-center p-2 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onInboxClick();
              onClose();
            }}
          >
            <Inbox strokeWidth={1.5} className="w-5 h-5 mr-3" />
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
            <li
              key={project.id}
              className="flex items-center pl-6 px-2 py-2 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onProjectSelect(project);
                onClose();
              }}
            >
              <Hash strokeWidth={1.5} className="w-4 h-4 mr-2" />
              {project.name}
              {task.project_id === project.id && (
                <Check strokeWidth={1.5} className="w-4 h-4 ml-auto" />
              )}
            </li>
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
                  <li
                    key={project.id}
                    className="flex items-center pl-6 px-2 py-2 transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      onProjectSelect(project);
                      onClose();
                    }}
                  >
                    <Hash strokeWidth={1.5} className="w-4 h-4 mr-2" />
                    {project.name}
                    {task.project_id === project.id && (
                      <Check strokeWidth={1.5} className="w-4 h-4 ml-auto" />
                    )}
                  </li>
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
