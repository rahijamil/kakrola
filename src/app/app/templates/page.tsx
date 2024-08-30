"use client";
import React from "react";
import {
  BriefcaseBusiness,
  Brush,
  GraduationCap,
  Headset,
  LucideIcon,
  LucideProps,
  Palette,
  Puzzle,
  SquareGanttChart,
  SquareKanban,
  SquareTerminal,
  Star,
  SwatchBook,
  Target,
  User,
  UserCircle,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChartPieIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import TemplateItem from "./TemplateItem";
import useTemplates from "@/hooks/useTemplates";

const categories: {
  id: number;
  name: string;
  path: string;
  icon: LucideIcon
}[] = [
  {
    id: 1,
    name: "Featured",
    path: "/app/templates/category/featured",
    icon: SwatchBook,
  },
  {
    id: 2,
    name: "Setups",
    path: "/app/templates/category/setups",
    icon: SquareGanttChart,
  },
  {
    id: 3,
    name: "Popular",
    path: "/app/templates/category/setups",
    icon: Star,
  },
  {
    id: 4,
    name: "Work",
    path: "/app/templates/category/setups",
    icon: BriefcaseBusiness,
  },
  {
    id: 5,
    name: "Personal",
    path: "/app/templates/category/setups",
    icon: User,
  },
  {
    id: 6,
    name: "Education",
    path: "/app/templates/category/setups",
    icon: GraduationCap,
  },
  {
    id: 7,
    name: "Management",
    path: "/app/templates/category/setups",
    icon: Puzzle,
  },
  {
    id: 8,
    name: "Marketing & Sales",
    path: "/app/templates/category/setups",
    icon: ChartPieIcon,
  },
  {
    id: 9,
    name: "Development",
    path: "/app/templates/category/setups",
    icon: SquareTerminal,
  },
  {
    id: 10,
    name: "Design & Product",
    path: "/app/templates/category/setups",
    icon: Brush,
  },
  {
    id: 11,
    name: "Customer Support",
    path: "/app/templates/category/setups",
    icon: Headset,
  },
  {
    id: 12,
    name: "Creative",
    path: "/app/templates/category/setups",
    icon: Palette,
  },
  {
    id: 12,
    name: "Boards",
    path: "/app/templates/category/setups",
    icon: SquareKanban,
  },
  {
    id: 12,
    name: "2024 Goals",
    path: "/app/templates/category/setups",
    icon: Target,
  },
];

const TemplatesPage = () => {
  const pathname = usePathname();
  const { templateProjects } = useTemplates();

  return (
    <div className="wrapper">
      <header className="h-[53px] sticky top-0 bg-background z-10">
        <div className="flex items-center h-full">
          <h2 className="font-semibold">My Templates</h2>
        </div>
      </header>

      <div className="flex">
        <div className="flex-grow">
          <div className="flex gap-8">
            {templateProjects.map((project) => (
              <TemplateItem key={project.id} project={project} />
            ))}
          </div>
        </div>
        <aside className="w-56 border-l pb-3 border-text-100 hidden">
          <div>
            <div className="px-2">
              <ul>
                <li>
                  <Link
                    href={"/app/templates"}
                    className={`flex items-center p-2 py-1.5 gap-3 rounded-full transition-colors duration-150 text-text-900 ${
                      "/app/templates" === pathname
                        ? "bg-text-100"
                        : "hover:bg-text-100"
                    }`}
                  >
                    <UserCircle strokeWidth={1.5} className="w-5 h-5" />
                    My templates
                  </Link>
                </li>
              </ul>
            </div>

            <div className="h-[1px] bg-text-100 my-3 mx-2"></div>

            <div className="px-2">
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={category.path}
                      className={`flex items-center p-2 py-1.5 gap-3 rounded-full transition-colors duration-150 text-text-900 ${
                        category.path === pathname
                          ? "bg-text-100"
                          : "hover:bg-text-100"
                      }`}
                    >
                      <category.icon strokeWidth={1.5} className="w-5 h-5" />
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TemplatesPage;
