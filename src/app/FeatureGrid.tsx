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
  CreditCard,
  DownloadCloud,
  Clock,
  Rocket,
} from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Projects",
    description: "Efficiently organize and track tasks across teams.",
    color: "text-kakrola-400",
  },
  {
    icon: FileText,
    title: "Pages",
    description: "Real-time collaboration on docs with version control.",
    color: "text-moonstone-400",
  },
  {
    icon: Hash,
    title: "Channels",
    description: "Organize conversations into channels for focus and clarity.",
    color: "text-kale-400",
  },
  {
    icon: MessagesSquare,
    title: "DMs",
    description: "Direct messaging for quick team communication.",
    color: "text-tangerine-400",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamlessly collaborate with team members in one place.",
    color: "text-lavender-400",
  },
  {
    icon: Zap,
    title: "Integrations",
    description: "Extend functionality with your favorite integrations.",
    color: "text-raspberry-400",
  },
];

const faqs = [
  {
    title: "How does the free plan work?",
    content:
      "Our free plan includes all core features for up to 10 team members. You get 5GB storage, basic project management tools, and essential communication features. No credit card required to start.",
  },
  {
    title: "Can I upgrade or downgrade at any time?",
    content:
      "Yes! You can upgrade, downgrade, or cancel your subscription at any time. We'll prorate any payments automatically.",
  },
  {
    title: "What kind of support do you offer?",
    content:
      "All plans include community support. Pro plans get priority email support, while Enterprise plans receive 24/7 phone and email support with a dedicated success manager.",
  },
  {
    title: "Do you offer a discount for non-profits?",
    content:
      "Yes! We offer special pricing for non-profit organizations. Please contact our sales team for more information.",
  },
];

export const FeatureGrid = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="relative z-10 wrapper">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            One platform, endless possibilities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything your team needs to stay productive, aligned, and moving
            forward together.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <feature.icon
                    className={`h-10 w-10 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex flex-col space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-kakrola-50 to-lavender-50 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export const CtaSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-kakrola-25 to-white">
      <div className="wrapper py-20 pt-10 sm:py-32">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
            Start with free. <br /> Scale when ready.
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            No credit card required. Set up in 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-kakrola-500 hover:bg-kakrola-600 text-white shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
              >
                <Rocket className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Start for Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-kakrola-200 hover:bg-kakrola-50"
              >
                View Pricing
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-kale-500" />
              <span>Free Plan Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-moonstone-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <DownloadCloud className="h-4 w-4 text-tangerine-500" />
              <span>Data export included</span>
            </div>
          </div>
        </div>
        {/* Multiple decorative elements */}
        <div className="absolute inset-0 -z-10">
          {/* Main center gradient */}
          <div
            className="absolute right-1/2 bottom-0 transform translate-x-1/2 w-[800px] h-[800px]"
            style={{
              background: `radial-gradient(circle, rgba(133,191,215,0.2) 0%, rgba(159,147,255,0.1) 100%)`,
              filter: "blur(60px)",
            }}
          />
          {/* Additional decorative elements */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-kakrola-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-lavender-200 rounded-full opacity-20 blur-3xl" />
        </div>
      </div>
    </section>
  );
};