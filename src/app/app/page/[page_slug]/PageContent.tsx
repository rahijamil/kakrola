import React, { useState } from "react";
import { PageType } from "@/types/pageTypes";
import dynamic from "next/dynamic";
import { JSONContent } from "novel";

const NovelEditor = dynamic(() => import("@/components/NovelEditor"), {
  ssr: false,
});

const PageContent = ({ page }: { page: PageType }) => {
  const [pageContent, setPageContent] = useState<JSONContent | null>(
    page.content
  );

  const handleEditContent = (newContent: JSONContent) => {
    setPageContent(newContent);
    // setPages(
    //   pages.map((p) => (p.id === page.id ? { ...p, content: newContent } : p))
    // );

    // Update the content in the database here if necessary
  };

  return (
    <>
      {/* Notion-like Editor */}
      <NovelEditor />
    </>
  );
};

export default PageContent;
