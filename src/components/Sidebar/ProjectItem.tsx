import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType, TaskType } from "@/types/project";
import {
  EllipsisHorizontalIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import SidebarProjectMoreOptions from "./SidebarProjectMoreOptions";
import { supabaseBrowser } from "@/utils/supabase/client";

const ProjectItem = ({
  project,
  pathname,
}: {
  project: ProjectType;
  pathname: string;
}) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [showProjectMoreDropdown, setShowProjectMoreDropdown] =
    useState<boolean>(false);

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showProjectMoreDropdown && moreRef.current && dropdownRef.current) {
        const moreRect = moreRef.current.getBoundingClientRect();
        const dropDownRect = dropdownRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: moreRect.bottom - dropDownRect.height / 2,
          left: moreRect.right,
        });
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [showProjectMoreDropdown]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: tasksData, error: tasksError } = await supabaseBrowser
        .from("tasks")
        .select("*")
        .eq("project_id", project.id);

      if (!tasksError) {
        setTasks(tasksData || []);
      }
    };

    fetchTasks();
  }, [project.id]);

  return (
    <li>
      <div
        ref={moreRef}
        className={`relative sidebar_project_item p-[1px] flex-1 flex items-center justify-between rounded-md transition-colors ${
          pathname === `/app/projects/${project.slug}`
            ? "bg-indigo-100 text-indigo-700"
            : "hover:bg-gray-200 text-gray-700"
        }`}
      >
        <Link href={`/app/projects/${project.slug}`} className="p-[1px] w-full">
          <div className="flex items-center">
            <div className="p-2">
              <HashtagIcon className="w-4 h-4" />
            </div>
            {project.name}
          </div>
        </Link>

        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <p>
              {tasks.filter((task) => task.project_id == project.id).length}
            </p>

            <div
              onClick={(ev) => {
                ev.stopPropagation();
                setShowProjectMoreDropdown(true);
              }}
              className={`flex items-center justify-center absolute left-0 top-0 right-0 bottom-0 z-10 cursor-pointer ${
                pathname === `/app/projects/${project.slug}`
                  ? "bg-gray-300"
                  : "bg-gray-200"
              } hover:bg-gray-100 rounded-md opacity-0 sidebar_project_item_options w-7 h-7`}
            >
              <EllipsisHorizontalIcon className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {showProjectMoreDropdown && (
        <SidebarProjectMoreOptions
          onClose={() => setShowProjectMoreDropdown(false)}
          project={project}
          dropdownPosition={dropdownPosition}
          dropdownRef={dropdownRef}
        />
      )}
    </li>
  );
};

export default ProjectItem;
