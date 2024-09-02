import React, { useState, useEffect, useRef } from "react";
import { Input } from "../../ui/input";
import Image from "next/image";
import Dropdown from "../../ui/Dropdown";
import { UserPlus } from "lucide-react";
import { useAuthProvider } from "@/context/AuthContext";
import axios from "axios";
import { ProjectMemberType } from "@/types/team";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ProfileType } from "@/types/user";
import { useGlobalOption } from "@/context/GlobalOptionContext";
import MemberItem from "./MemberItem";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ProfileType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [membersData, setMembersData] = useState<MemberData[]>([]);

  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Fetch project members and their profiles
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
      } catch (err) {
        console.error("Failed to fetch project members and profiles", err);
      }
    };

    if (projectId) {
      fetchMembersData();
    }
  }, [projectId]);

  // Fetch users based on search query
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery || !profile?.id) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get("/api/invite/search-users", {
          params: { query: searchQuery, profile_id: profile?.id },
        });
        setSearchResults(response.data.users || []);
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchUsers, 300); // Debounce to reduce API calls

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleInvite = async (email: string) => {
    if (!profile || (!projectId && !teamId)) {
      setError("Invalid project or team context.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/invite/invite-team-members", {
        emails: [email],
        // project_id: projectId,
        team_id: teamId,
        inviter: {
          id: profile.id,
          first_name: profile.full_name.split(" ")[0] || "Unknown User",
          email: profile.email,
        },
      });

      if (response.data.success) {
        setSearchQuery("");
        setSearchResults([]);
        setSuccessMessage("Invitation sent successfully!");
        setTimeout(() => setSuccessMessage(null), 3000); // Clear success message after 3 seconds
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to send invite. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if a user is already a project member
  const isAlreadyMember = (profileId: string) => {
    return membersData.some((member) => member.profile_id === profileId);
  };

  return (
    <Dropdown
      isOpen={showShareOption}
      setIsOpen={setShowShareOption}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <div className="flex items-center gap-1">
          <Image
            src={profile?.avatar_url || "/default_avatar.png"}
            alt="Avatar"
            width={20}
            height={20}
            className="rounded-full object-cover max-w-5 max-h-5"
          />
          <button
            ref={triggerRef}
            className={`${
              showShareOption ? "bg-text-100" : "hover:bg-text-100"
            } transition p-1 px-3 pr-2 rounded-full cursor-pointer flex items-center gap-1 text-text-500`}
            onClick={onClick}
          >
            <UserPlus strokeWidth={1.5} className="w-4 h-4" />
            <span className="hidden md:inline-block">Share</span>
          </button>
        </div>
      )}
      content={
        <div className="p-2 space-y-4">
          <Input
            placeholder="Add people by name or email"
            type="text"
            className="border border-text-200 focus:border-text-400 rounded-full px-3 py-2 w-full"
            value={searchQuery}
            onChange={(e) => {
              setError(null);
              setSuccessMessage(null);
              setSearchQuery(e.target.value);
            }}
            howBig="sm"
          />

          {isLoading ? (
            <p className="text-center text-gray-500">Searching...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : successMessage ? (
            <p className="text-center text-green-500">{successMessage}</p>
          ) : searchQuery ? (
            // Display search results and indicate if already a member
            <>
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-2 hover:bg-text-100 cursor-pointer rounded transition"
                  onClick={() =>
                    !isAlreadyMember(user.id) && handleInvite(user.email)
                  }
                >
                  <span>{user.full_name || user.email}</span>
                  {isAlreadyMember(user.id) ? (
                    <span className="text-sm text-gray-500">
                      Already a member
                    </span>
                  ) : (
                    <button className="text-sm text-primary-500">Add</button>
                  )}
                </div>
              ))}
              {searchResults.length === 0 && (
                <div className="text-center text-gray-600">
                  {emailRegex.test(searchQuery) ? (
                    <button
                      onClick={() => handleInvite(searchQuery)}
                      className="text-sm text-primary-500 mt-2"
                    >
                      Invite "{searchQuery}"
                    </button>
                  ) : (
                    <p>No results found for "{searchQuery}"</p>
                  )}
                </div>
              )}
            </>
          ) : (
            // Display all project members if no search query
            <>
              {membersData.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="font-semibold">Members</h3>
                  {membersData.map((member) => (
                    <MemberItem key={member.id} member={member} />
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
            </>
          )}
        </div>
      }
      contentWidthClass="w-[450px]"
    />
  );
};

export default ShareOption;
