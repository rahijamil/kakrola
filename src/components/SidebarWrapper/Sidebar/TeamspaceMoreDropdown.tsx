import ConfirmAlert from "@/components/AlertBox/ConfirmAlert";
import TeamspaceModal from "@/components/settings/TeamspaceModal";
import Dropdown from "@/components/ui/Dropdown";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { fetchTeamMembersData } from "@/lib/queries";
import { TeamMemberData } from "@/lib/queries";
import { TeamType } from "@/types/team";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Archive, Ellipsis, Settings, UserPlus } from "lucide-react";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";

const TeamspaceSettingsModal = ({
  teamId,
  onClose,
}: {
  teamId: TeamType["id"];
  onClose: () => void;
}) => {
  const {
    data: teamMembersData = [],
    error: teamMembersError,
    isLoading,
  } = useQuery<TeamMemberData[], Error>({
    queryKey: ["teamMembersData", teamId],
    queryFn: () => fetchTeamMembersData(teamId),
    enabled: !!teamId,
  });

  return (
    <TeamspaceModal
      teamId={teamId}
      onClose={onClose}
      teamMembersData={teamMembersData}
      isLoading={isLoading}
    />
  );
};

const TeamspaceMoreDropdown = ({
  team,
  isOpen,
  setIsOpen,
  setShowInviteTeamspace,
}: {
  team: TeamType;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setShowInviteTeamspace: Dispatch<SetStateAction<boolean>>;
}) => {
  const triggerRef = useRef(null);
  const [showTeamSpace, setShowTeamSpace] = useState(false);
  const [confirmArchiving, setConfirmArchiving] = useState(false);
  const { teams, setTeams } = useSidebarDataProvider();

  const handleArchiveTeamspace = async () => {
    try {
      if (team) {
        // optimistic update
        setTeams(
          teams.map((t) => (t.id == team.id ? { ...t, is_archived: true } : t))
        );
        const { error } = await supabaseBrowser
          .from("teams")
          .update({ is_archived: true })
          .eq("id", team.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error(`Error archiving teamspace: `, error);
      // revert optimistic update
      setTeams(
        teams.map((t) => (t.id == team.id ? { ...t, is_archived: false } : t))
      );
    } finally {
      setConfirmArchiving(false);
    }
  };

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        triggerRef={triggerRef}
        hideHeader
        Label={({ onClick }) => (
          <button
            ref={triggerRef}
            className={`p-1 rounded-lg transition md:hover:bg-primary-100 ${
              isOpen ? "md:bg-primary-50" : ""
            }`}
            onClick={onClick}
          >
            <Ellipsis
              strokeWidth={1.5}
              className={`w-[18px] h-[18px] transition-transform duration-150 transform`}
            />
          </button>
        )}
        items={[
          {
            id: 1,
            label: "Add members",
            icon: <UserPlus strokeWidth={1.5} className="w-4 h-4" />,
            onClick() {
              setShowInviteTeamspace(true);
            },
            divide: true,
          },
          {
            id: 2,
            label: "Teamspace settings",
            icon: <Settings strokeWidth={1.5} className="w-4 h-4" />,
            onClick() {
              setShowTeamSpace(true);
            },
          },
          {
            id: 3,
            label: "Archive teamspace",
            icon: <Archive strokeWidth={1.5} className="w-4 h-4" />,
            textColor: "text-red-500",
            onClick() {
              setConfirmArchiving(true);
            },
          },
        ]}
      />

      {showTeamSpace && (
        <TeamspaceSettingsModal
          teamId={team.id}
          onClose={() => setShowTeamSpace(false)}
        />
      )}

      {confirmArchiving && (
        <ConfirmAlert
          title={"Archive team?"}
          description={
            <div className="space-y-2">
              <p>
                Are you sure you want to archive{" "}
                <span className="font-semibold">
                  &quot;{team.name}
                  &quot;
                </span>{" "}
                ?
              </p>
            </div>
          }
          submitBtnText={"Archive"}
          onCancel={() => setConfirmArchiving(false)}
          onConfirm={() => handleArchiveTeamspace()}
        />
      )}
    </>
  );
};

export default TeamspaceMoreDropdown;
