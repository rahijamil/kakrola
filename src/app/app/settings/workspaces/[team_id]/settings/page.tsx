import React from "react";

const TeamGeneralSettingsPage = ({
  params: { team_id },
}: {
  params: { team_id: string };
}) => {
  return <div>TeamGeneralSettingsPage: {team_id}</div>;
};

export default TeamGeneralSettingsPage;
