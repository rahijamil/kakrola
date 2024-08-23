import { Bell, Inbox, LucideProps, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import DirectMessagees from "./DirectMessages";
import Channels from "./Channels";

const menuItems: {
  id: number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
  path?: string;
  onClick?: () => void;
}[] = [
  { id: 1, icon: Search, text: "Search", path: "/app/search" },
  { id: 2, icon: Inbox, text: "Inbox", path: "/app/inbox" },
];

const ThreadsSidebar = ({ sidebarWidth }: { sidebarWidth: number }) => {
  const pathname = usePathname();
  return (
    <aside className="h-full flex flex-col group w-full">
      {/* here will notification icons */}
      <div className="p-4 px-2 flex items-center justify-between relative">
        <div className="font-bold">Organization Name</div>

        <div
          className={`flex items-center transition ${
            sidebarWidth > 220 ? "gap-2" : "gap-1"
          }`}
        >
          <button
            className={`text-gray-700 hover:bg-gray-200 rounded-lg transition-colors z-10 w-8 h-8 flex items-center justify-center`}
          >
            <Bell strokeWidth={1.5} width={20} />
          </button>
          <button
            className={`text-gray-700 hover:bg-gray-200 rounded-lg transition-colors z-10 w-8 h-8 flex items-center justify-center`}
          >
            <Bell strokeWidth={1.5} width={20} />
          </button>
        </div>
      </div>

      <nav className="flex-grow overflow-y-auto">
        <ul className="px-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.path ? (
                <Link
                  href={item.path}
                  className={`flex items-center p-2 rounded-lg transition-colors ${
                    item.path === pathname
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <item.icon strokeWidth={1.5} className="w-5 h-5 mr-3" />
                  {item.text}
                </Link>
              ) : (
                <button
                  className={`flex items-center p-2 rounded-lg transition-colors w-full ${
                    item.path === pathname
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={item.onClick}
                >
                  <item.icon strokeWidth={1.5} className="w-5 h-5 mr-3" />
                  {item.text}
                </button>
              )}
            </li>
          ))}
        </ul>

        <Channels sidebarWidth={sidebarWidth} />
        <DirectMessagees sidebarWidth={sidebarWidth} />
      </nav>
    </aside>
  );
};

export default ThreadsSidebar;
