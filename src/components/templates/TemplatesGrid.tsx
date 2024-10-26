import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useTemplates } from "@/hooks/useTemplates";
import {
  ChannelTemplate,
  PageTemplate,
  ProjectTemplate,
  templateService,
} from "@/types/templateTypes";
import { Skeleton } from "@/components/ui/skeleton";
import TemplateCard from "./TemplateCard";
import TemplateDetails from "./TemplateDetails";
import { cn } from "@/lib/utils";
import { useAuthProvider } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import {
  PersonalMemberForPageType,
  PersonalMemberForProjectType,
  TeamMemberType,
  TeamType,
} from "@/types/team";
import { ProjectType, SectionType } from "@/types/project";
import { PageType } from "@/types/pageTypes";
import { ChannelType } from "@/types/channel";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";

const TemplatesGrid = ({ category }: { category: string }) => {
  const { data: templates, isLoading, error } = useTemplates(category);
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<
    ProjectTemplate | PageTemplate | ChannelTemplate | null
  >(null);
  const { profile } = useAuthProvider();
  const queryClient = useQueryClient();
  const { projects } = useSidebarDataProvider();
  const [useTemplateLoading, setUseTemplateLoading] = useState(false);

  if (error) {
    toast({
      title: "Error loading templates",
      description: "Failed to load templates. Please try again later.",
      variant: "destructive",
    });
  }

  const onTemplateUse = async (
    template: ProjectTemplate | PageTemplate | ChannelTemplate
  ) => {
    if (!profile?.id || !profile.metadata?.current_workspace_id) {
      console.error("No Workspace available");
      return;
    }

    try {
      setUseTemplateLoading(true);

      if (template.type === "project") {
        const { project, member } =
          await templateService.createProjectFromTemplate(
            template as ProjectTemplate,
            {
              team_id: null,
              profile_id: profile.id,
              projectsLength: projects.length,
              workspace_id: profile.metadata.current_workspace_id,
            }
          );

        // Update query cache
        queryClient.setQueryData(
          [
            "sidebar_data",
            profile?.id,
            profile?.metadata?.current_workspace_id,
          ],
          (oldData: {
            personal_members: (
              | PersonalMemberForProjectType
              | PersonalMemberForPageType
            )[];
            projects: ProjectType[];
            sections: SectionType[];
            team_members: TeamMemberType[];
            teams: TeamType[];
            pages: PageType[];
            channels: ChannelType[];
          }) => {
            return {
              ...oldData,
              projects: [...oldData.projects, project],
              personal_members: [...oldData.personal_members, member],
            };
          }
        );

        toast({
          title: "Project created",
          description: "Project created successfully",
        });
      } else if (template.type === "page") {
        const { page, member } = await templateService.createPageFromTemplate(
          template,
          {
            team_id: null,
            workspace_id: profile.metadata.current_workspace_id,
            profile_id: profile.id,
            pagesLength: projects.length,
          }
        );

        // Update query cache
        queryClient.setQueryData(
          [
            "sidebar_data",
            profile?.id,
            profile?.metadata?.current_workspace_id,
          ],
          (oldData: {
            personal_members: (
              | PersonalMemberForProjectType
              | PersonalMemberForPageType
            )[];
            projects: ProjectType[];
            sections: SectionType[];
            team_members: TeamMemberType[];
            teams: TeamType[];
            pages: PageType[];
            channels: ChannelType[];
          }) => {
            return {
              ...oldData,
              pages: [...oldData.pages, page],
              personal_members: [...oldData.personal_members, member],
            };
          }
        );

        toast({
          title: "Project created",
          description: "Project created successfully",
        });
      } else if (template.type === "channel") {
        // Channel template handling
      }
    } catch (error) {
      console.error("Error in onTemplateUse:", error);
      // Log the full error details
      if (error instanceof Error) {
        console.error({
          message: error.message,
          stack: error.stack,
          cause: error.cause,
        });
      }

      toast({
        title: "Error using template",
        description:
          error instanceof Error
            ? error.message
            : "Failed to use template. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSelectedTemplate(null);
      setUseTemplateLoading(false);
    }
  };

  return (
    <div className="h-full">
      <motion.div
        layout
        className={cn(
          "h-full transition-all duration-300 ease-in-out",
          selectedTemplate ? "w-full" : "w-full"
        )}
      >
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4",
            "h-full overflow-y-auto"
          )}
        >
          {isLoading
            ? // Skeleton loading state
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : templates?.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate?.id === template.id}
                  onSelect={setSelectedTemplate}
                  onUse={onTemplateUse}
                />
              ))}
        </div>
      </motion.div>

      {/* Template Details Sidebar - Fixed width */}
      <AnimatePresence mode="wait">
        {selectedTemplate && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full overflow-hidden absolute inset-0"
          >
            <TemplateDetails
              template={selectedTemplate}
              onBack={() => setSelectedTemplate(null)}
              onUse={onTemplateUse}
              useTemplateLoading={useTemplateLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplatesGrid;
