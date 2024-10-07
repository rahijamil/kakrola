"use client";
import React, { useState } from "react";
import { Check, CheckCircle, Rocket, X } from "lucide-react";
import Link from "next/link";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageFooter from "../LandingPageFooter";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

const comparisonFeatures = [
  {
    category: "Core Features",
    features: [
      {
        name: "Projects",
        free: "Up to 5",
        pro: "Unlimited",
        business: "Unlimited",
      },
      {
        name: "Team members",
        free: "Up to 3",
        pro: "Unlimited",
        business: "Unlimited",
      },
      {
        name: "File storage",
        free: "100MB",
        pro: "5GB per user",
        business: "Unlimited",
      },
      {
        name: "Task management",
        free: "Basic",
        pro: "Advanced",
        business: "Advanced",
      },
      { name: "Views (List, Board)", free: true, pro: true, business: true },
      { name: "Mobile app access", free: true, pro: true, business: true },
    ],
  },
  {
    category: "Advanced Features",
    features: [
      { name: "Custom fields", free: false, pro: true, business: true },
      { name: "Gantt charts", free: false, pro: true, business: true },
      { name: "Timeline view", free: false, pro: true, business: true },
      { name: "Calendar view", free: false, pro: true, business: true },
      { name: "Time tracking", free: false, pro: true, business: true },
      {
        name: "Workflow automation",
        free: false,
        pro: "Basic",
        business: "Advanced",
      },
      {
        name: "Reporting and dashboards",
        free: false,
        pro: "Basic",
        business: "Advanced",
      },
    ],
  },
  {
    category: "Collaboration",
    features: [
      {
        name: "Task comments",
        free: "Basic",
        pro: "Advanced",
        business: "Advanced",
      },
      { name: "File sharing", free: true, pro: true, business: true },
      { name: "Team channels", free: false, pro: true, business: true },
      { name: "Guest access", free: false, pro: true, business: true },
      {
        name: "Proofing and approvals",
        free: false,
        pro: false,
        business: true,
      },
    ],
  },
  {
    category: "Customization & Integration",
    features: [
      { name: "Templates", free: "Basic", pro: "Custom", business: "Advanced" },
      {
        name: "Integrations",
        free: "Basic",
        pro: "Advanced",
        business: "Enterprise-grade",
      },
      { name: "API access", free: false, pro: false, business: true },
      { name: "Custom branding", free: false, pro: false, business: true },
    ],
  },
  {
    category: "Security & Administration",
    features: [
      {
        name: "Two-factor authentication",
        free: true,
        pro: true,
        business: true,
      },
      { name: "SSO (SAML)", free: false, pro: false, business: true },
      { name: "Advanced permissions", free: false, pro: true, business: true },
      {
        name: "User provisioning (SCIM)",
        free: false,
        pro: false,
        business: true,
      },
      {
        name: "Data encryption at rest",
        free: false,
        pro: false,
        business: true,
      },
    ],
  },
  {
    category: "Support",
    features: [
      {
        name: "Customer support",
        free: "Email",
        pro: "Priority email",
        business: "24/7 priority",
      },
      {
        name: "Dedicated success manager",
        free: false,
        pro: false,
        business: true,
      },
    ],
  },
];

const renderFeatureValue = (value: boolean | string) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 mx-auto" />
    ) : (
      <>{/* <X className="h-5 w-5 mx-auto" /> */}</>
    );
  }
  return value;
};

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "For individuals getting started",
      features: [
        "Up to 5 active projects",
        "Basic task management",
        "100MB file storage",
        "3 team members",
        "Basic integrations",
        "2-factor authentication",
      ],
      cta: "Sign Up",
      highlighted: false,
    },
    {
      name: "Pro",
      price: isAnnual ? "$8" : "$12",
      period: isAnnual ? "per user/month" : "per user/month",
      description: "For power users and small teams",
      features: [
        "Unlimited active projects",
        "Advanced task management",
        "5GB file storage per user",
        "Unlimited team members",
        "Advanced integrations",
        "Priority support",
        "Custom fields",
        "Gantt charts",
        "Time tracking",
      ],
      cta: "Start Free Trial",
      highlighted: true,
      badge: "Popular",
    },
    {
      name: "Business",
      price: isAnnual ? "$13" : "$18",
      period: isAnnual ? "per user/month" : "per user/ month",
      description: "For organizations that need more control and support",
      features: [
        "Everything in Pro",
        "Unlimited file storage",
        "Advanced security features",
        "Admin & owner roles",
        "Team billing",
        "Custom workflows",
        "Workload management",
        "24/7 customer support",
        "SSO (SAML)",
      ],
      cta: "Start Free Trial",
      businessHighlight: true,
    },
  ];

  return (
    <div className="min-h-screen">
      <LandingPageHeader />

      <main>
        <div className="wrapper py-20 sm:pt-32 space-y-20">
          <div className="text-center">
            <h1 className="font-bold text-gray-900 text-4xl sm:text-5xl hidden md:block">
              One tool for your entire workflow
            </h1>

            <h1 className="font-bold text-gray-900 text-4xl sm:text-5xl md:text-6xl block md:hidden">
              One tool for your <br /> entire workflow
            </h1>
            {/* <p className="mt-4 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-6 md:max-w-2xl lg:text-2xl hidden md:block">
              Boost productivity with tasks, pages, channels, and more. Try
              Kakrola free today.
            </p> */}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <span
                className={`mr-3 ${
                  isAnnual ? "text-text-600" : "text-text-900 font-semibold"
                }`}
              >
                Pay Monthly
              </span>
              <ToggleSwitch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span
                className={`ml-3 ${
                  isAnnual ? "text-text-900 font-semibold" : "text-text-600"
                }`}
              >
                Pay Annually{" "}
                <span className="text-primary-500 font-bold">(Save 30%)</span>
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`rounded-lg overflow-hidden border border-t-5 bg-white ${
                    plan.businessHighlight
                      ? "border-text-500"
                      : plan.highlighted
                      ? "border-primary-500"
                      : "border-text-100"
                  }`}
                >
                  <div className="p-6 space-y-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-semibold text-text-900">
                          {plan.name}
                        </h2>

                        {plan.badge && (
                          <span className="bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-text-600">
                        {plan.description}
                      </p>
                    </div>

                    <div>
                      <p className="mt-4">
                        <span className="text-4xl font-extrabold text-text-900">
                          {plan.price}
                        </span>
                        <span className="text-base font-medium text-text-500">
                          {" "}
                          {plan.period}
                        </span>
                      </p>
                    </div>

                    <div>
                      <Link href="/auth/signup">
                        <Button
                          variant={plan.highlighted ? "default" : "outline"}
                          color={plan.businessHighlight ? "text" : "primary"}
                          fullWidth
                        >
                          {(plan.highlighted || plan.businessHighlight) && (
                            <Rocket className="w-5 h-5" strokeWidth={1.5} />
                          )}
                          {plan.cta}
                        </Button>
                      </Link>
                    </div>

                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            <CheckCircle
                              className="h-5 w-5 text-text-500"
                              strokeWidth={1.5}
                            />
                          </div>
                          <p className="ml-3 text-base text-text-700">
                            {feature}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <section className="wrapper pt-20 pb-40 md:pb-20 hidden md:block">
          <h2 className="text-3xl font-bold text-center mb-12">
            Plans and features
          </h2>
          <div className="bg-background overflow-x-auto">
            {comparisonFeatures.map(
              (category, categoryIndex, categoryArray) => (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-6 relative">
                    <div className="absolute h-px w-full bottom-0 bg-black/5"></div>

                    <div
                      className={`px-6 py-4 text-base font-bold text-text-900 w-1/4 ${
                        categoryIndex !== 0 && "h-20 flex items-end"
                      }`}
                    >
                      {category.category}
                    </div>

                    {pricingPlans.map((plan, index) =>
                      categoryIndex == 0 ? (
                        <div
                          key={index}
                          className={`px-6 py-3 text-center text-sm font-semibold text-text-700 uppercase tracking-wider w-1/4 rounded-t-lg border border-b-0 border-t-5 h-20 md:h-14 ${
                            plan.businessHighlight
                              ? "border-text-500 bg-text-10"
                              : plan.highlighted
                              ? "border-primary-500 bg-primary-10"
                              : "border-text-100 bg-white"
                          }`}
                        >
                          {plan.name}
                        </div>
                      ) : (
                        <div
                          key={index}
                          className={`px-6 py-3 text-center text-sm font-semibold text-text-700 uppercase tracking-wider w-1/4 border-x h-20 ${
                            plan.businessHighlight
                              ? "border-text-500 bg-text-10"
                              : plan.highlighted
                              ? "border-primary-500 bg-primary-10"
                              : "border-text-100 bg-white"
                          }`}
                        ></div>
                      )
                    )}
                  </div>

                  {category.features.map((feature, featureIndex, self) =>
                    categoryIndex == categoryArray.length - 1 &&
                    featureIndex == self.length - 1 ? (
                      <div key={featureIndex}>
                        <div
                          key={featureIndex}
                          className={`flex w-full gap-6 relative group ${
                            self.length - 1 === featureIndex ? "" : ""
                          }`}
                        >
                          <div className="px-6 py-4 text-sm font-medium text-text-900 w-1/4">
                            {feature.name}
                          </div>
                          <div className="px-6 py-4 text-sm text-text-500 text-center w-1/4 border-x border-text-100 bg-white">
                            {renderFeatureValue(feature.free)}
                          </div>
                          <div className="px-6 py-4 text-sm text-text-500 text-center w-1/4 border-x border-primary-500 bg-primary-10">
                            {renderFeatureValue(feature.pro)}
                          </div>
                          <div className="px-6 py-4 text-sm text-text-500 text-center w-1/4 border-x border-text-500 bg-text-10">
                            {renderFeatureValue(feature.business)}
                          </div>

                          <div className="absolute group-hover:bg-black/5 rounded-lg transition w-full h-full"></div>
                        </div>

                        <div
                          className={`flex w-full gap-6 relative ${
                            self.length - 1 === featureIndex ? "" : ""
                          }`}
                        >
                          <div className="absolute h-px w-full top-0 bg-black/5"></div>

                          <div className="px-6 py-4 text-sm font-medium text-text-900 w-1/4">
                            {/* {feature.name} */}
                          </div>
                          <div className="px-6 py-4 text-sm text-text-500 text-center w-1/4 border border-t-0 border-text-100 bg-white rounded-b-lg">
                            <div
                              className={`text-center font-semibold text-text-700 uppercase tracking-widerbg-white pb-4`}
                            >
                              Free
                            </div>

                            <Link href="/auth/signup">
                              <Button variant="outline" fullWidth>
                                Sign Up
                              </Button>
                            </Link>
                          </div>
                          <div className="px-6 py-4 text-sm text-text-500 text-center w-1/4 border border-t-0 border-primary-500 bg-primary-10 rounded-b-lg">
                            <div
                              className={`text-center font-semibold text-text-700 uppercase tracking-widerbg-white pb-4`}
                            >
                              Pro
                            </div>

                            <Link href="/auth/signup">
                              <Button fullWidth>
                                <Rocket className="w-5 h-5" strokeWidth={1.5} />
                                Start Free Trial
                              </Button>
                            </Link>
                          </div>
                          <div className="px-6 py-4 text-sm text-text-500 text-center w-1/4 border border-t-0 border-text-500 bg-text-10 rounded-b-lg">
                            <div
                              className={`text-center font-semibold text-text-700 uppercase tracking-widerbg-white pb-4`}
                            >
                              Business
                            </div>

                            <Link href="/auth/signup">
                              <Button fullWidth variant="outline" color="text">
                                <Rocket className="w-5 h-5" strokeWidth={1.5} />
                                Start Free Trial
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={featureIndex}
                        className={`flex w-full gap-6 relative group ${
                          self.length - 1 === featureIndex ? "" : ""
                        }`}
                      >
                        <div className="px-6 py-4 text-sm font-medium text-text-900 w-1/4">
                          {feature.name}
                        </div>
                        <div className="px-6 py-4 text-sm text-text-500 text-center w-1/4 border-x border-text-100 bg-white">
                          {renderFeatureValue(feature.free)}
                        </div>
                        <div className="px-6 py-4 text-sm text-text-500 text-center w-1/4 border-x border-primary-500 bg-primary-10">
                          {renderFeatureValue(feature.pro)}
                        </div>
                        <div className="px-6 py-4 text-sm text-text-500 text-center w-1/4 border-x border-text-500 bg-text-10">
                          {renderFeatureValue(feature.business)}
                        </div>

                        <div className="absolute group-hover:bg-black/5 rounded-lg transition w-full h-full"></div>
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        </section>
      </main>

      <LandingPageFooter />
    </div>
  );
};

export default PricingPage;
