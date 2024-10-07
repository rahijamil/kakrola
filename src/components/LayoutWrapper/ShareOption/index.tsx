import React, { useEffect, useState } from "react";
import Image from "next/image";
import Dropdown from "../../ui/Dropdown";
import { UserPlus } from "lucide-react";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ProfileType } from "@/types/user";
import { useGlobalOption } from "@/context/GlobalOptionContext";
import MemberItem from "./MemberItem";
import InviteEmailInput from "./InviteEmailInput";
import {
  InviteStatus,
  PersonalMemberForProjectType,
  ProjectInviteType,
  PageInviteType,
} from "@/types/team";
import PendingItem from "./PendingItem";
import ShareAvatar from "./ShareAvatar";
import useScreen from "@/hooks/useScreen";
import { useQuery } from "@tanstack/react-query";
import { RoleType } from "@/types/role";

// Define types
interface MemberData extends PersonalMemberForProjectType {
  profile: ProfileType;
}

// Fetching pending users
const fetchPendingUsers = async (projectId?: number, pageId?: number) => {
  const column_name = projectId ? "project_id" : "page_id";
  const id = projectId || pageId;

  const { data, error } = await supabaseBrowser
    .from("invites")
    .select()
    .eq("status", InviteStatus.PENDING)
    .eq(column_name, id);

  if (error) throw new Error("Failed to fetch pending invites");
  return data as PageInviteType[] | ProjectInviteType[]; // Define the return type
};

// Fetching members data
const fetchMembersData = async (projectId?: number, pageId?: number) => {
  const column_name = projectId ? "project_id" : "page_id";
  const id = projectId || pageId;

  const { data: members, error: membersError } = await supabaseBrowser
    .from("personal_members")
    .select()
    .eq(`${column_name}`, id);

  if (membersError) throw new Error("Failed to fetch members");

  const profileIds = members.map((member) => member.profile_id);
  const { data: profiles, error: profilesError } = await supabaseBrowser
    .from("profiles")
    .select()
    .in("id", profileIds);

  if (profilesError) throw new Error("Failed to fetch profiles");

  return members.map((member) => ({
    ...member,
    profile: profiles.find(
      (profile) => profile.id === member.profile_id
    ) as ProfileType,
  })) as MemberData[];
};

// ShareOption component
const ShareOption = ({
  projectId,
  teamId,
  triggerRef,
  pageId,
}: {
  projectId?: number;
  pageId?: number;
  teamId?: number | null;
  triggerRef: React.RefObject<HTMLDivElement>;
}) => {
  const { profile } = useAuthProvider();
  const { setShowShareOption, showShareOption } = useGlobalOption();
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Use React Query for fetching members and pending invites
  const { data: membersData, error: membersError } = useQuery<
    MemberData[],
    Error
  >({
    queryKey: ["membersData", projectId, pageId],
    queryFn: () => fetchMembersData(projectId, pageId),
    enabled: !!(projectId || pageId),
  });

  const { data: pendingUsers } = useQuery<
    PageInviteType[] | ProjectInviteType[],
    Error
  >({
    queryKey: ["pendingUsers", projectId, pageId],
    queryFn: () => fetchPendingUsers(projectId, pageId),
    enabled: !!(projectId || pageId),
  });

  const { screenWidth } = useScreen();

  return (
    <Dropdown
      isOpen={showShareOption}
      setIsOpen={setShowShareOption}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <div className="flex items-center gap-1">
          {screenWidth > 768 && (
            <div className="flex items-center">
              {membersData?.map((member) => (
                <ShareAvatar key={member.id} member={member} />
              ))}
            </div>
          )}
          <button
            className={`${
              showShareOption ? "bg-text-100" : "hover:bg-text-100"
            } transition p-1 px-3 pr-2 rounded-lg cursor-pointer flex items-center gap-1 text-text-500`}
            onClick={onClick}
          >
            <UserPlus strokeWidth={1.5} className="w-4 h-4" />
            <span className="hidden md:inline-block">Share</span>
          </button>
        </div>
      )}
      content={
        <div
          className={`${
            screenWidth > 768 ? "py-4 space-y-4" : "space-y-2 p-2"
          }`}
        >
          <InviteEmailInput
            projectId={projectId}
            pageId={pageId}
            teamId={teamId}
            emails={emails}
            setEmails={setEmails}
            error={error}
            setError={setError}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />

          {(membersData && membersData.length > 0) ||
          (pendingUsers && pendingUsers.length > 0) ? (
            <div className="space-y-2">
              <h3 className="font-semibold px-4 text-text-700">
                In this project
              </h3>

              <div>
                {membersData?.map((member) => (
                  <MemberItem
                    key={member.id}
                    member={member}
                    isCurrentUserAdmin={
                      membersData.find((mem) => mem.profile_id == profile?.id)
                        ?.role == RoleType.ADMIN
                    }
                  />
                ))}

                {pendingUsers?.map((invite) => (
                  <PendingItem
                    key={invite.id}
                    invite={invite}
                    isCurrentUserAdmin={
                      membersData?.find((mem) => mem.profile_id == profile?.id)
                        ?.role == RoleType.ADMIN
                    }
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-4">
              <Image
                src="/images/collaboration_empty_state.png"
                alt="No members yet"
                width={150}
                height={150}
              />
              <p className="text-center text-text-700">
                No members yet. Start by inviting others to!
              </p>
            </div>
          )}
        </div>
      }
      contentWidthClass="w-[450px]"
      fullMode
      title="Share"
    />
  );
};

export default ShareOption;
