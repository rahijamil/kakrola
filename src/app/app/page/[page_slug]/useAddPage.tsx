import React from "react";
import { useAuthProvider } from "@/context/AuthContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { PageType } from "@/types/pageTypes";
import { generateSlug } from "@/utils/generateSlug";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { v4 as uuid4 } from "uuid";
import {
  PersonalMemberForPageType,
  PersonalMemberForProjectType,
} from "@/types/team";
import { PersonalRoleType } from "@/types/role";

const useAddPage = ({ teamId }: { teamId?: number }) => {
  const { profile } = useAuthProvider();
  const { setPages, pages, personalMembers, setPersonalMembers } =
    useSidebarDataProvider();
  const router = useRouter();

  const handleCreatePage = async ({
    aboveBellow,
    currentPageOrder,
  }: {
    aboveBellow: "above" | "below" | null;
    currentPageOrder?: number;
  }) => {
    try {
      if (!profile?.id) return;

      const tempId = uuid4();
      const title = `Untitled Page ${pages.length + 1}`;
      const slug = generateSlug(title);

      // Define the new page object
      const newPage: Omit<PageType, "id"> = {
        title,
        slug,
        content: null,
        is_archived: false,
        settings: {
          color: "gray-500", // Default color
        },
        profile_id: profile.id,
        team_id: teamId || null,
      };

      // Calculate the new order
      let newOrder: number;
      if (currentPageOrder === undefined) {
        newOrder = pages.length + 1;
      } else {
        const sortedPages = [...pages].sort(
          (a, b) => Number(a.id) - Number(b.id)
        );
        const currentIndex = sortedPages.findIndex(
          (p) => p.id === currentPageOrder
        );

        if (aboveBellow === "above") {
          const prevPage = sortedPages[currentIndex - 1];
          newOrder = prevPage
            ? (Number(prevPage.id) + currentPageOrder) / 2
            : currentPageOrder - 0.5;
        } else {
          // "below"
          const nextPage = sortedPages[currentIndex + 1];
          newOrder = nextPage
            ? (currentPageOrder + Number(nextPage.id)) / 2
            : currentPageOrder + 0.5;
        }
      }

      // Optimistically add the new page to the state with a temporary ID and the new order
      const allPages = [...pages, { ...newPage, id: tempId } as PageType];
      setPages(allPages);

      const newPersonalMember: Omit<PersonalMemberForPageType, "id"> = {
        profile_id: profile.id,
        role: PersonalRoleType.ADMIN,
        settings: {
          is_favorite: false,
          order: newOrder,
        },
        page_id: tempId,
      };
      const allMembers: (
        | PersonalMemberForProjectType
        | PersonalMemberForPageType
      )[] = [
        ...personalMembers,
        {
          ...newPersonalMember,
          id: tempId,
        },
      ];
      setPersonalMembers(allMembers);

      // Redirect to the newly created page's slug
      router.push(`/app/page/${slug}`);

      // Call the Supabase RPC function with the new order
      const { data, error } = await supabaseBrowser.rpc(
        "insert_page_with_member",
        {
          _team_id: teamId || null,
          _profile_id: profile.id,
          _title: title,
          _slug: slug,
          _color: "gray-500", // Default color
          _is_favorite: false, // Default favorite status
          _order: newOrder,
        }
      );

      // Handle any errors during the RPC call
      if (error) {
        console.error(`Error creating page: ${error.message}`);
        // Revert the optimistic update in case of an error
        setPages(pages);
        return;
      }

      // If successful, update the page with the real ID from the RPC response
      if (data) {
        const updatedPages = allPages.map((page) => {
          if (page.id == tempId) {
            return { ...page, id: data[0].page_id }; // Update with the actual ID from the DB
          }
          return page;
        });

        // Update the state with the real page ID
        setPages(updatedPages);

        const updatedMembers = allMembers.map((member) => {
          if (member.id == tempId) {
            return { ...member, id: data[0].member_id, page_id: data.page_id };
          }
          return member;
        });

        setPersonalMembers(updatedMembers);
      }
    } catch (error) {
      console.error(`Error creating page: ${error}`);
      // Optional: Revert the optimistic update in case of an error
      setPages(pages); // Revert to the previous state if an error occurs
    }
  };

  return {
    handleCreatePage,
  };
};

export default useAddPage;
