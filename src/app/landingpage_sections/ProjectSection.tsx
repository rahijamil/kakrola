import React from "react";
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

const ProjectSection = () => {
  return (
    <section className="py-20 md:pb-32 space-y-32 md:space-y-60">
      <div className="bg-gradient-to-b from-white via-primary-50 to-white">
        <div className="grid md:grid-cols-2 gap-12 items-center wrapper">
          <div>
            <h3 className="font-bold text-gray-900 text-4xl sm:text-5xl leading-tight mb-6">
              Work that flows
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Track projects, hit deadlines, and keep everyone aligned—without
              the chaos.
            </p>
            <ul className="space-y-4">
              {[
                {
                  icon: (
                    <Gauge
                      className="w-6 h-6 text-primary-500"
                      strokeWidth={1.5}
                    />
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
                    <Wand2
                      className="w-6 h-6 text-primary-500"
                      strokeWidth={1.5}
                    />
                  ),
                  text: "Automate the busywork",
                },
                {
                  icon: (
                    <Bell
                      className="w-6 h-6 text-primary-500"
                      strokeWidth={1.5}
                    />
                  ),
                  text: "Never miss updates",
                },
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="mr-4">{feature.icon}</div>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-tangerine-200 to-kakrola-200 rounded-3xl transform rotate-3"></div>
            <Image
              src="/images/feature1.png"
              alt="Kakrola project management interface"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl relative z-10 transform -rotate-3 transition-all duration-300 hover:rotate-0"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-white via-primary-50 to-white">
        <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center wrapper">
          <div className="order-2 md:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-moonstone-200 to-kakrola-200 rounded-3xl transform rotate-3"></div>
            <Image
              src="/images/feature2.png"
              alt="Kakrola pages interface"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl relative z-10 transform -rotate-3 transition-all duration-300 hover:rotate-0"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-bold text-gray-900 text-4xl sm:text-5xl leading-tight mb-6">
              Team knowledge, instantly searchable
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your team's docs, decisions, and processes—organized and
              accessible.
            </p>
            <ul className="space-y-4">
              {[
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
                    <Search
                      className="w-6 h-6 text-primary-500"
                      strokeWidth={1.5}
                    />
                  ),
                  text: "Find anything in seconds",
                },
                {
                  icon: (
                    <Shapes
                      className="w-6 h-6 text-primary-500"
                      strokeWidth={1.5}
                    />
                  ),
                  text: "Templates that save hours",
                },
                {
                  icon: (
                    <Clock
                      className="w-6 h-6 text-primary-500"
                      strokeWidth={1.5}
                    />
                  ),
                  text: "Real-time, like Google Docs",
                },
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="mr-4">{feature.icon}</div>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-white via-primary-50 to-white">
        <div className="grid md:grid-cols-2 gap-12 items-center wrapper">
          <div>
            <h2 className="font-bold text-gray-900 text-4xl sm:text-5xl leading-tight mb-6">
              Discussions that drive work forward
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Organized conversations that keep your team in sync, not buried in
              DMs.
            </p>
            <ul className="space-y-4">
              {[
                {
                  icon: (
                    <Hash
                      className="w-6 h-6 text-primary-500"
                      strokeWidth={1.5}
                    />
                  ),
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
                    <Rocket
                      className="w-6 h-6 text-primary-500"
                      strokeWidth={1.5}
                    />
                  ),
                  text: "Everything searchable",
                },
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="mr-4">{feature.icon}</div>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-kale-200 to-kakrola-200 rounded-3xl transform rotate-3"></div>
            <Image
              src="/images/feature3.png"
              alt="Kakrola channels interface"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl relative z-10 transform -rotate-3 transition-all duration-300 hover:rotate-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
