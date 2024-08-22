"use client";
import {
  CircleCheckBig,
  FileText,
  LucideProps,
  MessageCircleMore,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const menuItems: {
  id: number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
  path: string;
}[] = [
  { id: 1, icon: CircleCheckBig, text: "Tasks", path: "/app" },
  { id: 5, icon: MessageCircleMore, text: "Messages", path: "/app/messages" },
  { id: 5, icon: FileText, text: "Docs", path: "/app/docs" },
];

const MainSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-20 bg-[#f5f7ff] border-r relative z-30">
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link
              href={item.path}
              className={`flex flex-col items-center justify-center p-2 gap-2 w-full aspect-square ${
                pathname.startsWith(item.path)
                  ? "bg-indigo-100 text-indigo-700"
                  : "hover:bg-gray-200 text-gray-700"
              } transition-colors text-xs`}
            >
              <item.icon strokeWidth={1.5} className="w-5 h-5" />
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainSidebar;
