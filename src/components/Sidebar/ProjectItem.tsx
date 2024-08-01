import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import { ProjectType } from "@/types/project";
import {
  ArchiveBoxArrowDownIcon,
  ArrowDownIcon,
  ArrowDownTrayIcon,
  ArrowUpIcon,
  ArrowUpTrayIcon,
  EllipsisHorizontalIcon,
  HashtagIcon,
  HeartIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { CopyPlusIcon, LogsIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const ProjectItem = ({
  project,
  pathname,
}: {
  project: ProjectType;
  pathname: string;
}) => {
  const { tasks } = useTaskProjectDataProvider();
  const [showProjectMoreDropdown, setShowProjectMoreDropdown] =
    useState<boolean>(false);

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProjectMoreDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <li className="relative">
      <div
        ref={moreRef}
        className={`relative sidebar_project_item p-[1px] flex-1 flex items-center justify-between rounded-md transition-colors text-gray-700 ${
          pathname === `/app/projects/${project.slug}`
            ? "bg-gray-300"
            : "hover:bg-gray-200"
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
              {tasks.filter((task) => task.project?.id == project.id).length}
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
        <>
          <div
            ref={dropdownRef}
            className="fixed z-[100] w-60 bg-white rounded-md shadow-lg py-1"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <ArrowUpIcon className="w-4 h-4 mr-2" /> Add project above
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <ArrowDownIcon className="w-4 h-4 mr-2" /> Add project bellow
              </button>
            </div>
            <div className="h-[1px] bg-gray-100 my-1"></div>
            <div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <PencilIcon className="w-4 h-4 mr-2" /> Edit
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <HeartIcon className="w-4 h-4 mr-2" /> Add to favorites
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <CopyPlusIcon className="w-4 h-4 mr-2" /> Duplicate
              </button>
            </div>
            <div className="h-[1px] bg-gray-100 my-1"></div>
            <div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <UserPlusIcon className="w-4 h-4 mr-2" /> Share
              </button>
            </div>
            <div className="h-[1px] bg-gray-100 my-1"></div>
            <div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <LinkIcon className="w-4 h-4 mr-2" /> Copy project link
              </button>
            </div>
            <div className="h-[1px] bg-gray-100 my-1"></div>
            <div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Import from CSV
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <ArrowUpTrayIcon className="w-4 h-4 mr-2" /> Export as CSV
              </button>
            </div>
            <div className="h-[1px] bg-gray-100 my-1"></div>
            <div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <LogsIcon className="w-4 h-4 mr-2" /> Activity log
              </button>
            </div>
            <div className="h-[1px] bg-gray-100 my-1"></div>
            <div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center">
                <ArchiveBoxArrowDownIcon className="w-4 h-4 mr-2" /> Archive
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition flex items-center">
                <TrashIcon className="w-4 h-4 mr-2" /> Delete
              </button>
            </div>
          </div>
          <div
            className="fixed top-0 left-0 bottom-0 right-0 z-10"
            onClick={() => setShowProjectMoreDropdown(false)}
          ></div>
        </>
      )}
    </li>
  );
};

export default ProjectItem;
