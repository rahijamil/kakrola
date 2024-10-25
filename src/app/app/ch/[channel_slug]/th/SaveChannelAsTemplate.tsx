import React, { useState } from "react";
import {
  ChannelTemplate,
  PageTemplate,
  templateService,
} from "@/types/templateTypes";
import { generateSlug } from "@/utils/generateSlug";
import { useAuthProvider } from "@/context/AuthContext";
import { ProfileType } from "@/types/user";
import TemplateManager from "@/components/SidebarWrapper/Sidebar/TemplateManager";
import { ChannelType, ThreadType } from "@/types/channel";

// Updated template creation function to include required fields
export const createTemplateFromChannel = (
  channel: ChannelType,
  threads: ThreadType[],
  creator_id?: ProfileType["id"]
): Omit<ChannelTemplate, "id" | "created_at" | "updated_at"> => {
  if (!creator_id) throw new Error("Creator not found");

  return {
    type: "channel", // Add required type field
    name: channel.name,
    slug: generateSlug(channel.name),
    description: "",
    creator_id,
    settings: {
      color: channel.settings.color,
      is_private: false,
    },
    starter_threads: threads,
  };
};

// Updated SaveAsTemplateModal component with proper type handling
export const SaveChannelAsTemplate: React.FC<{
  channel: ChannelType;
  threads: ThreadType[];
  onClose: () => void;
}> = ({ channel, threads, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { profile } = useAuthProvider();

  const templateData = createTemplateFromChannel(channel, threads, profile?.id);

  const handleSave = async (data: ChannelTemplate) => {
    try {
      setIsLoading(true);
      setError(null);

      const fullTemplateData: Omit<
        ChannelTemplate,
        "id" | "created_at" | "updated_at"
      > = {
        ...data,
        type: "channel" as const,
      };

      await templateService.createChannelTemplate(fullTemplateData);

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
    <TemplateManager<"channel">
      initialData={templateData}
      templateType="channel"
      onSave={handleSave}
      onCancel={onClose}
      // isLoading={isLoading}
      // error={error}
    />
  );
};
