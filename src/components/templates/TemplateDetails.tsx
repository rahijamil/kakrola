"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Hash,
  CheckCircle,
  Copy,
  Clock,
  Users,
} from "lucide-react";
import {
  PageTemplate,
  ProjectTemplate,
  ChannelTemplate,
} from "@/types/templateTypes";
import Image from "next/image";

const templateTypeIcons = {
  project: CheckCircle,
  page: FileText,
  channel: Hash,
} as const;

type TemplateType = PageTemplate | ProjectTemplate | ChannelTemplate;

export default function TemplateDetails({
  template,
  onBack,
  onUse,
  useTemplateLoading,
}: {
  template: TemplateType;
  onBack: () => void;
  onUse: (template: TemplateType) => void;
  useTemplateLoading: boolean;
}) {
  const TypeIcon = templateTypeIcons[template.type];

  const renderTemplateSpecificInfo = () => {
    switch (template.type) {
      case "page":
        return (
          <p className="text-sm text-muted-foreground">
            A customizable page template for your workspace.
          </p>
        );
      case "project":
        return (
          <p className="text-sm text-muted-foreground">
            A project template with predefined sections and tasks.
          </p>
        );
      case "channel":
        return (
          <p className="text-sm text-muted-foreground">
            A channel template for team communication.
          </p>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex flex-col h-full bg-background rounded-lg"
    >
      <div className="flex items-center justify-between p-4 border-b h-[53px]">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          <TypeIcon className="w-3 h-3 mr-1" />
          {template.type}
        </Badge>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{template.name}</h1>
          <p className="text-muted-foreground">{template.description}</p>
        </div>

        {template.preview_image && (
          <div className="aspect-[4/2.5] bg-muted rounded-lg border shadow-sm overflow-hidden relative">
            <Image
              src={template.preview_image}
              alt={template.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {template.tags?.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="border-t p-4 flex justify-between items-center bg-muted/50">
        <p className="text-sm text-muted-foreground">
          {renderTemplateSpecificInfo()}
        </p>
        <Button onClick={() => onUse(template)} disabled={useTemplateLoading}>
          <Copy className="w-4 h-4 mr-2" />
          {useTemplateLoading ? "Loading..." : "Use template"}
        </Button>
      </div>
    </motion.div>
  );
}
