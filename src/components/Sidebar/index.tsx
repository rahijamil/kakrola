import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import {
  ChartBarIcon,
  PlusIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ChevronRightIcon,
  BellIcon,
  ChevronDownIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import AddTaskModal from "../AddTask/AddTaskModal";
import AddProject from "../AddProject";
import { Task } from "@/types/project";
import ProjectItem from "../Sidebar/ProjectItem";
import AddTaskTextButton from "../AddTaskTextButton";
import ProfileMoreOptions from "./ProfileMoreOptions";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { projects, setTasks } = useTaskProjectDataProvider();

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showProfileMoreOptions, setShowProfileMoreOptions] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [afterCollapse, setAfterCollapse] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default width: 64 * 4 = 256px
  const [sidebarLeft, setSidebarLeft] = useState(0);

  const [isResizing, setIsResizing] = useState(false);

  const menuItems = [
    { id: 1, icon: MagnifyingGlassIcon, text: "Search", onClick: () => {} },
    { id: 2, icon: InboxIcon, text: "Inbox", path: "/app/inbox" },
    { id: 3, icon: CalendarIcon, text: "Today", path: "/app" },
    { id: 4, icon: DocumentIcon, text: "Docs", path: "/docs" },
  ];

  const addTask = (newTask: Task) => {
    setTasks((prev) => [...prev, { ...newTask, id: prev.length + 1 }]);
    setShowAddTaskModal(false);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setSidebarLeft(isCollapsed ? 0 : -sidebarWidth);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(200, Math.min(480, e.clientX));
      setSidebarWidth(newWidth);
      if (isCollapsed) {
        setSidebarLeft(-newWidth);
      }
    },
    [isResizing, isCollapsed]
  );
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isCollapsed) {
      setTimeout(() => {
        setAfterCollapse(true);
      }, 150);
    } else {
      setAfterCollapse(false);
    }
  }, [isCollapsed]);

  return (
    <div className="flex items-start h-screen">
      <div className="flex relative z-10">
        <div
          className="bg-gray-50 transition-all duration-300 h-screen whitespace-nowrap"
          style={{
            width: `${sidebarWidth}px`,
            marginLeft: `${sidebarLeft}px`,
          }}
        >
          <aside className="h-full flex flex-col group">
            <div className="p-4 px-2 flex items-center justify-between">
              <div className="relative">
                <button
                  className={`flex items-center gap-2 p-1 rounded-md transition ${
                    showProfileMoreOptions ? "bg-gray-200" : "hover:bg-gray-200"
                  }`}
                  onClick={() => setShowProfileMoreOptions(true)}
                >
                  <div className="w-6 h-6 bg-black rounded-full"></div>
                  <span className="font-medium">Rahi</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {showProfileMoreOptions && (
                  <ProfileMoreOptions
                    onClose={() => setShowProfileMoreOptions(false)}
                  />
                )}
              </div>

              <div className="flex items-center gap-2">
                <button className="text-gray-700 hover:bg-gray-200 rounded-md p-1 transition-colors">
                  <BellIcon className="w-6 h-6" />
                </button>

                {!afterCollapse && (
                  <button
                    onClick={toggleSidebar}
                    className="text-gray-700 hover:bg-gray-200 rounded-md p-1 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="M19 4.001H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2Zm-15 2a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1v-12Zm6 13h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-9v14Z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <nav className="flex-grow overflow-y-auto">
              <ul className="space-y-1 px-2">
                <li>
                  <div
                    onClick={() => setShowAddTaskModal(true)}
                    className={`flex items-center px-2 py-2 rounded-md transition-colors text-gray-700 w-full cursor-pointer hover:bg-gray-200`}
                  >
                    <AddTaskTextButton handleAddTask={() => {}} />
                  </div>
                </li>
                {menuItems.map((item) => (
                  <li key={item.id}>
                    {item.path ? (
                      <Link
                        href={item.path}
                        className={`flex items-center px-2 py-2 rounded-md transition-colors text-gray-700 ${
                          item.path === pathname
                            ? "bg-gray-300"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.text}
                      </Link>
                    ) : (
                      <button
                        className={`flex items-center px-2 py-2 rounded-md transition-colors text-gray-700 w-full ${
                          item.path === pathname
                            ? "bg-gray-300"
                            : "hover:bg-gray-200"
                        }`}
                        onClick={item.onClick}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.text}
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-4 px-2">
                <div className="w-full flex items-center justify-between p-1 text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
                  <span className="font-medium">Projects</span>

                  <div className="opacity-0 group-hover:opacity-100 transition flex items-center">
                    <button
                      className="p-1 hover:bg-gray-100 rounded-md transition"
                      onClick={() => setShowAddProjectModal(true)}
                    >
                      <PlusIcon
                        className={`w-[18px] h-[18px] transition-transform`}
                      />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded-md transition"
                      onClick={() => setShowProjects(!showProjects)}
                    >
                      <ChevronRightIcon
                        className={`w-[18px] h-[18px] transition-transform transform ${
                          showProjects ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {showProjects && (
                  <ul className="mt-1 ml-2 space-y-1">
                    {projects.map((project) => (
                      <ProjectItem
                        key={project.id}
                        project={project}
                        pathname={pathname}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                <span>Productivity</span>
              </button>
            </div>
          </aside>
        </div>

        <div
          className={`absolute left-full w-1 h-screen cursor-col-resize transition ${
            isResizing ? "bg-gray-200" : "hover:bg-gray-200 bg-transparent"
          }`}
          onMouseDown={handleMouseDown}
        ></div>
      </div>

      {afterCollapse && (
        <button
          onClick={toggleSidebar}
          className={`text-gray-700 hover:bg-gray-200 rounded-md p-1 transition-colors absolute top-4 left-4`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M19 4.001H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2Zm-15 2a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1v-12Zm6 13h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-9v14Z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      )}

      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddTaskModal
            addTask={addTask}
            onClose={() => setShowAddTaskModal(false)}
          />
        </div>
      )}

      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddProject onClose={() => setShowAddProjectModal(false)} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
