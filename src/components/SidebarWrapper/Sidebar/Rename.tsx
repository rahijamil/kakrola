import ColorSelector from "@/components/AddEditProject/ColorSelector";
import { Input } from "@/components/ui/input";
import Dropdown from "@/components/ui/Dropdown";
import { ProjectType } from "@/types/project";
import { useCallback, useState } from "react";
import { generateSlug } from "@/utils/generateSlug";
import { LucideProps } from "lucide-react";
import { PageType } from "@/types/pageTypes";
import { ChannelType } from "@/types/channel";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";

const Rename = ({
  triggerRef,
  project,
  page,
  channel,
  isOpen,
  setIsOpen,
  Icon,
}: {
  triggerRef: React.RefObject<HTMLDivElement>;
  project?: ProjectType;
  page?: PageType;
  channel?: ChannelType;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}) => {
  const [data, setData] = useState<{
    color: string;
    name: string;
    // slug: string;
  }>({
    color:
      project?.settings.color ||
      page?.settings.color ||
      channel?.settings.color ||
      "gray-500",
    name: project
      ? project?.name
      : page
      ? page?.title
      : channel
      ? channel?.name
      : "",
    // slug: project
    //   ? project?.slug
    //   : page
    //   ? page?.slug
    //   : channel
    //   ? channel?.slug
    //   : "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { projects, setProjects, pages, setPages, channels, setChannels } =
    useSidebarDataProvider();

  const handleDataChange = useCallback(
    (field: "color" | "name" | "slug", value: any) => {
      setData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    },
    [data]
  );

  const handleSubmit = async () => {
    try {
      if (
        project
          ? project?.name == data.name && project.settings.color == data.color
          : page
          ? page?.title == data.name && page.settings.color == data.color
          : channel?.name == data.name && channel?.settings.color == data.color
      ) {
        return;
      }

      const tableName = project ? "projects" : page ? "pages" : "channels";
      const columnName = project ? "name" : page ? "title" : "name";
      const id = project ? project.id : page ? page.id : channel?.id;

      // optimistic update
      project
        ? setProjects(
            projects.map((pr) =>
              pr.id == project.id
                ? {
                    ...pr,
                    name: data.name,
                    // slug: data.slug,
                    settings: { ...pr.settings, color: data.color },
                  }
                : pr
            )
          )
        : page
        ? setPages(
            pages.map((pg) =>
              pg.id == page.id
                ? {
                    ...pg,
                    title: data.name,
                    // slug: data.slug,
                    settings: { ...pg.settings, color: data.color },
                  }
                : pg
            )
          )
        : channel
        ? setChannels(
            channels.map((ch) =>
              ch.id == channel.id
                ? {
                    ...ch,
                    name: data.name,
                    // slug: data.slug,
                    settings: { ...ch.settings, color: data.color },
                  }
                : ch
            )
          )
        : null;

      const { error } = await supabaseBrowser
        .from(tableName)
        .update({
          [columnName]: data.name,
          // slug: data.slug,
          settings: {
            ...(project
              ? project.settings
              : page
              ? page.settings
              : channel?.settings),
            color: data.color,
          },
        })
        .eq("id", id);
    } catch (error) {
      console.error(`Error renaming`);

      // revert optimistic update
      project
        ? setProjects(projects)
        : page
        ? setPages(pages)
        : channel
        ? setChannels(channels)
        : null;
    }
  };

  return (
    <Dropdown
      title={`Edit ${
        project ? project.name : page ? page?.title : channel?.name
      }`}
      triggerRef={triggerRef}
      Label={({}) => <></>}
      isOpen={isOpen}
      setIsOpen={(value: boolean) => {
        if (value) {
          setIsOpen(value);
        } else {
          handleSubmit();
          setIsOpen(false);
        }
      }}
      content={
        <div className="space-y-3 p-3 px-4 pt-2 w-full">
          <div className="flex items-center gap-3">
            <ColorSelector
              value={data.color}
              onChange={(color) => handleDataChange("color", color)}
              isShowLabel={false}
              Icon={Icon}
            />
            <Input
              type="text"
              value={data.name}
              onChange={(e) => {
                handleDataChange("name", e.target.value);
                // handleDataChange("slug", generateSlug(e.target.value));
              }}
              onKeyDown={(ev) => {
                if (ev.key == "Enter") {
                  handleSubmit();
                  setIsOpen(false);
                }
              }}
              required
              autoFocus
              placeholder={
                project ? "Project name" : page ? "Page name" : "Channel name"
              }
              fullWidth
            />
          </div>

          {error && (
            <p className="text-red-500 p-4 pt-0 text-center text-xs whitespace-normal">
              {error}
            </p>
          )}
        </div>
      }
      contentWidthClass="w-11/12 max-w-[400px]"
    />
  );
};

export default Rename;
