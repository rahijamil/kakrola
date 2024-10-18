import { TeamType } from "@/types/team";
import { Archive, Ellipsis, Hand, Settings } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import TeamspaceModal from "./TeamspaceModal";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamMembersData, TeamMemberData } from "@/lib/queries";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { TeamRoleType } from "@/types/role";
import Dropdown from "../ui/Dropdown";
import { useAuthProvider } from "@/context/AuthContext";
import TeamMemberRemove from "../LayoutWrapper/ShareOption/TeamMemberRemove";
import { supabaseBrowser } from "@/utils/supabase/client";
import ArchiveConfirm from "../SidebarWrapper/Sidebar/ArchiveConfirm";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";

const TeamspaceRowMore = ({
  setShowTeamSpace,
  setConfirmLeave,
  team,
}: {
  setShowTeamSpace: Dispatch<SetStateAction<boolean>>;
  setConfirmLeave: Dispatch<SetStateAction<boolean>>;
  team: TeamType;
}) => {
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [archiveConfirm, setArchiveConfirm] = useState(false);
  const { teams, setTeams, teamMembers, setTeamMembers } =
    useSidebarDataProvider();

  const handleArchive = async () => {
    try {
      // optimistic update
      setTeams(teams.filter((t) => t.id != team.id));
      setTeamMembers(teamMembers.filter((tm) => tm.team_id != team.id));

      const { error } = await supabaseBrowser
        .from("teams")
        .update({
          is_archived: true,
        })
        .eq("id", team.id);
    } catch (error) {
      console.error(`Error archiving team`, error);

      setTeams(teams);
      setTeamMembers(teamMembers);
    } finally {
      setArchiveConfirm(false);
    }
  };

  return (
    <>
      <Dropdown
        triggerRef={triggerRef}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        Label={({ onClick }) => (
          <button
            ref={triggerRef}
            onClick={onClick}
            className="p-1 rounded-lg hover:bg-primary-100 transition"
          >
            <Ellipsis strokeWidth={1.5} size={16} />
          </button>
        )}
        items={[
          {
            id: 1,
            label: "Teamspace settings",
            onClick: () => setShowTeamSpace(true),
            icon: <Settings strokeWidth={1.5} size={16} />,
          },
          {
            id: 2,
            label: "Leave teamspace",
            onClick: () => setConfirmLeave(true),
            icon: <Hand strokeWidth={1.5} size={16} />,
          },
          {
            id: 3,
            label: "Archive teamspace",
            onClick: () => setArchiveConfirm(true),
            icon: <Archive strokeWidth={1.5} size={16} />,
          },
        ]}
      />

      {archiveConfirm && (
        <ArchiveConfirm
          setShowArchiveConfirm={setArchiveConfirm}
          handleArchive={handleArchive}
          team={team}
        />
      )}
    </>
  );
};

const TeamspaceRow = ({ team }: { team: TeamType }) => {
  const [showTeamSpace, setShowTeamSpace] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const { profile } = useAuthProvider();

  const {
    data: teamMembersData = [],
    error: teamMembersError,
    isLoading,
  } = useQuery<TeamMemberData[], Error>({
    queryKey: ["teamMembersData", team.id],
    queryFn: () => fetchTeamMembersData(team.id),
    enabled: !!team.id,
  });

  const getAdmin = teamMembersData.find(
    (mem) => mem.team_id == team.id && mem.team_role == TeamRoleType.TEAM_ADMIN
  );

  const currentMember = teamMembersData.find(
    (member) => member.team_id == team.id && member.profile_id == profile?.id
  );

  return (
    <>
      <tr
        className="space-y-2 bg-transparent hover:bg-primary-50 border-b border-b-text-100 border-l-4 border-transparent hover:border-l-primary-200 transition cursor-pointer"
        onClick={() => setShowTeamSpace(true)}
      >
        <td className="font-medium text-text-700 py-1.5 pl-2">
          <div className={`flex items-center gap-2`}>
            {isLoading ? (
              <Skeleton width={28} height={28} borderRadius={8} />
            ) : (
              <>
                {team.avatar_url ? (
                  <Image
                    src={team.avatar_url}
                    alt={team.name}
                    width={28}
                    height={28}
                    className="rounded-md"
                  />
                ) : (
                  <div className="min-w-7 min-h-7 bg-primary-500 rounded-md flex items-center justify-center">
                    <span className="text-surface text-xs font-bold">
                      {team.name?.slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                )}
              </>
            )}
            <div>
              {isLoading ? (
                <Skeleton width={100} height={10} />
              ) : (
                <span className="">{team.name}</span>
              )}
              {isLoading ? (
                <Skeleton width={50} height={5} />
              ) : (
                <p className="text-text-500 text-xs">
                  {teamMembersData.length} members
                </p>
              )}
            </div>
          </div>
        </td>
        <td className="text-text-700 py-1.5 flex items-center gap-2">
          {isLoading ? (
            <Skeleton width={150} height={15} />
          ) : (
            <>
              <Image
                src={getAdmin?.profile?.avatar_url || "/default_avatar.png"}
                alt={getAdmin?.profile.full_name || "admin"}
                width={20}
                height={20}
                className="min-w-5 min-h-5 max-w-5 max-h-5 rounded-md object-cover"
              />
              {getAdmin?.profile.full_name}
            </>
          )}
        </td>
        <td className="text-text-700 py-1.5">
          {isLoading ? (
            <Skeleton width={30} height={5} />
          ) : (
            <TeamspaceRowMore
              setShowTeamSpace={setShowTeamSpace}
              setConfirmLeave={setConfirmLeave}
              team={team}
            />
          )}
        </td>
      </tr>

      {showTeamSpace && (
        <TeamspaceModal
          teamId={team.id}
          onClose={() => setShowTeamSpace(false)}
          teamMembersData={teamMembersData}
        />
      )}

      {currentMember && (
        <TeamMemberRemove
          confirmLeave={confirmLeave}
          setConfirmLeave={setConfirmLeave}
          member={currentMember}
        />
      )}
    </>
  );
};

export default TeamspaceRow;
