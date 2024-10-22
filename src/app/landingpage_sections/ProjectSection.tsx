"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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

const ProjectSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  const features = [
    {
      title: "Work that flows",
      description:
        "Track projects, hit deadlines, and keep everyone aligned—without the chaos.",
      image: "/images/feature1.png",
      imageAlt:
        "Project management dashboard showing task tracking and team alignment features",
      gradient: "from-tangerine-200 to-kakrola-200",
      features: [
        {
          icon: (
            <Gauge className="w-6 h-6 text-primary-500" strokeWidth={1.5} />
          ),
          text: "See everything in flight, at a glance",
        },
        {
          icon: (
            <LayoutDashboard
              className="w-6 h-6 text-primary-500"
              strokeWidth={1.5}
            />
          ),
          text: "Customize views your way—list, board, or calendar",
        },
        {
          icon: (
            <Wand2 className="w-6 h-6 text-primary-500" strokeWidth={1.5} />
          ),
          text: "Automate the busywork",
        },
        {
          icon: <Bell className="w-6 h-6 text-primary-500" strokeWidth={1.5} />,
          text: "Never miss updates",
        },
      ],
    },
    {
      title: "Team knowledge, instantly searchable",
      description:
        "Your team's docs, decisions, and processes—organized and accessible.",
      image: "/images/feature2.png",
      imageAlt:
        "Document management interface showing search and organization features",
      gradient: "from-moonstone-200 to-kakrola-200",
      features: [
        {
          icon: (
            <ScrollText
              className="w-6 h-6 text-primary-500"
              strokeWidth={1.5}
            />
          ),
          text: "Rich docs that feel native",
        },
        {
          icon: (
            <Search className="w-6 h-6 text-primary-500" strokeWidth={1.5} />
          ),
          text: "Find anything in seconds",
        },
        {
          icon: (
            <Shapes className="w-6 h-6 text-primary-500" strokeWidth={1.5} />
          ),
          text: "Templates that save hours",
        },
        {
          icon: (
            <Clock className="w-6 h-6 text-primary-500" strokeWidth={1.5} />
          ),
          text: "Real-time, like Google Docs",
        },
      ],
    },
    {
      title: "Discussions that drive work forward",
      description:
        "Organized conversations that keep your team in sync, not buried in DMs.",
      image: "/images/feature3.png",
      imageAlt:
        "Team communication interface showing channels and thread discussions",
      gradient: "from-kale-200 to-kakrola-200",
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
          icon: (
            <Rocket className="w-6 h-6 text-primary-500" strokeWidth={1.5} />
          ),
          text: "Everything searchable",
        },
      ],
    },
  ];

  return (
    <section className="py-20 md:pb-32 space-y-32 md:space-y-60 bg-gradient-to-b from-white via-primary-50 to-white">
      {features.map((feature, index) => (
        <article
          key={index}
          className="relative"
          // Add structured data for SEO
          itemScope
          itemType="http://schema.org/Product"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`grid md:grid-cols-2 gap-12 lg:gap-20 items-center ${
                index % 2 === 1 ? "md:grid-flow-col-dense" : ""
              }`}
            >
              <motion.div
                className={`space-y-8 ${
                  index % 2 === 1 ? "md:col-start-2" : ""
                }`}
                {...fadeInUp}
              >
                <div className="space-y-4">
                  <motion.h2
                    className="font-bold text-gray-900 text-4xl sm:text-5xl leading-tight"
                    itemProp="name"
                  >
                    {feature.title}
                  </motion.h2>
                  <motion.p
                    className="text-lg text-gray-600"
                    itemProp="description"
                  >
                    {feature.description}
                  </motion.p>
                </div>

                <motion.ul
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {feature.features.map((item, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="flex items-center gap-4 group"
                      {...fadeInUp}
                    >
                      <div className="p-2 rounded-lg bg-primary-100 group-hover:bg-primary-200 transition-colors duration-200">
                        {item.icon}
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                        {item.text}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              <motion.div
                className={`relative ${
                  index % 2 === 1 ? "md:col-start-1" : ""
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl transform rotate-3 opacity-80`}
                />
                <div className="relative group">
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl relative z-10 transform -rotate-3 transition-all duration-500 group-hover:rotate-0 group-hover:scale-105"
                    priority={index === 0}
                    itemProp="image"
                  />
                  {/* Add a subtle hover effect overlay */}
                  <div className="absolute inset-0 bg-primary-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl z-20" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Add decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply opacity-10 animate-blob" />
            <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-secondary-100 rounded-full mix-blend-multiply opacity-10 animate-blob animation-delay-2000" />
          </div>
        </article>
      ))}
    </section>
  );
};

export default ProjectSection;
