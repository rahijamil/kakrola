import { useRole } from "@/context/RoleContext";
import { PageType } from "@/types/pageTypes";
import { ProjectType } from "@/types/project";
import { PermissionName } from "@/types/role";
import { TeamType } from "@/types/team";

function withPermission<P>(
  WrappedComponent: React.ComponentType<P>,
  {
    permissionName,
    project,
    page,
    team_id,
  }: {
    permissionName: PermissionName;
    project: ProjectType | null;
    page: PageType | null;
    team_id?: TeamType["id"];
  }
) {
  return function WithPermissionComponent(props: P) {
    const { roleHasPermission } = useRole();
    if (
      !roleHasPermission({
        permissionName,
        team_id,
        project,
        page,
      })
    ) {
      return null; // Or return a fallback component
    }
    return (
      <WrappedComponent
        {...(props as P extends JSX.IntrinsicAttributes ? P : any)}
      />
    );
  };
}

export default withPermission;
