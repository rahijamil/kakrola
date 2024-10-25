"use client";
import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Megaphone,
  Pencil,
  Scale,
  Users,
  Briefcase,
  Building2,
  UserCircle,
  ChevronDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Rocket,
  Sparkles,
  UserPlus,
  Monitor,
  ShoppingCart,
  LayoutGrid,
  Microscope,
  Database,
  DollarSign,
  Heart,
  Building,
  Users2,
  GraduationCap,
  ArrowLeft,
  SwatchBook,
} from "lucide-react";
import TemplateItem from "./TemplateCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useTemplates } from "@/hooks/useTemplates";
import TemplatesGrid from "./TemplatesGrid";

const categories = [
  {
    id: 1,
    name: "Featured",
    path: "featured",
    icon: SwatchBook,
    templates: 1119,
  },
  {
    id: 2,
    name: "Product",
    path: "product",
    icon: ShoppingBag,
    templates: 1119,
  },
  {
    id: 3,
    name: "Marketing",
    path: "marketing",
    icon: Megaphone,
    templates: 1825,
  },
  {
    id: 4,
    name: "Design",
    path: "design",
    icon: Pencil,
    templates: 1164,
  },
  {
    id: 5,
    name: "Engineering",
    path: "engineering",
    icon: Cpu,
    templates: 510,
  },
  {
    id: 6,
    name: "Startup",
    path: "startup",
    icon: Rocket,
    templates: 792,
  },
  //   {
  //     id: 6,
  //     name: "AI",
  //     path: "ai",
  //     icon: Sparkles,
  //     templates: 317,
  //   },
  //   {
  //     id: 7,
  //     name: "Operations",
  //     path: "operations",
  //     icon: Scale,
  //     templates: 823,
  //   },
  //   {
  //     id: 8,
  //     name: "HR",
  //     path: "hr",
  //     icon: Users,
  //     templates: 369,
  //   },
  //   {
  //     id: 9,
  //     name: "Recruiting",
  //     path: "recruiting",
  //     icon: UserPlus,
  //     templates: 144,
  //   },
  //   {
  //     id: 10,
  //     name: "IT",
  //     path: "it",
  //     icon: Monitor,
  //     templates: 142,
  //   },
  //   {
  //     id: 11,
  //     name: "Sales",
  //     path: "sales",
  //     icon: ShoppingCart,
  //     templates: 935,
  //   },
  //   {
  //     id: 12,
  //     name: "CRM",
  //     path: "crm",
  //     icon: LayoutGrid,
  //     templates: 641,
  //   },
  //   {
  //     id: 13,
  //     name: "Freelance",
  //     path: "freelance",
  //     icon: Briefcase,
  //     templates: 1790,
  //   },
  //   {
  //     id: 14,
  //     name: "User Research",
  //     path: "user-research",
  //     icon: Microscope,
  //     templates: 227,
  //   },
  //   {
  //     id: 15,
  //     name: "Data Science",
  //     path: "data-science",
  //     icon: Database,
  //     templates: 54,
  //   },
  //   {
  //     id: 16,
  //     name: "Finance",
  //     path: "finance",
  //     icon: DollarSign,
  //     templates: 688,
  //   },
  //   {
  //     id: 19,
  //     name: "Managers",
  //     path: "managers",
  //     icon: UserCircle,
  //     templates: 315,
  //   },
  //   {
  //     id: 20,
  //     name: "Non-Profit",
  //     path: "non-profit",
  //     icon: Heart,
  //     templates: 28,
  //   },
  //   {
  //     id: 21,
  //     name: "Agency",
  //     path: "agency",
  //     icon: Building,
  //     templates: 305,
  //   },
  //   {
  //     id: 22,
  //     name: "Consulting",
  //     path: "consulting",
  //     icon: Users2,
  //     templates: 41,
  //   },
  //   {
  //     id: 23,
  //     name: "Venture Capital",
  //     path: "venture-capital",
  //     icon: GraduationCap,
  //     templates: 43,
  //   },
  //   {
  //     id: 24,
  //     name: "Website Building",
  //     path: "website-building",
  //     icon: Monitor,
  //     templates: 1026,
  //   },
];

const TemplatesModal = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templatesParam = searchParams.get("templates");
  const categoryParam = searchParams.get("category") || "featured";

  const closeModal = useCallback(() => {
    window.history.pushState(null, "", pathname);
  }, [pathname]);

  const activeCategory = useCallback(() => {
    if (categoryParam) {
      return (
        categories.find((category) => category.path === categoryParam) ||
        categories[0]
      );
    } else return null;
  }, [categoryParam]);

  if (!templatesParam) return null;

  return (
    <Dialog open={templatesParam === "show"} onOpenChange={closeModal}>
      <DialogContent className="p-0 w-[100vw] sm:max-w-7xl h-full sm:h-[80%] [&>button]:hidden">
        <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden bg-gradient-to-br from-primary-10 via-background to-primary-50 text-text-700">
          {/* Sidebar */}
          <div
            className={`w-full md:w-64 flex flex-col overflow-y-auto scrollbar-hide divide-y divide-text-100 ${
              templatesParam == "mobile"
                ? "bg-background pb-2"
                : "hidden md:block"
            }`}
          >
            <div className="p-4">
              <Input
                type="search"
                placeholder="Search templates..."
                Icon={Search}
              />
            </div>

            <nav className="py-2">
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => {
                        window.history.pushState(
                          null,
                          "",
                          `${pathname}?templates=show&category=${category.path}`
                        );
                      }}
                      className={`flex items-center p-2 px-4 transition-colors duration-150 font-medium md:font-normal w-full border-l-4 ${
                        activeCategory()?.path == category.path
                          ? "bg-primary-100 text-text-900 border-primary-300"
                          : "md:hover:bg-primary-50 border-transparent md:hover:border-primary-200 text-text-700 py-2.5 md:py-2"
                      }`}
                      onTouchStart={(ev) =>
                        ev.currentTarget.classList.add("bg-text-100")
                      }
                      onTouchEnd={(ev) =>
                        ev.currentTarget.classList.remove("bg-text-100")
                      }
                    >
                      <category.icon
                        strokeWidth={1.5}
                        className="w-5 h-5 mr-3 text-primary-500"
                      />
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div
            className={`flex-1 bg-background md:rounded-lg shadow-[1px_1px_.5rem_0_rgba(0,0,0,0.1)] md:border border-text-100 relative ${
              templatesParam !== "mobile"
                ? "md:m-1.5 md:ml-0"
                : "hidden md:m-2 md:ml-0 md:block"
            }`}
          >
            <div className="p-4 md:p-6 border-b border-text-100 flex items-center gap-2 h-[54px]">
              {/* {tab && !teamId && (
                <button
                  className="p-1 rounded-lg hover:bg-primary-50 transition"
                  onClick={() => router.back()}
                >
                  <ArrowLeft strokeWidth={1.5} size={20} />
                </button>
              )} */}
              <p className="font-semibold flex items-center gap-4">
                <ChevronLeft
                  strokeWidth={1.5}
                  className="w-6 h-6 block md:hidden"
                  onClick={() => router.back()}
                />

                <span>{activeCategory()?.name}</span>
              </p>
            </div>

            <TemplatesGrid category={categoryParam}  />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatesModal;
