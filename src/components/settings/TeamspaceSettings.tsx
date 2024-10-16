import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import React, { useState } from "react";
import AddTeam from "../AddTeam";
import { Button } from "../ui/button";
import TeamspaceRow from "./TeamspaceRow";

const TeamspaceSettings = () => {
  const { teams } = useSidebarDataProvider();

  const [showAddTeam, setShowAddTeam] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-8">
        <div>
          <h3>Manage teamspaces</h3>
          <p className="text-xs text-text-500">
            Manage all teamspaces you have access here
          </p>
        </div>
        <Button onClick={() => setShowAddTeam(true)} size="sm">
          New Teamspace
        </Button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-xs text-text-500 border-y border-text-100">
            <th className="font-normal py-1.5 pl-2">Teamspace</th>
            <th className="font-normal py-1.5">Owners</th>
            <th className="font-normal py-1.5"></th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <TeamspaceRow key={team.id} team={team} />
          ))}
        </tbody>
      </table>

      {showAddTeam && <AddTeam onClose={() => setShowAddTeam(false)} />}
    </div>
  );
};

export default TeamspaceSettings;
