"use client";
import AddTeam from "@/components/AddTeam";
import {
  ChevronDown,
  CircleCheckBig,
  FileText,
  LucideProps,
  MessageCircleMore,
  MessageSquareText,
  PanelLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import ProfileMoreOptions from "../TasksSidebar/ProfileMoreOptions";
import { useAuthProvider } from "@/context/AuthContext";
import ConfirmAlert from "@/components/AlertBox/ConfirmAlert";

const menuItems: {
  id: number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
  path: string;
  pathNotStartsWith?: string;
}[] = [
  {
    id: 1,
    icon: CircleCheckBig,
    text: "Tasks",
    path: "/app",
    pathNotStartsWith: "/app/threads",
  },
  { id: 2, icon: MessageSquareText, text: "Threads", path: "/app/threads" },
  // { id: 5, icon: FileText, text: "Docs", path: "/app/docs" },
];

const MainSidebar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const pathname = usePathname();
  const { profile } = useAuthProvider();
  const [showProfileMoreOptions, setShowProfileMoreOptions] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState<boolean | number>(false);

  return (
    <>
      <div className="w-[4.5rem] bg-primary-25 border-r relative z-20 flex flex-col">
        <div className="flex-1">
          <ul>
            <li className="aspect-square flex items-center justify-center">
              <button
                onClick={toggleSidebar}
                className={`hover:bg-primary-50 rounded-lg transition-colors w-9 h-9 flex items-center justify-center`}
              >
                <PanelLeft strokeWidth={1.5} width={20} />
              </button>
            </li>

            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={`flex flex-col items-center justify-center gap-1 w-full aspect-square transition-colors text-xs group`}
                >
                  <span
                    className={`p-2 rounded-lg transition-colors ${
                      pathname.startsWith(item.path) &&
                      !pathname.startsWith(item.pathNotStartsWith!)
                        ? "bg-primary-100 text-primary-700"
                        : "group-hover:bg-primary-50 text-text-700"
                    }`}
                  >
                    <item.icon strokeWidth={1.5} className="w-5 h-5" />
                  </span>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center aspect-square w-full">
            <button onClick={() => setShowProfileMoreOptions(true)}>
              <Image
                src={profile?.avatar_url || "/default-avatar.png"}
                alt={profile?.full_name || profile?.username || ""}
                width={32}
                height={32}
                className="rounded-lg"
              />
            </button>
          </div>

          {showProfileMoreOptions && (
            <ProfileMoreOptions
              onClose={() => setShowProfileMoreOptions(false)}
              setShowAddTeam={setShowAddTeam}
              setShowLogoutConfirm={setShowLogoutConfirm}
            />
          )}

          {showLogoutConfirm && (
            <ConfirmAlert
              title="Log out?"
              description="Are you sure you want to log out?"
              onCancel={() => setShowLogoutConfirm(false)}
              submitBtnText="Log out"
              onConfirm={async () => {
                const response = await fetch("/api/auth/signout", {
                  method: "POST",
                });

                // if (response.ok) {
                //   router.push("/auth/login");
                // }
              }}
            />
          )}
        </div>
      </div>

      {showAddTeam && <AddTeam onClose={() => setShowAddTeam(false)} />}
    </>
  );
};

export default MainSidebar;
