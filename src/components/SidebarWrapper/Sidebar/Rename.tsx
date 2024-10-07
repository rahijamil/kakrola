import ColorSelector from "@/components/AddEditProject/ColorSelector";
import { Input } from "@/components/ui/input";
import Dropdown from "@/components/ui/Dropdown";
import { ProjectType } from "@/types/project";
import { useCallback, useState } from "react";
import { generateSlug } from "@/utils/generateSlug";
import { useAuthProvider } from "@/context/AuthContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { LucideProps } from "lucide-react";
import { PageType } from "@/types/pageTypes";

const Rename = ({
  triggerRef,
  project,
  page,
  isOpen,
  setIsOpen,
  Icon,
}: {
  triggerRef: React.RefObject<HTMLDivElement>;
  project?: ProjectType;
  page?: PageType;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}) => {
  const { profile } = useAuthProvider();
  const { teams } = useSidebarDataProvider();

  const [data, setData] = useState<{
    color: string;
    name: string;
    slug: string;
  }>({
    color: project?.settings.color || page?.settings.color || "gray-500",
    name: project?.name || page?.title || "",
    slug: project?.slug || page?.slug || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleProjectDataChange = useCallback(
    (field: "color" | "name" | "slug", value: any) => {
      setData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    },
    [data]
  );

  return (
    <Dropdown
      title={`Edit ${project ? project.name : page?.title}`}
      triggerRef={triggerRef}
      Label={({}) => <></>}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      content={
        <form
          // onSubmit={(ev) => {
          //   if (aboveBellow) {
          //     handleAddProjectAboveBellow(ev, aboveBellow);
          //   } else {
          //     handleAddProject(ev);
          //   }
          // }}
          className="space-y-3 p-3 px-4 pt-2 w-full"
        >
          <div className="flex items-center gap-3">
            <ColorSelector
              value={data.color}
              onChange={(color) =>
                handleProjectDataChange("color", color)
              }
              isShowLabel={false}
              Icon={Icon}
            />
            <Input
              type="text"
              value={data.name}
              onChange={(e) => {
                handleProjectDataChange("name", e.target.value);
                handleProjectDataChange("slug", generateSlug(e.target.value));
              }}
              required
              autoFocus
              placeholder="Project name"
              fullWidth
            />
          </div>

          {/* <WorkspaceSelector
          currentWorkspace={currentWorkspace}
          workspaces={workspaces}
          onSelect={(workspace) =>
            handleProjectDataChange("team_id", workspace.team_id)
          }
        /> */}

          {error && (
            <p className="text-red-500 p-4 pt-0 text-center text-xs whitespace-normal">
              {error}
            </p>
          )}
        </form>
      }
      contentWidthClass="w-11/12 max-w-[400px]"
    />
  );
};

export default Rename;
