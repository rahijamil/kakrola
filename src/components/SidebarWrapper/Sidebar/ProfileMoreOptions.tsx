import React, { useRef, useState, useCallback, memo, useMemo } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthProvider } from "@/context/AuthContext";
import Image from "next/image";
import Dropdown from "@/components/ui/Dropdown";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useScreen from "@/hooks/useScreen";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWorkspaces } from "@/services/workspace.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileType } from "@/types/user";
import { supabaseBrowser } from "@/utils/supabase/client";

interface MenuItemProps {
  icon: IconType | (() => JSX.Element) | any;
  label: string;
  onClick?: () => void;
  onMouseEnter: () => void;
  hasSubmenu: boolean;
  isActive: boolean;
  path?: string;
}

const MenuItem = memo(
  ({
    icon: Icon,
    label,
    onClick,
    onMouseEnter,
    hasSubmenu,
    isActive,
    path,
  }: MenuItemProps) => {
    const content = (
      <div className="flex items-center">
        {Icon !== null &&
          (typeof Icon === "function" ? (
            <div className="mr-2">
              {Icon.hasOwnProperty("render") ? (
                <Icon strokeWidth={1.5} className="w-4 h-4 mr-4" />
              ) : (
                Icon()
              )}
            </div>
          ) : (
            <Icon strokeWidth={1.5} className="w-4 h-4 mr-4" />
          ))}
        {label}
      </div>
    );

    const className = `w-full text-left px-4 py-1.5 text-sm text-text-700 hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-200 transition flex items-center justify-between ${
      isActive ? "bg-primary-50 border-primary-200" : ""
    }`;

    return path ? (
      <Link
        className={className}
        href={path}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
      >
        {content}
        {hasSubmenu && <ChevronRight strokeWidth={1.5} className="w-4 h-4" />}
      </Link>
    ) : (
      <button
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {content}
        {hasSubmenu && <ChevronRight strokeWidth={1.5} className="w-4 h-4" />}
      </button>
    );
  }
);

MenuItem.displayName = "MenuItem";

// Memoized WorkspaceButton component
const WorkspaceButton = memo(
  ({
    workspace,
    isActive,
    onClick,
    showCheck,
  }: {
    workspace: any;
    isActive: boolean;
    onClick: () => void;
    showCheck: boolean;
  }) => (
    <button
      className={`w-full text-left px-4 py-1.5 text-sm text-text-700 hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-200 transition flex items-center justify-between`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Avatar className="w-5 h-5">
          <AvatarImage src={workspace.avatar_url} />
          <AvatarFallback>{workspace.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <p className="text-sm">{workspace.name}</p>
      </div>
      {showCheck && (
        <Check className="min-w-4 min-h-4" size={16} strokeWidth={1.5} />
      )}
    </button>
  )
);

WorkspaceButton.displayName = "WorkspaceButton";

type IconType = React.ForwardRefExoticComponent<
  React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }
>;

interface ProfileMoreOptionsProps {
  setShowLogoutConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddAnotherAccount: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarWidth: number;
}

interface MenuItem {
  icon: IconType | (() => JSX.Element) | null;
  label: string;
  path?: string;
  onClick?: () => void;
  subMenu?: MenuItem[];
}

interface MenuGroup {
  type: "group";
  items: MenuItem[];
}

const ProfileMoreOptions: React.FC<ProfileMoreOptionsProps> = ({
  setShowLogoutConfirm,
  setShowAddAnotherAccount,
  isOpen,
  setIsOpen,
  sidebarWidth,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { profile, workspacesWithMembers } = useAuthProvider();
  const { sidebarLoading } = useSidebarDataProvider();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const triggerRef = useRef(null);
  const { screenWidth } = useScreen();

  // Memoize menu items
  const menuItems: MenuGroup[] = useMemo(
    () => [
      {
        type: "group",
        items: [
          {
            icon: Settings,
            label: "Settings",
            onClick: () => {
              window.history.pushState(
                null,
                "",
                `${pathname}?settings=account`
              );
              window.dispatchEvent(new Event("popstate"));
            },
          },
          {
            icon: Plus,
            label: "Add workspace",
            onClick: () =>
              window.history.pushState(null, "", "/app/onboarding"),
          },
        ],
      },
      {
        type: "group",
        items: [
          {
            icon: LogOut,
            label: "Log out",
            onClick: () => setShowLogoutConfirm(true),
          },
        ],
      },
    ],
    [pathname, router, setShowLogoutConfirm]
  );

  const handleMenuItemHover = useCallback((item: MenuItem) => {
    setActiveSubmenu(item.subMenu ? item.label : null);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const activeWorkspace = useMemo(() => {
    const workspace =
      workspacesWithMembers.find(
        (item) => item.workspace.id === profile?.metadata?.current_workspace_id
      )?.workspace || workspacesWithMembers[0]?.workspace;
    return workspace;
  }, [workspacesWithMembers, profile?.metadata?.current_workspace_id]);

  const workspaceMember = useMemo(
    () =>
      workspacesWithMembers.filter(
        (workspaceWithMember) =>
          workspaceWithMember.workspace.id === activeWorkspace?.id
      ),
    [workspacesWithMembers, activeWorkspace?.id]
  );

  const handleWorkspaceChange = useCallback(
    async (workspaceId: string) => {
      if (!profile?.id) return;

      try {
        router.push("/app");

        queryClient.setQueryData(
          ["profile", profile.id],
          (oldData: ProfileType) => {
            if (oldData?.metadata) {
              return {
                ...oldData,
                metadata: {
                  ...oldData.metadata,
                  current_workspace_id: workspaceId,
                },
              };
            }
            return oldData;
          }
        );

        const { error } = await supabaseBrowser
          .from("profiles")
          .update({
            metadata: {
              ...profile.metadata,
              current_workspace_id: workspaceId,
            },
          })
          .eq("id", profile.id);

        if (error) throw error;
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    [profile, queryClient]
  );

  if (screenWidth <= 768) {
    if (sidebarLoading) {
      return <Skeleton height={28} borderRadius={9999} width={100} />;
    }

    return (
      <button className="flex items-center gap-2">
        <Image
          src={profile?.avatar_url || "/default_avatar.png"}
          alt={profile?.full_name || profile?.username || ""}
          width={20}
          height={20}
          className="rounded-md object-cover max-w-5 max-h-5"
        />
        <p className="font-bold">{profile?.full_name}</p>
      </button>
    );
  }

  if (sidebarLoading) {
    return <Skeleton height={28} borderRadius={9999} width={100} />;
  }

  return (
    <Dropdown
      hideHeader
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <button
          onClick={onClick}
          ref={triggerRef}
          className="flex items-center gap-1 hover:bg-primary-50 p-1 pl-1.5 rounded-lg transition"
        >
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={activeWorkspace?.avatar_url} />
              <AvatarFallback>
                {activeWorkspace?.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <p
              className="font-semibold text-text-700 transition overflow-hidden whitespace-nowrap text-ellipsis text-[13px]"
              style={{ maxWidth: `${sidebarWidth - 135}px` }}
            >
              {activeWorkspace?.name}
            </p>
          </div>
          <ChevronDown
            strokeWidth={1.5}
            size={16}
            className="min-w-4 min-h-4"
          />
        </button>
      )}
      isOpen={isOpen}
      beforeItemsContent={
        <>
          {activeWorkspace && (
            <div className="flex items-center gap-2 p-2 pb-0.5">
              <Avatar className="w-8 h-8">
                <AvatarImage src={activeWorkspace?.avatar_url} />
                <AvatarFallback>
                  {activeWorkspace.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-[13px] text-text-700">
                  {activeWorkspace.name}
                </h2>
                <p className="text-xs text-text-500">
                  <span>{activeWorkspace.subscription?.product_id}</span>
                  {workspaceMember && (
                    <span>
                      {workspaceMember.length}{" "}
                      {workspaceMember.length === 1 ? "member" : "members"}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="h-[1px] bg-text-100 mt-1"></div>

          {workspacesWithMembers.length > 0 && (
            <div className="bg-text-50">
              <h3 className="font-medium text-xs transition duration-150 overflow-hidden whitespace-nowrap text-ellipsis py-1 text-text-500 px-4">
                {profile?.email}
              </h3>
              {workspacesWithMembers.map((item) => (
                <WorkspaceButton
                  key={item.workspace.id}
                  workspace={item.workspace}
                  isActive={
                    profile?.metadata?.current_workspace_id ===
                    item.workspace.id
                  }
                  onClick={() => {
                    handleWorkspaceChange(item.workspace.id);
                    onClose();
                  }}
                  showCheck={activeWorkspace?.id === item.workspace.id}
                />
              ))}
              <div className="h-[1px] bg-text-100 my-2"></div>
            </div>
          )}
        </>
      }
      items={[]}
      content={
        <div>
          {menuItems.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {group.items.map((item, itemIndex) => (
                <MenuItem
                  key={itemIndex}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => {
                    item.onClick?.();
                    onClose();
                  }}
                  onMouseEnter={() => handleMenuItemHover(item)}
                  hasSubmenu={!!item.subMenu}
                  isActive={activeSubmenu === item.label}
                  path={item.path}
                />
              ))}
              {groupIndex < menuItems.length - 1 && (
                <div className="h-[1px] bg-text-100 my-1"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      }
    />
  );
};

export default memo(ProfileMoreOptions);
