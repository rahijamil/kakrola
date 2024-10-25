import React, { useState } from "react";
import {
  PageTemplate,
  templateService,
} from "@/types/templateTypes";
import { generateSlug } from "@/utils/generateSlug";
import { useAuthProvider } from "@/context/AuthContext";
import { ProfileType } from "@/types/user";
import TemplateManager from "@/components/SidebarWrapper/Sidebar/TemplateManager";
import { PageType } from "@/types/pageTypes";

// Updated template creation function to include required fields
export const createTemplateFromPage = (
  page: PageType,
  creator_id?: ProfileType["id"]
): Omit<PageTemplate, "id" | "created_at" | "updated_at"> => {
  if (!creator_id) throw new Error("Creator not found");
  if (!page.content) throw new Error("Page content is requried");

  return {
    type: "page", // Add required type field
    name: page.title,
    slug: generateSlug(page.title),
    description: "",
    creator_id,
    settings: {
      color: page.settings.color,
      banner_url: page.settings.banner_url,
    },
    content: page.content,
  };
};


// Updated SaveAsTemplateModal component with proper type handling
export const SavePageAsTemplate: React.FC<{
  page: PageType;
  onClose: () => void;
}> = ({ page, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { profile } = useAuthProvider();

  const templateData = createTemplateFromPage(page, profile?.id);

  const handleSave = async (data: PageTemplate) => {
    try {
      setIsLoading(true);
      setError(null);

      const fullTemplateData: Omit<
        PageTemplate,
        "id" | "created_at" | "updated_at"
      > = {
        ...data,
        type: "page" as const,
      };

      await templateService.createPageTemplate(fullTemplateData);

      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create template"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TemplateManager<"page">
      initialData={templateData}
      templateType="page"
      onSave={handleSave}
      onCancel={onClose}
      // isLoading={isLoading}
      // error={error}
    />
  );
};
