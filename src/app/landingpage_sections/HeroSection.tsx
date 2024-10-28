"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  ArrowRight,
  CheckCircle2,
  FileText,
  Hash,
  Building2,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    id: "project",
    title: "Project Management",
    description:
      "Track projects with multiple views, custom fields, and automated workflows",
    icon: <CheckCircle2 className="w-6 h-6" />,
    stat: "50% fewer meetings",
    color: "bg-blue-500",
  },
  {
    id: "docs",
    title: "Document Collaboration",
    description:
      "Real-time collaboration with rich-text editing and version history",
    icon: <FileText className="w-6 h-6" />,
    stat: "30% faster documentation",
    color: "bg-purple-500",
  },
  {
    id: "chat",
    title: "Team Communication",
    description:
      "Organized discussions with threads, channels, and file sharing",
    icon: <Hash className="w-6 h-6" />,
    stat: "40% less context switching",
    color: "bg-green-500",
  },
];

export default function HeroSection() {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-primary-50 to-white">
      <div className="wrapper py-20 md:pb-32">
        <div className="relative z-10">
          {/* Top Stats Bar */}
          <div className="flex justify-center flex-wrap gap-8 mb-16 whitespace-nowrap">
            {/* <div className="flex items-center gap-2">
              <Users className="w-5 h-5 min-h-5 min-w-5 text-primary-600" />
              <span className="text-sm">1,234+ Active Teams</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 min-h-5 min-w-5 text-primary-600" />
              <span className="text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 min-h-5 min-w-5 text-primary-600" />
              <span className="text-sm">2h Support Response</span>
            </div> */}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full">
                <span className="text-primary-700 text-sm font-medium">
                  30-Day Money-Back Guarantee
                </span>
                <ArrowRight className="w-4 h-4 ml-2 text-primary-700" />
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                The Complete
                <br />
                <span className="relative inline-block">
                  Workspace
                  <motion.div
                    className="absolute -bottom-2 left-0 w-full h-3 bg-primary-200 -z-10"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </span>
                <br />
                for Teams
              </h1>

              <p className="text-xl text-gray-600">
                Join growing teams who've simplified their workflow, reduced
                meetings, and gotten more done with our all-in-one solution.
              </p>

              <div className="flex items-center flex-wrap gap-6">
                <Link href="/auth/signup" className="w-full sm:w-fit">
                  <Button size="lg" className="shadow-lg w-full sm:w-fit">
                    <Rocket className="w-5 h-5 mr-2" />
                    Start 7-Day Trial
                  </Button>
                </Link>
                {/* <span className="text-sm text-gray-500">
                  From $10/month per user
                </span> */}
              </div>
            </div>

            {/* Right Column - Feature Showcase */}
            <div className="relative hidden lg:block">
              <div className="bg-white rounded-xl shadow-xl p-8">
                <div className="space-y-6">
                  {features.map((feature) => (
                    <motion.div
                      key={feature.id}
                      className={`p-6 rounded-lg cursor-pointer transition-all ${
                        activeFeature.id === feature.id
                          ? "bg-primary-50 border border-primary-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveFeature(feature)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg ${feature.color} bg-opacity-10`}
                        >
                          {feature.icon}
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600">{feature.description}</p>
                          <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                              {feature.stat}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
          <div className="aspect-square h-96 rounded-full bg-gradient-to-br from-primary-400 to-purple-400" />
        </div>
      </div>
    </div>
  );
}
