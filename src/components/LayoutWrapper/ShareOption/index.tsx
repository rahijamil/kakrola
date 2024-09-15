import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Dropdown from "../../ui/Dropdown";
import { UserPlus } from "lucide-react";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ProfileType } from "@/types/user";
import { useGlobalOption } from "@/context/GlobalOptionContext";
import MemberItem from "./MemberItem";
import InviteEmailInput from "./InviteEmailInput";
import { InviteStatus, InviteType, ProjectMemberType } from "@/types/team";
import PendingItem from "./PendingItem";
import ShareAvatar from "./ShareAvatar";
import useScreen from "@/hooks/useScreen";

interface MemberData extends ProjectMemberType {
  profile: ProfileType;
}

const ShareOption = ({
  projectId,
  teamId,
}: {
  projectId?: number | null;
  teamId?: number | null;
}) => {
  const { profile } = useAuthProvider();
  const { setShowShareOption, showShareOption } = useGlobalOption();
  const triggerRef = useRef(null);
  const [membersData, setMembersData] = useState<MemberData[]>([]);
  const [pendingUsers, setPendingUsers] = useState<InviteType[]>([]);
  const [emails, setEmails] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchPendingUsers = async () => {
    if (!profile?.id) return;

    const { data, error } = await supabaseBrowser
      .from("invites")
      .select()
      .eq("status", InviteStatus.PENDING)
      .eq("project_id", projectId);

    if (error) {
      console.error("Failed to fetch project invites", error);
      return;
    }

    setPendingUsers(data);
  };

  useEffect(() => {
    const fetchMembersData = async () => {
      try {
        const { data: members, error: membersError } = await supabaseBrowser
          .from("project_members")
          .select()
          .eq("project_id", projectId);

        if (membersError) {
          console.error("Failed to fetch project members", membersError);
          return;
        }

        const profileIds = members.map((member) => member.profile_id);
        const { data: profiles, error: profilesError } = await supabaseBrowser
          .from("profiles")
          .select()
          .in("id", profileIds);

        if (profilesError) {
          console.error("Failed to fetch user profiles", profilesError);
          return;
        }

        const membersWithProfile = members.map((member) => ({
          ...member,
          profile: profiles.find((profile) => profile.id === member.profile_id),
        }));

        setMembersData(membersWithProfile);
        fetchPendingUsers();
      } catch (err) {
        console.error("Failed to fetch project members and profiles", err);
      }
    };

    if (projectId) {
      fetchMembersData();
    }
  }, [projectId]);

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
              {membersData.map((member) => (
                <ShareAvatar key={member.id} member={member} />
              ))}
            </div>
          )}
          <button
            ref={triggerRef}
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
        <div className={`${screenWidth > 768 ? "p-4 space-y-4" : "space-y-2"}`}>
          <InviteEmailInput
            projectId={projectId}
            teamId={teamId}
            emails={emails}
            setEmails={setEmails}
            error={error}
            setError={setError}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            fetchPendingUsers={fetchPendingUsers}
          />

          {membersData.length > 0 || pendingUsers.length > 0 ? (
            <div className="space-y-2">
              <h3 className="font-semibold">In this project</h3>
              {membersData.map((member) => (
                <MemberItem key={member.id} member={member} />
              ))}

              {pendingUsers.map((invite) => (
                <PendingItem key={invite.id} invite={invite} />
              ))}
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
                No members yet. Start by inviting others to collaborate!
              </p>
            </div>
          )}
        </div>
      }
      contentWidthClass="w-[450px]"
    />
  );
};

export default ShareOption;
