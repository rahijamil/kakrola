"use client";
import React from "react";
import {
  BriefcaseBusiness,
  Brush,
  GraduationCap,
  Headset,
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
import { useTemplateProvider } from "./TemplateContext";
import Image from "next/image";

const categories: {
  id: number;
  name: string;
  path: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
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
  const { projects, sections, tasks } = useTemplateProvider();

  return (
    <div>
      <header className="h-[53px] sticky top-0 bg-background z-10">
        <div className="wrapper flex items-center h-full">
          <h2 className="font-semibold">My Templates</h2>
        </div>
      </header>

      <div className="wrapper flex">
        <div className="flex-grow">
          <div className="grid grid-cols-4 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`rounded-2xl overflow-hidden transition-all duration-150 border border-text-100 shadow-[1px_1px_8px_rgba(0,0,0,0.1)] hover:shadow-[2px_2px_16px_rgba(0,0,0,0.2)] cursor-pointer`}
              >
                <div
                  className={`w-full aspect-video relative flex justify-center items-center bg-${
                    project.color.split("-")[0]
                  }-50`}
                >
                  {/* <Image src={project.preview_image} alt={project.name} fill /> */}

                  <span
                    className={`text-5xl rounded-full w-20 h-20 flex items-center justify-center bg-${
                      project.color.split("-")[0]
                    }-200 text-${project.color}`}
                    style={{ fontFamily: "fantasy" }}
                  >
                    #
                  </span>
                </div>

                <div className="p-4 space-y-4 border-t border-text-100">
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-text-500 text-xs">{project.description || "Template for managing the Kakrola project, including tasks for vision..."}</p>

                  <div>
                    <div className="flex items-center gap-1">
                      {project.view == "List" ? (
                        <>
                          <SquareKanban
                            size={20}
                            strokeWidth={1.5}
                            className="-rotate-90"
                          />
                          <span>List</span>
                        </>
                      ) : (
                        project.view == "Board" && (
                          <>
                            <SquareKanban size={20} strokeWidth={1.5} />

                            <span>Board</span>
                          </>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
