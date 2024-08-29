"use client";
import AddTeam from "@/components/AddTeam";
import { Hash, LucideProps, PanelLeft, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import ProfileMoreOptions from "../TasksSidebar/ProfileMoreOptions";
import { useAuthProvider } from "@/context/AuthContext";
import ConfirmAlert from "@/components/AlertBox/ConfirmAlert";
import axios from "axios";

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
    icon: Target,
    text: "Projects",
    path: "/app",
    pathNotStartsWith: "/app/c",
  },
  { id: 2, icon: Hash, text: "Channels", path: "/app/c" },
  // { id: 5, icon: FileText, text: "Docs", path: "/app/docs" },
];

const MainSidebar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const pathname = usePathname();
  const { profile } = useAuthProvider();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState<boolean | number>(false);

  const router = useRouter();

  return (
    <>
      <div className="w-[4.5rem] bg-primary-10 border-r border-text-200 relative z-20 flex flex-col">
        <div className="flex-1">
          <ul>
            <li className="aspect-square flex items-center justify-center">
              <button
                onClick={toggleSidebar}
                className={`hover:bg-primary-50 rounded-full transition-colors w-9 h-9 flex items-center justify-center`}
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
                    className={`p-2 rounded-full transition-colors text-text-900 ${
                      pathname.startsWith(item.path) &&
                      !pathname.startsWith(item.pathNotStartsWith!)
                        ? "bg-primary-100"
                        : "group-hover:bg-primary-50"
                    }`}
                  >
                    <item.icon strokeWidth={1.5} className="w-5 h-5" />
                  </span>
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <ProfileMoreOptions
            setShowAddTeam={setShowAddTeam}
            setShowLogoutConfirm={setShowLogoutConfirm}
          />

          {showLogoutConfirm && (
            <ConfirmAlert
              title="Log out?"
              description="Are you sure you want to log out?"
              onCancel={() => setShowLogoutConfirm(false)}
              submitBtnText="Log out"
              loading={logoutLoading}
              onConfirm={async () => {
                setLogoutLoading(true);
                try {
                  const response = await axios("/api/auth/signout", {
                    method: "POST",
                  });

                  if (response.data.success) {
                    router.push("/auth/login");
                  } else {
                    // Handle error case (e.g., show an error message)
                    console.error("Failed to log out:", response.data.message);
                  }
                } catch (error) {
                  console.error("Error during logout:", error);
                } finally {
                  setLogoutLoading(false);
                }
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
