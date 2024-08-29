import { redirect } from "next/navigation";

const AppProjectsPage = ({
  params: { team_id },
}: {
  params: { team_id: string };
}) => {
  redirect(`/app/${team_id}/projects/active`);
};

export default AppProjectsPage;
