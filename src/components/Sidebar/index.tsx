import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  SVGProps,
  useState,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import {
  CalendarDaysIcon,
  ListBulletIcon,
  ChartBarIcon,
  PlusIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  FireIcon,
  ChevronRightIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import AddTaskModal from "../AddTask/AddTaskModal";
import AddProject from "../AddProject";
import { Task } from "@/types/project";
import ProjectItem from "../Sidebar/ProjectItem";
import AddTaskTextButton from "../AddTaskTextButton";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { projects, setTasks } = useTaskProjectDataProvider();

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const menuItems: {
    id: number;
    icon: ForwardRefExoticComponent<
      Omit<SVGProps<SVGSVGElement>, "ref"> & {
        title?: string | undefined;
        titleId?: string | undefined;
      } & RefAttributes<SVGSVGElement>
    >;
    text: string;
    path?: string;
    onClick?: () => void;
  }[] = [
    { id: 1, icon: MagnifyingGlassIcon, text: "Search", onClick: () => {} },
    { id: 2, icon: InboxIcon, text: "Inbox", path: "/app/inbox" },
    { id: 3, icon: CalendarIcon, text: "Today", path: "/app" },
    // { icon: CalendarDaysIcon, text: "Upcoming", path: "/app/upcoming" },
    // { icon: FireIcon, text: "Filters & Labels", path: "/app/filters" },
  ];

  const addTask = (newTask: Task) => {
    setTasks((prev) => [...prev, { ...newTask, id: prev.length + 1 }]);
    setShowAddTaskModal(false);
  };

  return (
    <>
      <aside className="w-64 h-screen bg-gray-50 flex flex-col group">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <ListBulletIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">TaskMaster</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-gray-700 hover:bg-gray-200 rounded-md p-1 transition-colors">
              <BellIcon className="w-6 h-6" />
            </button>
            <button className="text-gray-700 hover:bg-gray-200 rounded-md p-1 transition-colors">
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
          </div>
        </div>

        <nav className="flex-grow overflow-y-auto">
          <ul className="space-y-1 px-2">
            <li>
              <button
                onClick={() => setShowAddTaskModal(true)}
                className={`flex items-center px-2 py-2 rounded-md transition-colors text-gray-700 w-full hover:bg-gray-200`}
              >
                <AddTaskTextButton handleAddTask={() => {}} />
              </button>
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
    </>
  );
};

export default Sidebar;
