"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircle,
  FileText,
  Hash,
  Users,
  Zap,
  MessagesSquare,
  Building2,
  Shield,
  Clock,
  Rocket,
  ArrowRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Projects",
    description:
      "Track tasks, set milestones, and hit deadlines with powerful project tools.",
    color: "text-kakrola-400",
    bgColor: "bg-kakrola-50",
  },
  {
    icon: FileText,
    title: "Pages",
    description:
      "Collaborative documentation with real-time editing and version control.",
    color: "text-moonstone-400",
    bgColor: "bg-moonstone-50",
  },
  {
    icon: Hash,
    title: "Channels",
    description:
      "Keep discussions organized with dedicated spaces for every topic.",
    color: "text-kale-400",
    bgColor: "bg-kale-50",
  },
  {
    icon: MessagesSquare,
    title: "DMs",
    description: "Quick, secure messaging for direct team communication.",
    color: "text-tangerine-400",
    bgColor: "bg-tangerine-50",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Built for teams with roles, permissions, and shared workspaces.",
    color: "text-lavender-400",
    bgColor: "bg-lavender-50",
  },
  {
    icon: Zap,
    title: "Integrations",
    description:
      "Connect with your favorite tools through our extensive integration hub.",
    color: "text-raspberry-400",
    bgColor: "bg-raspberry-50",
  },
];

const pricingHighlights = [
  {
    icon: Building2,
    title: "Professional",
    description: "Starting at $10/user/month",
  },
  {
    icon: Shield,
    title: "Enterprise",
    description: "Custom pricing for large teams",
  },
];

export const FeatureGrid = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="relative z-10 wrapper">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help your team collaborate,
            communicate, and deliver results.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-y-12">
          {features.map((feature) => (
            <div key={feature.title} className="group relative">
              <div className="relative p-4 md:p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-start space-x-5">
                  <div className={`${feature.bgColor} p-3 rounded-xl`}>
                    <feature.icon
                      className={`h-6 w-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-kakrola-50/30 to-lavender-50/30 rounded-full blur-3xl" />
      </div>
    </section>
  );
};
