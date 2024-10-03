"use client";
import React, { useEffect, useState } from "react";
import PageWrapper from "./PageWrapper";
import { PageType } from "@/types/pageTypes";
import { useAuthProvider } from "@/context/AuthContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import Image from "next/image";
import Spinner from "@/components/ui/Spinner";
import { Link } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import usePageDetails from "@/hooks/usePageDetails";
import PageContent from "./PageContent";

const PageDetails = ({
  params: { page_slug },
}: {
  params: { page_slug: string };
}) => {
  const [notFound, setNotFound] = useState<boolean>(false);

  const { page, setPage, isLoading, isError } = usePageDetails(page_slug);

  useEffect(() => {
    if (!isLoading && !page?.id) {
      setNotFound(true);
    }
  }, [isLoading, page]);

  useEffect(() => {
    if (page?.id) {
      document.title = `${page.title} - Kakrola`;
    } else {
      document.title = "Kakrola";
    }
  }, [page]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-primary-500">
        <Spinner color="current" size="md" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p>Error loading page details</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center flex-col gap-1 h-[70vh] select-none w-full">
        <Image
          src="/not_found.png"
          width={220}
          height={200}
          alt="Page not found"
          className="rounded-md object-cover"
          draggable={false}
        />
        <div className="text-center space-y-2 w-72">
          <h3 className="font-bold text-base">Page not found</h3>
          <p className="text-sm text-text-600 pb-4">
            The page doesn&apos;t seem to exist or you don&apos;t have
            permission to access it.
          </p>
          <Link href="/app">
            <Button>Go back to home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (page?.id) {
    return (
      <PageWrapper page={page}>
        <PageContent page={page} setPage={setPage} />
      </PageWrapper>
    );
  }
};

export default PageDetails;
