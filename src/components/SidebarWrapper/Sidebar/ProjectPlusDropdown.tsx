import Dropdown from "@/components/ui/Dropdown";
import { useAuthProvider } from "@/context/AuthContext";
import useSidebarData from "@/hooks/useSidebarData";
import { PageType } from "@/types/pageTypes";
import { generateSlug } from "@/utils/generateSlug";
import { supabaseBrowser } from "@/utils/supabase/client";
import { CheckCircle, File, Hash, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { v4 as uuid4 } from "uuid";

const ProjectPlusDropdown = ({
  forPersonal,
  setShowAddProjectModal,
  setTeamId,
  teamId,
}: {
  forPersonal?: boolean;
  setShowAddProjectModal?: Dispatch<SetStateAction<boolean>>;
  teamId?: number | null;
  setTeamId?: Dispatch<SetStateAction<number | null>>;
}) => {
  const triggerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useAuthProvider();
  const { setPages, pages } = useSidebarData();
  const router = useRouter();

  const handleCreatePage = async () => {
    try {
      if (!profile?.id) return;

      const tempId = uuid4();
      const title = `Untitled Page ${pages.length + 1}`;
      const slug = generateSlug(title);
      const newPage: Omit<PageType, "id"> = {
        title,
        slug,
        content: null,
        is_archived: false,
        settings: {
          color: "gray-500",
        },
        profile_id: profile.id,
        team_id: teamId || null,
      };

      // Optimistically add the new page to the state
      const allPages = [...pages, { ...newPage, id: tempId }];
      setPages(allPages);

      // Redirect to the newly created page
      router.push(`/app/page/${slug}`);

      const { data, error } = await supabaseBrowser
        .from("pages")
        .insert(newPage)
        .select("id")
        .single();

      if (error) {
        console.error(`Error creating page: ${error}`);
        // Optional: Show user feedback, revert optimistic UI update
        setPages(pages); // Revert to the previous state if error occurs
        return;
      }

      // Update the page with the real ID from the database
      if (data?.id) {
        const updatedPages = allPages.map((page) => {
          if (page.id === tempId) {
            return { ...page, id: data.id };
          }
          return page;
        });
        setPages(updatedPages);
      }
    } catch (error) {
      console.error(`Error creating page: ${error}`);
      // Optional: Show user feedback, revert optimistic UI update
      setPages(pages); // Revert to the previous state if error occurs
    }
  };

  return (
    <>
      <Dropdown
        mobileBottomSheet={false}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        triggerRef={triggerRef}
        Label={({ onClick }) => (
          <button
            ref={triggerRef}
            className={`p-1 rounded-lg transition ${
              isOpen ? "bg-primary-100" : "hover:bg-primary-100"
            }`}
            onClick={onClick}
          >
            <Plus
              strokeWidth={1.5}
              className={`w-[18px] h-[18px] transition-transform duration-150`}
            />
          </button>
        )}
        items={[
          {
            id: 1,
            label: "New Project",
            icon: <CheckCircle strokeWidth={1.5} size={20} />,
            onClick: () =>
              setShowAddProjectModal
                ? setShowAddProjectModal(true)
                : setTeamId && teamId
                ? setTeamId(teamId)
                : null,
            summary: "Plan tasks and collaborate.",
          },
          {
            id: 2,
            label: "New Page",
            icon: <File strokeWidth={1.5} size={20} />,
            onClick: handleCreatePage,
            summary: "Create and share docs.",
          },
          ...(forPersonal
            ? []
            : [
                {
                  id: 3,
                  label: "New Channel",
                  icon: <Hash strokeWidth={1.5} size={20} />,
                  onClick: () => {
                    // onChange(RoleType.ADMIN);
                  },
                  //   slack like channel
                  summary: "Set up team channels.",
                },
              ]),
        ]}
      />
    </>
  );
};

export default ProjectPlusDropdown;
