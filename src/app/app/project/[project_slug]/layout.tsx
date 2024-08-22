import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { project_slug: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("name")
    .eq("slug", params.project_slug)
    .single();

  if (project) {
    return {
      title: `${project.name} - Kakrola`,
      description: `Project: ${project.name}`,
    };
  }

  return {
    title: "Kakrola",
    description: "Kakrola",
  };
}

export default function AppLayout({
  children,
  params: { project_slug },
}: Readonly<{
  children: React.ReactNode;
  params: { project_slug: string };
}>) {
  return <>{children}</>;
}
