"use client";
import React from "react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageFooter from "../LandingPageFooter";
import { pricingTiers } from "@/lib/constants/pricing-tier";
import PricingCard from "./PricingCard";
import FAQAccordion from "@/components/FAQAccordion";
import BuiltInPublicSection from "../landingpage_sections/BuiltInPublicSection";

const faqItems = [
  {
    title: "How quickly can my team get started?",
    content:
      "Your team can be up and running in minutes. The platform is designed to be intuitive - import your existing projects, invite team members, and start collaborating immediately. Most teams are fully set up within an hour.",
  },
  {
    title: "What makes Kakrola different from other tools?",
    content:
      "Unlike other tools that force you to juggle multiple apps, Kakrola brings your projects, docs, and team communication into one cohesive workspace. The platform is intentionally designed to be simple yet powerful, focusing on the features teams actually need.",
  },
  // {
  //   title: "Can I migrate data from my current tools?",
  //   content:
  //     "Yes! Kakrola supports importing from popular platforms like Asana, Trello, and Notion. The built-in migration tool helps transfer your projects, tasks, and documents while preserving their structure and relationships.",
  // },
  // {
  //   title: "How do you handle data security?",
  //   content:
  //     "Your data security is a top priority. Kakrola uses industry-standard encryption, secure AWS infrastructure, and automated backups. All data is encrypted in transit and at rest, and you maintain full control over your workspace data.",
  // },
  {
    title: "Do you offer refunds?",
    content:
      "Yes! If you're not satisfied with Kakrola, I offer a 14-day money-back guarantee, no questions asked. You can try the platform risk-free and see if it's the right fit for your team.",
  },
  // {
  //   title: "Can Kakrola scale with my team?",
  //   content:
  //     "Absolutely. The platform is built to grow with you, supporting teams from 5 to 100+ members. As your team grows, you can easily adjust your plan and seats. The infrastructure automatically scales to maintain fast performance regardless of team size.",
  // },
];

const PricingPage = () => {
  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-white via-primary-25 to-white">
      <LandingPageHeader />
      <main className="pb-28">
        <div className="wrapper py-20 sm:pt-32 space-y-20">
          <div className="text-center space-y-6">
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Where great teams <br /> get work done
            </h1>
            {/* <p className="mt-4 text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto">
              Join growing teams who've simplified their workflow, reduced
              meetings, and gotten more done with Kakrola.
            </p> */}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-400" />
                Built in Public
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-400" />
                14-Day Guarantee
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-400" />
                Regular Updates
              </div>
            </div>
          </div>

          <div className="gridgap-8lg:grid-cols-2 max-w-4xl mx-auto">
            {pricingTiers.map((plan, index) => (
              <PricingCard plan={plan} key={index} />
            ))}
          </div>
        </div>

        <div className="pb-20">
          {/* Built in Public section */}
          <BuiltInPublicSection />
        </div>

        <section className="wrapper py-20 bg-white rounded-lg">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">
                Common Questions
              </h2>
              <p className="text-slate-600">
                Everything you need to know about getting started
              </p>
            </div>
            <div className="bg-slate-50/50 rounded-xl p-6 md:p-8 shadow-sm">
              <FAQAccordion items={faqItems} />
            </div>
          </div>
        </section>
      </main>
      <LandingPageFooter />

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
        <div className="aspect-square h-96 rounded-full bg-gradient-to-br from-primary-400 to-purple-400" />
      </div>
    </div>
  );
};

export default PricingPage;
