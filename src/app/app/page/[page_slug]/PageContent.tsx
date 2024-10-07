import React from "react";
import { PageType } from "@/types/pageTypes";
import dynamic from "next/dynamic";
import { JSONContent } from "novel";
import { supabaseBrowser } from "@/utils/supabase/client";
import useScreen from "@/hooks/useScreen";

const NovelEditor = dynamic(() => import("@/components/NovelEditor"), {
  ssr: false,
});

const PageContent = ({
  page,
  setPage,
}: {
  page: PageType;
  setPage: (pageData: PageType) => void;
}) => {
  const handleEditContent = async (content: JSONContent) => {
    try {
      setPage({ ...page, content });

      const { error } = await supabaseBrowser
        .from("pages")
        .update({ content })
        .eq("id", page.id);

      if (error) throw error;
    } catch (error) {
      console.error("Failed to update page content", error);
    }
  };

  const { screenWidth } = useScreen();

  return (
    <div
      className="page-content"
      onContextMenu={(ev) => screenWidth <= 768 && ev.preventDefault()}
    >
      {/* Notion-like Editor */}
      <NovelEditor content={page.content} handleSave={handleEditContent} />
    </div>
  );
};

export default PageContent;
