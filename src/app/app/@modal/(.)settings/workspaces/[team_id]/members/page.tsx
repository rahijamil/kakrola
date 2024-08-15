import React from "react";

const TeamMembersSettingsPage = ({
  params: { team_id },
}: {
  params: { team_id: string };
}) => {
  return <div>TeamMembersSettingsPage:{team_id}</div>;
};

export default TeamMembersSettingsPage;
