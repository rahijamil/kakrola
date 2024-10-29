"use client";
import React, { ReactNode } from "react";
import Image from "next/image";
import {
  Gauge,
  LayoutDashboard,
  Wand2,
  Bell,
  Search,
  ScrollText,
  Clock,
  Shapes,
  Hash,
  MessageSquareMore,
  MessagesSquare,
  Rocket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  SiAsana,
  SiConfluence,
  SiDiscord,
  SiGitbook,
  SiNotion,
  SiSlack,
  SiTrello,
} from "react-icons/si";
import { CgMonday } from "react-icons/cg";
import { BsMicrosoftTeams } from "react-icons/bs";

interface FeatureInterface {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  gradient: string;
  category: string;
  alternatives: {
    name: string;
    logo: ReactNode;
  }[];
  features: {
    icon: ReactNode;
    text: string;
  }[];
}

const features: FeatureInterface[] = [
  {
    title: "Work that flows",
    description:
      "Track projects, hit deadlines, and keep everyone aligned—without the chaos.",
    image: "/images/board_view.png",
    imageAlt: "Project management dashboard",
    gradient: "from-tangerine-200 to-kakrola-200",
    category: "Project Management",
    alternatives: [
      {
        name: "Trello",
        logo: <SiTrello className="w-5 h-5" />,
      },
      {
        name: "Asana",
        logo: <SiAsana className="w-5 h-5" />,
      },
      {
        name: "Monday",
        logo: <CgMonday className="w-5 h-5" />,
      },
    ],
    features: [
      {
        icon: <Gauge className="w-5 h-5 text-primary-500" strokeWidth={1.5} />,
        text: "Everything at a glance",
      },
      {
        icon: (
          <LayoutDashboard
            className="w-5 h-5 text-primary-500"
            strokeWidth={1.5}
          />
        ),
        text: "Flexible views",
      },
      {
        icon: <Wand2 className="w-5 h-5 text-primary-500" strokeWidth={1.5} />,
        text: "Smart automation",
      },
      {
        icon: <Bell className="w-5 h-5 text-primary-500" strokeWidth={1.5} />,
        text: "Stay updated",
      },
    ],
  },
  {
    title: "Team knowledge, organized",
    description: "Your team's docs, decisions, and processes—all in one place.",
    image: "/images/docs.png",
    imageAlt: "Document management interface",
    gradient: "from-moonstone-200 to-kakrola-200",
    category: "Documentation",
    alternatives: [
      {
        name: "Notion",
        logo: <SiNotion className="w-5 h-5" />,
      },
      {
        name: "Confluence",
        logo: <SiConfluence className="w-5 h-5" />,
      },
      {
        name: "GitBook",
        logo: <SiGitbook className="w-5 h-5" />,
      },
    ],
    features: [
      {
        icon: (
          <ScrollText className="w-5 h-5 text-primary-500" strokeWidth={1.5} />
        ),
        text: "Rich documents",
      },
      {
        icon: <Search className="w-5 h-5 text-primary-500" strokeWidth={1.5} />,
        text: "Quick search",
      },
      {
        icon: <Shapes className="w-5 h-5 text-primary-500" strokeWidth={1.5} />,
        text: "Ready-made templates",
      },
      {
        icon: <Clock className="w-5 h-5 text-primary-500" strokeWidth={1.5} />,
        text: "Real-time collaboration",
      },
    ],
  },
  {
    title: "Discussions that drive work forward",
    description:
      "Organized conversations that keep your team in sync, not buried in DMs. A focused alternative to scattered communication tools.",
    image: "/images/channel.png",
    imageAlt:
      "Team communication interface showing channels and thread discussions",
    gradient: "from-kale-200 to-kakrola-200",
    category: "Team Communication",
    alternatives: [
      {
        name: "Slack",
        logo: <SiSlack className="w-5 h-5" />,
      },
      {
        name: "Microsoft Teams",
        logo: <BsMicrosoftTeams className="w-5 h-5" />,
      },
      {
        name: "Discord",
        logo: <SiDiscord className="w-5 h-5" />,
      },
    ],
    features: [
      {
        icon: <Hash className="w-6 h-6 text-primary-500" strokeWidth={1.5} />,
        text: "Channels that match your workflow",
      },
      {
        icon: (
          <MessageSquareMore
            className="w-6 h-6 text-primary-500"
            strokeWidth={1.5}
          />
        ),
        text: "Rich threads for deeper discussions",
      },
      {
        icon: (
          <MessagesSquare
            className="w-6 h-6 text-primary-500"
            strokeWidth={1.5}
          />
        ),
        text: "Quick DMs when needed",
      },
      {
        icon: <Rocket className="w-6 h-6 text-primary-500" strokeWidth={1.5} />,
        text: "Everything searchable",
      },
    ],
  },
];

const Feature = ({
  feature: {
    title,
    description,
    image,
    imageAlt,
    gradient,
    category,
    features,
    alternatives,
  },
}: {
  feature: FeatureInterface;
}) => (
  <div className="relative">
    <div className="wrapper">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="mb-4">
              {category}
            </Badge>
            <h2 className="font-bold text-gray-900 text-4xl leading-tight">
              {title}
            </h2>
            <p className="text-lg text-gray-600">{description}</p>
          </div>

          <div className="relative lg:hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-3xl transform rotate-3 opacity-80`}
            />
            <div className="relative">
              <Image
                src={image}
                alt={imageAlt}
                width={600}
                height={400}
                className="rounded-2xl shadow-xl relative z-10"
                priority
              />
            </div>
          </div>

          <ul className="grid sm:grid-cols-2 gap-4">
            {features.map((item, idx) => (
              <li key={idx} className="flex items-center gap-4 sm:p-3">
                <div className="p-2 rounded-lg bg-primary-50">{item.icon}</div>
                <span className="text-gray-700">{item.text}</span>
              </li>
            ))}
          </ul>

          {/* Subtle alternatives section */}
          <div className="pt-8 border-t border-gray-100">
            <div className="text-sm text-gray-500 mb-4">Alternative to</div>
            <div className="flex flex-wrap gap-6 items-center">
              {alternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className="opacity-40 hover:opacity-60 transition-opacity grayscale flex items-center gap-2"
                >
                  {alt.logo}
                  {alt.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div
            className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-3xl transform rotate-3 opacity-80`}
          />
          <div className="relative">
            <Image
              src={image}
              alt={imageAlt}
              width={600}
              height={400}
              className="rounded-2xl shadow-xl relative z-10"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProjectSection = () => {
  return (
    <section className="bg-white space-y-20 md:space-y-40 md:py-20">
      {features.map((feature, index) => (
        <Feature key={index} feature={feature} />
      ))}
    </section>
  );
};

export default ProjectSection;
