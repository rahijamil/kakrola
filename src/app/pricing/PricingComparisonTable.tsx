import React, { useState } from "react";
import { Check, X, HelpCircle, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Enums and Types
enum FeatureEnum {
  PROJECTS = "Projects",
  TEAM_MEMBERS = "Team members",
  TASK_MANAGEMENT = "Task management",
  VIEWS = "Views (List, Board)",
  MOBILE_APP_ACCESS = "Mobile app access",
  CUSTOM_FIELDS = "Custom fields",
  GANTT_CHARTS = "Gantt charts",
  TIMELINE_VIEW = "Timeline view",
  CALENDAR_VIEW = "Calendar view",
  TIME_TRACKING = "Time tracking",
  WORKFLOW_AUTOMATION = "Workflow automation",
  REPORTING_AND_DASHBOARDS = "Reporting and dashboards",
  TASK_COMMENTS = "Task comments",
  FILE_SHARING = "File sharing",
  TEAM_CHANNELS = "Team channels",
  GUEST_ACCESS = "Guest access",
  PROOFING_AND_APPROVALS = "Proofing and approvals",
  TEMPLATES = "Templates",
  INTEGRATIONS = "Integrations",
  API_ACCESS = "API access",
  CUSTOM_BRANDING = "Custom branding",
  TWO_FACTOR_AUTH = "Two-factor authentication",
  SSO = "SSO (SAML)",
  ADVANCED_PERMISSIONS = "Advanced permissions",
  USER_PROVISIONING = "User provisioning (SCIM)",
  DATA_ENCRYPTION = "Data encryption at rest",
  CUSTOMER_SUPPORT = "Customer support",
  DEDICATED_MANAGER = "Dedicated success manager",
}

interface Feature {
  name: FeatureEnum;
  plus: string | boolean;
  business: string | boolean;
}

interface Category {
  category: string;
  features: Feature[];
}

const comparisonFeatures: Category[] = [
  {
    category: "Core Features",
    features: [
      {
        name: FeatureEnum.PROJECTS,
        plus: "Unlimited",
        business: "Unlimited",
      },
      {
        name: FeatureEnum.TEAM_MEMBERS,
        plus: "Unlimited",
        business: "Unlimited",
      },
      {
        name: FeatureEnum.TASK_MANAGEMENT,
        plus: "Advanced",
        business: "Advanced",
      },
      {
        name: FeatureEnum.VIEWS,
        plus: true,
        business: true,
      },
      {
        name: FeatureEnum.MOBILE_APP_ACCESS,
        plus: true,
        business: true,
      },
    ],
  },
  {
    category: "Advanced Features",
    features: [
      {
        name: FeatureEnum.CUSTOM_FIELDS,
        plus: true,
        business: true,
      },
      {
        name: FeatureEnum.GANTT_CHARTS,
        plus: true,
        business: true,
      },
      {
        name: FeatureEnum.TIMELINE_VIEW,
        plus: true,
        business: true,
      },
      {
        name: FeatureEnum.CALENDAR_VIEW,
        plus: true,
        business: true,
      },
      {
        name: FeatureEnum.TIME_TRACKING,
        plus: true,
        business: true,
      },
      {
        name: FeatureEnum.WORKFLOW_AUTOMATION,
        plus: "Basic",
        business: "Advanced",
      },
      {
        name: FeatureEnum.REPORTING_AND_DASHBOARDS,
        plus: "Basic",
        business: "Advanced",
      },
    ],
  },
  {
    category: "Collaboration",
    features: [
      {
        name: FeatureEnum.TASK_COMMENTS,
        plus: "Advanced",
        business: "Advanced",
      },
      {
        name: FeatureEnum.FILE_SHARING,
        plus: true,
        business: true,
      },
      {
        name: FeatureEnum.TEAM_CHANNELS,
        plus: true,
        business: true,
      },
      {
        name: FeatureEnum.GUEST_ACCESS,
        plus: true,
        business: true,
      },
      {
        name: FeatureEnum.PROOFING_AND_APPROVALS,
        plus: false,
        business: true,
      },
    ],
  },
  {
    category: "Customization & Integration",
    features: [
      {
        name: FeatureEnum.TEMPLATES,
        plus: "Custom",
        business: "Advanced",
      },
      {
        name: FeatureEnum.INTEGRATIONS,
        plus: "Advanced",
        business: "Enterprise-grade",
      },
      {
        name: FeatureEnum.API_ACCESS,
        plus: false,
        business: true,
      },
      {
        name: FeatureEnum.CUSTOM_BRANDING,
        plus: false,
        business: true,
      },
    ],
  },
  {
    category: "Security & Administration",
    features: [
      {
        name: FeatureEnum.TWO_FACTOR_AUTH,
        plus: true,
        business: true,
      },
      {
        name: FeatureEnum.SSO,
        plus: false,
        business: true,
      },
      {
        name: FeatureEnum.ADVANCED_PERMISSIONS,
        plus: true,
        business: true,
      },
      {
        name: FeatureEnum.USER_PROVISIONING,
        plus: false,
        business: true,
      },
      {
        name: FeatureEnum.DATA_ENCRYPTION,
        plus: false,
        business: true,
      },
    ],
  },
  {
    category: "Support",
    features: [
      {
        name: FeatureEnum.CUSTOMER_SUPPORT,
        plus: "Priority email",
        business: "24/7 priority",
      },
      {
        name: FeatureEnum.DEDICATED_MANAGER,
        plus: false,
        business: true,
      },
    ],
  },
];

// Feature descriptions with comprehensive details
const featureDescriptions: Record<FeatureEnum, string> = {
  [FeatureEnum.PROJECTS]:
    "Create and manage unlimited projects with tasks, timelines, and team collaboration. Organize work efficiently with customizable project structures.",
  [FeatureEnum.TEAM_MEMBERS]:
    "Add unlimited team members to your workspace. Collaborate seamlessly with role-based access control and team management features.",
  [FeatureEnum.TASK_MANAGEMENT]:
    "Comprehensive task management with priorities, dependencies, due dates, and custom workflows. Track progress and manage workload efficiently.",
  [FeatureEnum.VIEWS]:
    "Flexible views including List and Board layouts to visualize your work in different ways. Switch between views instantly based on your needs.",
  [FeatureEnum.MOBILE_APP_ACCESS]:
    "Access your workspace on the go with our mobile app. Stay connected and productive from anywhere.",
  [FeatureEnum.CUSTOM_FIELDS]:
    "Create custom fields to track specific information relevant to your workflow. Adapt the platform to your unique needs.",
  [FeatureEnum.GANTT_CHARTS]:
    "Visualize project timelines and dependencies with interactive Gantt charts. Plan and adjust schedules with drag-and-drop simplicity.",
  [FeatureEnum.TIMELINE_VIEW]:
    "Get a bird's-eye view of project timelines and milestones. Perfect for planning and tracking long-term projects.",
  [FeatureEnum.CALENDAR_VIEW]:
    "View tasks and deadlines in a familiar calendar format. Schedule meetings and coordinate team activities efficiently.",
  [FeatureEnum.TIME_TRACKING]:
    "Track time spent on tasks and projects. Generate detailed reports for billing and productivity analysis.",
  [FeatureEnum.WORKFLOW_AUTOMATION]:
    "Automate repetitive tasks and processes. Create custom triggers and actions to streamline your workflow.",
  [FeatureEnum.REPORTING_AND_DASHBOARDS]:
    "Generate insightful reports and customizable dashboards. Monitor progress and make data-driven decisions.",
  [FeatureEnum.TASK_COMMENTS]:
    "Collaborate on tasks with threaded comments, @mentions, and file attachments. Keep all relevant discussions in context.",
  [FeatureEnum.FILE_SHARING]:
    "Share and organize files within projects and tasks. Preview files directly in the platform.",
  [FeatureEnum.TEAM_CHANNELS]:
    "Create dedicated channels for team communication. Organize discussions by topic or project.",
  [FeatureEnum.GUEST_ACCESS]:
    "Invite external collaborators with limited access. Perfect for working with clients or contractors.",
  [FeatureEnum.PROOFING_AND_APPROVALS]:
    "Streamline review processes with built-in proofing tools. Track approval status and feedback in one place.",
  [FeatureEnum.TEMPLATES]:
    "Save time with pre-built and custom templates. Standardize workflows and ensure consistency.",
  [FeatureEnum.INTEGRATIONS]:
    "Connect with your favorite tools and services. Streamline your workflow with powerful integrations.",
  [FeatureEnum.API_ACCESS]:
    "Build custom integrations and automate processes with our comprehensive API.",
  [FeatureEnum.CUSTOM_BRANDING]:
    "Customize the platform with your brand colors and logo. Create a cohesive experience for your team.",
  [FeatureEnum.TWO_FACTOR_AUTH]:
    "Enhanced security with two-factor authentication. Protect your workspace with an extra layer of security.",
  [FeatureEnum.SSO]:
    "Single Sign-On integration for enterprise security. Streamline authentication and enhance security.",
  [FeatureEnum.ADVANCED_PERMISSIONS]:
    "Fine-grained control over user permissions. Define custom roles and access levels.",
  [FeatureEnum.USER_PROVISIONING]:
    "Automate user management with SCIM provisioning. Perfect for large organizations.",
  [FeatureEnum.DATA_ENCRYPTION]:
    "Enterprise-grade encryption for data at rest. Keep your sensitive information secure.",
  [FeatureEnum.CUSTOMER_SUPPORT]:
    "Get help when you need it from our dedicated support team. Multiple support channels available.",
  [FeatureEnum.DEDICATED_MANAGER]:
    "Personal success manager to help you achieve your goals. Regular check-ins and strategic guidance.",
};

const PricingComparisonTable = () => {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const renderValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-red-500 mx-auto" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="w-full wrapper bg-white shadow-xl rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-1/3 py-6 px-6">
              <span className="text-xl font-semibold text-gray-800">
                Features
              </span>
            </TableHead>
            <TableHead className="w-1/3 text-center py-6 px-6">
              <span className="text-xl font-semibold text-gray-800">Plus</span>
              <Badge variant="secondary" className="ml-2">
                $120/seat/year
              </Badge>
            </TableHead>
            <TableHead className="w-1/3 text-center py-6 px-6">
              <span className="text-xl font-semibold text-gray-800">
                Business
              </span>
              <Badge variant="secondary" className="ml-2">
                $180/seat/year
              </Badge>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisonFeatures.map((category, categoryIndex) => (
            <React.Fragment key={category.category}>
              <TableRow
                className="bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === categoryIndex ? null : categoryIndex
                  )
                }
              >
                <TableCell colSpan={3} className="py-4 px-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-800">
                      {category.category}
                    </span>
                    <ChevronRight
                      className={`h-5 w-5 text-gray-600 transition-transform ${
                        expandedCategory === categoryIndex
                          ? "transform rotate-90"
                          : ""
                      }`}
                    />
                  </div>
                </TableCell>
              </TableRow>
              {expandedCategory === categoryIndex &&
                category.features.map((feature, featureIndex) => (
                  <TableRow
                    key={`${categoryIndex}-${featureIndex}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="py-4 px-6">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                            <span className="font-medium">{feature.name}</span>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="max-w-xs bg-white p-4 rounded-lg shadow-lg border border-gray-200"
                          >
                            <p className="text-sm leading-relaxed text-gray-600">
                              {featureDescriptions[feature.name]}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center py-4 px-6">
                      {renderValue(feature.plus)}
                    </TableCell>
                    <TableCell className="text-center py-4 px-6">
                      {renderValue(feature.business)}
                    </TableCell>
                  </TableRow>
                ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center gap-4 p-6 bg-gray-50">
        <Button variant="outline">Start Plus Trial</Button>
        <Button>Start Business Trial</Button>
      </div>
    </div>
  );
};

export default PricingComparisonTable;
