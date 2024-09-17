"use client";
import React, { useEffect, useState } from "react";
import PageWrapper from "./PageWrapper";
import { PageType } from "@/types/pageTypes";
import { useAuthProvider } from "@/context/AuthContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";

const PageDetails = ({
  params: { page_slug },
}: {
  params: { page_slug: string };
}) => {
  const { profile } = useAuthProvider();
  const [currentProject, setCurrentProject] = useState<PageType | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  const { pagesLoading, pages, setPages } = useSidebarDataProvider();

  useEffect(() => {
    if (pagesLoading) return;

    const project = pages.find((p) => p.slug === page_slug);

    if (project) {
      setCurrentProject(project);
      setNotFound(false);
    } else {
      setNotFound(true);
      setCurrentProject(null);
    }

    return () => {
      setCurrentProject(null);
      setNotFound(false);
    };
  }, [page_slug, pages, pagesLoading]);

  useEffect(() => {
    if (currentProject?.id) {
      document.title = `${currentProject.title} - Kakrola`;
    } else {
      document.title = "Kakrola";
    }
  }, [currentProject]);

  return (
    <PageWrapper>
      <h1>{page_slug}</h1>
    </PageWrapper>
  );
};

export default PageDetails;
