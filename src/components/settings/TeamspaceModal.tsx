import { TeamType } from "@/types/team";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Dialog } from "../ui";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import Image from "next/image";
import { Settings, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import TeamMemberItem from "../LayoutWrapper/ShareOption/TeamMemberItem";
import { TeamRoleType } from "@/types/role";
import { useAuthProvider } from "@/context/AuthContext";
import { TeamMemberData } from "@/lib/queries";
import TabSwitcher from "../TabSwitcher";
import { TabItem } from "@/types/types.utils";

const tabItems: TabItem[] = [
  {
    id: "general",
    name: "General",
    icon: <Settings strokeWidth={1.5} className="w-4 h-4" />,
  },
  {
    id: "member",
    name: "Members",
    icon: <Users strokeWidth={1.5} className="w-4 h-4" />,
  },
  //   {
  //     id: 3,
  //     name: "Security",
  //     icon: <Fingerprint strokeWidth={1.5} className="w-4 h-4" />,
  //     tab: TabEnum.SECURITY,
  //   },
];

const TeamspaceModal = ({
  teamId,
  teamMembersData,
  onClose,
}: {
  teamId: TeamType["id"];
  teamMembersData: TeamMemberData[];
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<TabItem["id"] | null>('member');
  const { teams } = useSidebarDataProvider();
  const { profile } = useAuthProvider();

  const team = teams.find((team) => team.id == teamId);

  if (!team) return;

  return (
    <Dialog onClose={onClose} lessOverlay>
      <div className="h-[500px] overflow-hidden">
        <div className="p-6 pb-4">
          <div className={`flex items-center gap-2`}>
            {team.avatar_url ? (
              <Image
                src={team.avatar_url}
                alt={team.name}
                width={24}
                height={24}
                className="rounded-md"
              />
            ) : (
              <div className="w-6 h-6 min-w-6 min-h-6 bg-primary-500 rounded-md flex items-center justify-center">
                <span className="text-surface text-sm font-bold">
                  {team.name?.slice(0, 1).toUpperCase()}
                </span>
              </div>
            )}
            <span className={`font-medium text-base`}>{team.name}</span>
          </div>

          {/* right header option */}
        </div>

        <TabSwitcher
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabItems={tabItems}
        />

        <div className="overflow-y-auto h-[405px] py-4">
          {activeTab == "general" ? (
            <div className="px-6">
              <div className="space-y-2">
                <h3>Details</h3>

                <div className="border border-text-200 rounded-lg p-2 px-3 space-y-2">
                  <div className="space-y-1">
                    <div className="text-xs text-text-500">Image and name</div>
                    <div className={`flex items-center gap-2`}>
                      {team.avatar_url ? (
                        <Image
                          src={team.avatar_url}
                          alt={team.name}
                          width={24}
                          height={24}
                          className="rounded-md"
                        />
                      ) : (
                        <div className="min-w-6 min-h-6 bg-primary-500 rounded-md flex items-center justify-center">
                          <span className="text-surface text-xs font-bold">
                            {team.name?.slice(0, 1).toUpperCase()}
                          </span>
                        </div>
                      )}

                      <Input
                        value={team.name}
                        howBig="xs"
                        fullWidth
                        borderLess
                        placeholder="Acme Labs"
                      />
                    </div>
                  </div>

                  <div className="h-px w-full bg-text-200"></div>

                  <div className="space-y-1">
                    <div className="text-xs text-text-500">Description</div>
                    <Input
                      value={team.description}
                      placeholder="No description"
                      howBig="xs"
                      fullWidth
                      borderLess
                    />
                  </div>
                </div>

                <Button size="sm">Update</Button>
              </div>
            </div>
          ) : activeTab == "members" ? (
            <div>
              <div className="space-y-2">
                <h3 className="px-6">Members</h3>

                <div></div>

                <div>
                  {teamMembersData.map((member) => (
                    <TeamMemberItem
                      key={member.id}
                      member={member}
                      isCurrentUserAdmin={
                        teamMembersData.find(
                          (mem) => mem.profile_id == profile?.id
                        )?.team_role == TeamRoleType.TEAM_ADMIN
                      }
                      forTeamspaceSettings
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default TeamspaceModal;
