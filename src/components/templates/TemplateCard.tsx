import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Eye,
  Star,
  FileText,
  Hash,
  CheckCircle,
  Image as ImageIcon,
  Clock,
  Users,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import {
  ChannelTemplate,
  PageTemplate,
  ProjectTemplate,
} from "@/types/templateTypes";

const templateTypeIcons = {
  project: CheckCircle,
  page: FileText,
  channel: Hash,
} as const;

const TemplateCard = ({
  template,
  isSelected,
  onSelect,
  onUse,
}: {
  template: ProjectTemplate | PageTemplate | ChannelTemplate;
  isSelected: boolean;
  onSelect: (
    template: ProjectTemplate | PageTemplate | ChannelTemplate
  ) => void;
  onUse: (template: ProjectTemplate | PageTemplate | ChannelTemplate) => void;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const TypeIcon = templateTypeIcons[template.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-200 overflow-hidden",
          "hover:shadow-lg hover:border-primary-200",
          isSelected && "ring-2 ring-primary-500 border-transparent",
          "h-fit flex flex-col"
        )}
        onClick={() => onSelect(template)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Preview Image Container */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-50">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />

          {template.preview_image && !imageError ? (
            <img
              src={template.preview_image}
              alt={template.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <TypeIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Floating badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-20">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              <TypeIcon
                className={cn(
                  "w-3 h-3 mr-1",
                  `text-${template.settings.color}`
                )}
              />
              {template.type}
            </Badge>
            {template.is_featured && (
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm"
              >
                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                Featured
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="flex-1 p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {template.description}
          </p>

          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {template.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        {/* <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />5 min setup
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {Math.floor(Math.random() * 1000)}
              </span>
            </div>
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isSelected && "rotate-90"
              )}
            />
          </div>
        </CardFooter> */}
      </Card>
    </motion.div>
  );
};

export default TemplateCard;
