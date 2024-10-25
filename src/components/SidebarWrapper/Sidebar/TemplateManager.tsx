import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layout, File, Settings, Tag, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PageTemplate,
  ProjectTemplate,
  ChannelTemplate,
  BaseTemplate,
} from "@/types/templateTypes";
import { ViewTypes } from "@/types/viewTypes";
import { generateSlug } from "@/utils/generateSlug";
import { DialogFooter } from "@/components/ui/dialog";
import CustomSelect from "@/components/ui/CustomSelect";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { supabaseBrowser } from "@/utils/supabase/client";

// Template type mapping
type TemplateTypeMap = {
  page: PageTemplate;
  project: ProjectTemplate;
  channel: ChannelTemplate;
};

// Combined template data type
type TemplateDataState<T extends keyof TemplateTypeMap> = T extends "page"
  ? PageTemplate
  : T extends "project"
  ? ProjectTemplate
  : T extends "channel"
  ? ChannelTemplate
  : never;

// Props interface
interface TemplateManagerProps<T extends keyof TemplateTypeMap> {
  initialData: Partial<TemplateTypeMap[T]>;
  templateType: T;
  onSave: (templateData: TemplateDataState<T>) => Promise<void>;
  onCancel: () => void;
}

// Initialize template data based on type
function initializeTemplateData<T extends keyof TemplateTypeMap>(
  templateType: T,
  initialData: Partial<TemplateTypeMap[T]>
): TemplateDataState<T> {
  if (!initialData.creator_id || !initialData.name) {
    throw new Error("Template data must have creator_id and name properties");
  }

  const baseData: Omit<BaseTemplate, "id"> = {
    name: initialData.name,
    slug: initialData.slug || generateSlug(initialData.name),
    description: initialData.description || "",
    category: initialData.category || "general",
    tags: initialData.tags || [],
    creator_id: initialData.creator_id,
  };

  switch (templateType) {
    case "page":
      if (!(initialData as Partial<TemplateTypeMap["page"]>).content) {
        throw new Error("Template data must have content property");
      }

      return {
        ...baseData,
        content: (initialData as Partial<TemplateTypeMap["page"]>).content,
        settings: {
          color: initialData.settings?.color || "gray-500",
          banner_url: (initialData.settings as Partial<TemplateTypeMap["page"]>)
            .settings?.banner_url,
        },
        type: "page",
      } as TemplateDataState<T>;

    case "project":
      return {
        ...baseData,
        sections:
          (initialData as Partial<TemplateTypeMap["project"]>).sections || [],
        settings: {
          color: initialData.settings?.color || "gray",
          default_view:
            (initialData.settings as ProjectTemplate["settings"])
              ?.default_view || "List",
        },
        tasks: (initialData as Partial<TemplateTypeMap["project"]>).tasks || [],
        type: "project",
      } as TemplateDataState<T>;

    case "channel":
      return {
        ...baseData,
        starter_threads:
          (initialData as Partial<TemplateTypeMap["channel"]>)
            .starter_threads || [],
        settings: {
          color: initialData.settings?.color || "gray",
          is_private:
            (
              initialData.settings as Partial<
                TemplateTypeMap["channel"]
              >["settings"]
            )?.is_private || false,
        },
        type: "channel",
      } as TemplateDataState<T>;

    default:
      throw new Error(`Unsupported template type: ${templateType}`);
  }
}

const categories: { id: number; name: string; path: string }[] = [
  {
    id: 2,
    name: "Product",
    path: "product",
  },
  {
    id: 3,
    name: "Marketing",
    path: "marketing",
  },
  {
    id: 4,
    name: "Design",
    path: "design",
  },
  {
    id: 5,
    name: "Engineering",
    path: "engineering",
  },
  {
    id: 6,
    name: "Startup",
    path: "startup",
  },
];

const TemplateManager = <T extends keyof TemplateTypeMap>({
  initialData,
  templateType,
  onSave,
  onCancel,
}: TemplateManagerProps<T>) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateData, setTemplateData] = useState<TemplateDataState<T>>(() =>
    initializeTemplateData(templateType, initialData)
  );

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewFile(file);
      setTemplateData((prev) => ({
        ...prev,
        preview_image: URL.createObjectURL(file),
      }));
    }
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `template-previews/${fileName}`;

    const { data, error } = await supabaseBrowser.storage
      .from("templates")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabaseBrowser.storage.from("templates").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setUploadProgress(0);

      if (!templateData.name.trim()) {
        throw new Error("Template name is required");
      }
      if (!templateData.description.trim()) {
        throw new Error("Template description is required");
      }

      if (!templateData.category) {
        throw new Error("Template category is required");
      }

      if (!templateData.preview_image) {
        throw new Error("Template preview image is required");
      }

      let updatedTemplateData = { ...templateData };

      // Handle image upload if there's a new file
      if (previewFile) {
        try {
          const publicUrl = await uploadImageToSupabase(previewFile);
          updatedTemplateData = {
            ...updatedTemplateData,
            preview_image: publicUrl,
          };
        } catch (uploadError) {
          throw new Error(
            `Failed to upload image: ${
              uploadError instanceof Error
                ? uploadError.message
                : "Unknown error"
            }`
          );
        }
      }

      await onSave(updatedTemplateData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = () => {
    setPreviewFile(null);
    setTemplateData((prev) => ({
      ...prev,
      preview_image: undefined,
    }));
  };

  // // Type-safe settings update functions for each template type
  // const updateProjectCategory = (
  //   key: keyof ProjectTemplate["settings"],
  //   value: ProjectTemplate["settings"][keyof ProjectTemplate["settings"]]
  // ) => {
  //   if (templateType === "project") {
  //     setTemplateData((prev) => ({
  //       ...prev,
  //       settings: {
  //         ...prev.settings,
  //         [key]: value,
  //       },
  //     }));
  //   }
  // };

  // const updateChannelSettings = (
  //   key: keyof ChannelTemplate["settings"],
  //   value: ChannelTemplate["settings"][keyof ChannelTemplate["settings"]]
  // ) => {
  //   if (templateType === "channel") {
  //     setTemplateData((prev) => ({
  //       ...prev,
  //       settings: {
  //         ...prev.settings,
  //         [key]: value,
  //       },
  //     }));
  //   }
  // };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="w-full max-w-3xl mx-auto shadow-lg border rounded-lg bg-surface p-8">
        {/* Dialog Header */}
        <DialogHeader>
          <DialogTitle className="font-semibold text-text-700">
            Save as Template
          </DialogTitle>
        </DialogHeader>

        {/* Two Column Form Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Template Info */}
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name
              </label>
              <Input
                placeholder="Enter template name"
                value={templateData.name}
                onChange={(e) =>
                  setTemplateData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                placeholder="Describe your template"
                value={templateData.description}
                onChange={(e) =>
                  setTemplateData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="h-24 max-h-96"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <CustomSelect
                id="category"
                value={templateData.category}
                options={categories.map(({ path, name }) => ({
                  value: path,
                  label: name,
                }))}
                onChange={({ target: { value } }) =>
                  setTemplateData((prev) => ({ ...prev, category: value }))
                }
                placeholder="Select a category"
              />
            </div>
          </div>

          {/* Right Column: Image and Additional Options */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview Image
              </label>
              <div className="flex items-center gap-4">
                <label className="block">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                </label>
                {templateData.preview_image && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleRemoveImage}
                    title="Remove Image"
                    size="icon"
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {/* Image Preview with upload progress */}
              {templateData.preview_image && (
                <div className="relative mt-2 aspect-[4/2.5] rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={templateData.preview_image}
                    alt="Preview"
                    fill
                    objectFit="cover"
                  />
                  {isSaving && uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white">
                        Uploading... {uploadProgress}%
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Featured Checkbox */}
            <div>
              <Checkbox
                id="is_featured"
                checked={templateData.is_featured}
                onChange={(ev) =>
                  setTemplateData((prev) => ({
                    ...prev,
                    is_featured: ev.target.checked,
                  }))
                }
                label="Featured Template"
              />
            </div>
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Footer Actions */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateManager;
