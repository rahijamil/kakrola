import React from "react";
import { CheckCircle, FileText, Hash, Users, Calendar, Zap } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Task Management",
    description: "Organize and track your tasks with ease.",
  },
  {
    icon: FileText,
    title: "Document Collaboration",
    description: "Create and edit documents in real-time with your team.",
  },
  {
    icon: Hash,
    title: "Channels",
    description: "Communicate effectively in topic-based channels.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work seamlessly with your team, no matter where they are.",
  },
  {
    icon: Calendar,
    title: "Project Planning",
    description: "Plan and schedule your projects with intuitive tools.",
  },
  {
    icon: Zap,
    title: "Integrations",
    description: "Connect with your favorite tools and boost productivity.",
  },
];

const FeatureGrid = () => {
  return (
    <div className="wrapper bg-gray-50 py-16 sm:py-24 rounded-2xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to boost productivity
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Kakrola brings all your tasks, docs, and communications together in one place.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;