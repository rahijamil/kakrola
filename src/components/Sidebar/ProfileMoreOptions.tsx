import React, { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  CircleHelp,
  Gift,
  GraduationCap,
  KeyboardIcon,
  Lightbulb,
  LogOut,
  LogsIcon,
  Plus,
  Printer,
  Settings,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type IconType = React.ForwardRefExoticComponent<
  React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }
>;

interface MenuItem {
  icon: IconType | (() => JSX.Element);
  label: string;
  path?: string;
  onClick?: () => void;
  subMenu?: MenuItem[];
}

interface MenuGroup {
  type: "group";
  items: MenuItem[];
}

interface MenuItemProps {
  icon: IconType | (() => JSX.Element) | any;
  label: string;
  onClick?: () => void;
  onMouseEnter: () => void;
  hasSubmenu: boolean;
  isActive: boolean;
  path?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  onClick,
  onMouseEnter,
  hasSubmenu,
  isActive,
  path,
}) => (
  <>
    {path ? (
      <Link
        className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center justify-between ${
          isActive ? "bg-gray-100" : ""
        }`}
        href={path}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
      >
        <div className="flex items-center">
          {typeof Icon === "function" ? (
            <div className="mr-2">
              {Icon.hasOwnProperty("render") ? (
                <Icon strokeWidth={1.5} className="w-4 h-4 mr-4" />
              ) : (
                Icon()
              )}
            </div>
          ) : (
            <Icon strokeWidth={1.5} className="w-4 h-4 mr-4" />
          )}
          {label}
        </div>
        {hasSubmenu && <ChevronRight strokeWidth={1.5} className="w-4 h-4" />}
      </Link>
    ) : (
      <button
        className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center justify-between ${
          isActive ? "bg-gray-100" : ""
        }`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        <div className="flex items-center">
          {typeof Icon === "function" ? (
            <div className="mr-2">
              {Icon.hasOwnProperty("render") ? (
                <Icon strokeWidth={1.5} className="w-4 h-4 mr-4" />
              ) : (
                Icon()
              )}
            </div>
          ) : (
            <Icon strokeWidth={1.5} className="w-4 h-4 mr-4" />
          )}
          {label}
        </div>
        {hasSubmenu && <ChevronRight strokeWidth={1.5} className="w-4 h-4" />}
      </button>
    )}
  </>
);

interface ProfileMoreOptionsProps {
  onClose: () => void;
  setShowAddTeam: React.Dispatch<React.SetStateAction<boolean | number>>;
}

const ProfileMoreOptions: React.FC<ProfileMoreOptionsProps> = ({
  onClose,
  setShowAddTeam,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const router = useRouter();

  const menuItems: MenuGroup[] = [
    {
      type: "group",
      items: [
        { icon: Settings, label: "Settings", path: "/app/settings/account" },
        {
          icon: Plus,
          label: "Add a team",
          onClick: () => setShowAddTeam(true),
        },
      ],
    },
    // {
    //   type: "group",
    //   items: [
    //     { icon: LogsIcon, label: "Activity log", path: "/app/activity" },
    //     { icon: Printer, label: "Print" },
    //     {
    //       icon: BookOpen,
    //       label: "Resources",
    //       subMenu: [
    //         { icon: CircleHelp, label: "Help center" },
    //         { icon: Lightbulb, label: "Inspiration" },
    //         { icon: KeyboardIcon, label: "Keyboard shortcuts" },
    //         { icon: GraduationCap, label: "Getting started guide" },
    //         { icon: Smartphone, label: "Download apps" },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   type: "group",
    //   items: [{ icon: Gift, label: "What's new" }],
    // },
    // {
    //   type: "group",
    //   items: [
    //     {
    //       icon: () => (
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
    //           <g fill="none" fillRule="evenodd">
    //             <path
    //               stroke="#ED9D04"
    //               fill="#FEBA07"
    //               fillOpacity=".1"
    //               strokeLinejoin="bevel"
    //               d="M8.2 18.6l3.8-2.3 3.8 2.3a.8.8 0 0 0 1-.9l-.9-4.2 3.3-2.8a.8.8 0 0 0-.4-1.3L14.4 9l-1.7-4a.8.8 0 0 0-1.4 0L9.6 9l-4.4.4a.8.8 0 0 0-.4 1.3l3.3 2.8-1 4.2a.8.8 0 0 0 1.1.9z"
    //             />
    //           </g>
    //         </svg>
    //       ),
    //       label: "Upgrade to Pro",
    //     },
    //   ],
    // },
    {
      type: "group",
      items: [
        {
          icon: LogOut,
          label: "Log out",
          onClick: async () => {
            const response = await fetch("/api/auth/signout", { method: "POST" });

            if (response.ok) {
              router.push("/auth/login");
            }
          },
        },
      ],
    },
  ];

  const handleMenuItemHover = (item: MenuItem) => {
    if (item.subMenu) {
      setActiveSubmenu(item.label);
    } else {
      setActiveSubmenu(null);
    }
  };

  return (
    <>
      <div className="absolute bg-white shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)] rounded-lg border border-gray-200 top-full mt-1 left-0 z-20 w-60 py-1">
        {menuItems.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {group.items.map((item, itemIndex) => (
              <div key={itemIndex} className="relative">
                <MenuItem
                  icon={item.icon}
                  label={item.label}
                  onClick={() => {
                    item.onClick && item.onClick();
                    onClose();
                  }}
                  onMouseEnter={() => handleMenuItemHover(item)}
                  hasSubmenu={!!item.subMenu}
                  isActive={activeSubmenu === item.label}
                  path={item.path}
                />

                {item.subMenu && activeSubmenu === item.label && (
                  <div className="absolute bg-white shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)] rounded-lg border border-gray-200 top-0 left-full z-20 w-60 py-1">
                    {item.subMenu.map((subItem, subIndex) => (
                      <MenuItem
                        key={subIndex}
                        icon={subItem.icon}
                        label={subItem.label}
                        onClick={() => {}}
                        onMouseEnter={() => {}}
                        hasSubmenu={false}
                        isActive={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {groupIndex < menuItems.length - 1 && (
              <div className="h-[1px] bg-gray-100 my-1"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div
        className="fixed top-0 left-0 bottom-0 right-0 z-10"
        onClick={onClose}
      ></div>
    </>
  );
};

export default ProfileMoreOptions;
