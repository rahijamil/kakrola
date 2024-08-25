"use client";
import { Input } from "@/components/ui/input";
import { useAuthProvider } from "@/context/AuthContext";
import { useTaskProjectDataProvider } from "@/context/TaskProjectDataContext";
import {
  ChevronDown,
  Ellipsis,
  Hash,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AppProjectsActivePage = () => {
  const { profile } = useAuthProvider();
  const { projects } = useTaskProjectDataProvider();

  const activeProjects = projects.filter(
    (p) => p.team_id == null && !p.is_archived
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-end p-3">
        <Link
          href="/app/settings/account"
          className="py-[5px] px-2 hover:bg-text-100 flex items-center gap-1 transition rounded-lg font-medium text-text-600 hover:text-text-800"
        >
          <Settings strokeWidth={1.5} size={20} className="text-text-500" />
          <span>Settings</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-3">
          <div className={`flex items-center gap-2`}>
            <Image
              src={profile?.avatar_url || "/default-avatar.png"}
              alt={profile?.full_name || profile?.username || ""}
              width={26}
              height={26}
              className="rounded-lg"
            />

            <h1
              className={`font-bold transition whitespace-nowrap text-[26px]`}
            >
              My Projects
            </h1>
          </div>

          <p className="text-text-500">Free plan</p>

          <div className="space-y-2">
            <Input placeholder="Search projects" Icon={Search} />

            <div className="flex items-center justify-between">
              <div>
                <button className="flex items-center gap-2 hover:bg-text-100 transition px-2 py-1 rounded-lg border border-text-200">
                  <span>Active projects</span>
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              <div>
                <button
                  className="p-1 hover:bg-text-100 rounded-lg transition"
                  //   onClick={() => setShowAddProjectModal(true)}
                >
                  <Plus
                    strokeWidth={1.5}
                    className={`w-[18px] h-[18px] transition-transform`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="border-b border-text-200 py-1 font-medium">
              {activeProjects.length} Projects
            </div>

            <div>
              <ul>
                {activeProjects.map((p) => (
                  <li
                    key={p.id}
                    className="relative hover:bg-text-100 transition rounded-lg"
                  >
                    <Link
                      href={`/app/project/${p.slug}`}
                      className="p-3 py-4 flex items-center gap-2"
                    >
                      <Hash className={`w-4 h-4 text-${p.color}`} />
                      {p.name}
                    </Link>

                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <button
                        className="hover:bg-text-100 p-[5px] rounded-lg transition"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        <Ellipsis className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppProjectsActivePage;
