"use client";
import React from "react";
import {
  CheckCircleIcon,
  UsersIcon,
  CalendarIcon,
  LightbulbIcon,
  LayoutDashboardIcon,
  ClipboardListIcon,
} from "lucide-react";
import { Button } from "./LandingPageButton";
import Link from "next/link";
import LandingPageHeader from "./LandingPageHeader";
import LandingPageFooter from "./LandingPageFooter";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

const LandingPage = () => {
  const features = [
    {
      name: "Task Management",
      description: "Organize and prioritize your tasks with ease.",
      icon: CheckCircleIcon,
    },
    {
      name: "Team Collaboration",
      description: "Work together seamlessly with your team.",
      icon: UsersIcon,
    },
    {
      name: "Smart Scheduling",
      description: "Plan your day with intelligent scheduling features.",
      icon: CalendarIcon,
    },
    {
      name: "Idea Capture",
      description: "Never lose a brilliant idea with quick note-taking.",
      icon: LightbulbIcon,
    },
  ];

  const templates = [
    { name: "Project Planning", icon: LayoutDashboardIcon },
    { name: "Meeting Notes", icon: ClipboardListIcon },
    { name: "Goal Tracking", icon: CheckCircleIcon },
    { name: "Team Collaboration", icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <LandingPageHeader />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Unify Your Work with</span>
                <span className="block text-indigo-600">Ekta</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Experience seamless task management, note-taking, and team
                collaboration. Organize, plan, and achieve more together.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <Button size="lg" className="w-full sm:w-auto group">
                  Start for free
                  <div className="group-hover:translate-x-2 transition-transform duration-300">
                    <ChevronDoubleRightIcon className="w-6 h-6" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 opacity-20 transform skew-y-6 sm:skew-y-3 -z-10"></div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white" id="features">
          <div className="max-w-7xl mx-auto">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Features
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Everything you need to stay organized
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Ekta brings together the best of task management, note-taking,
                and team collaboration in one unified platform.
              </p>
            </div>

            <div className="mt-16">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {features.map((feature) => (
                  <div key={feature.name} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        {feature.name}
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Parallax Scrolling Demo */}
        <section
          className="relative h-96 bg-fixed bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-photo/abstract-colorful-splash-3d-background-generative-ai-background_60438-2493.jpg?t=st=1722706213~exp=1722709813~hmac=04b08f9092df7388e0a23b898105e6acf765a77e0f68dc7a06b103df52071281&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">
                Start using Ekta today.
              </h2>
              <Button size="lg" variant="secondary">
                Start for free
              </Button>
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section
          className="bg-gradient-to-b from-gray-50 to-white py-20"
          id="templates"
        >
          <div className="max-w-7xl mx-auto">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Templates
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Ready-to-use Templates
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Get started quickly with our pre-built templates for various use
                cases
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {templates.map((template) => (
                  <div key={template.name} className="pt-6">
                    <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="-mt-6">
                        <div>
                          <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md shadow-lg">
                            <template.icon
                              className="h-6 w-6 text-white"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                          {template.name}
                        </h3>
                        <p className="mt-5 text-base text-gray-500">
                          Get started quickly with our{" "}
                          {template.name.toLowerCase()} template.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* For Teams Section */}
        <section className="bg-white py-20" id="for-teams">
          <div className="max-w-7xl mx-auto">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                For Teams
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Empower Your Team with Ekta
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Boost collaboration and productivity across your entire
                organization
              </p>
            </div>

            <div className="mt-10">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 bg-gradient-to-r from-indigo-50 to-purple-100 rounded-lg shadow-lg overflow-hidden aspect-video">
                  <img
                    src="/team_collaboratioin.png"
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0 md:ml-8">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Seamless Collaboration
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {[
                      "Real-time updates and notifications",
                      "Shared workspaces and project boards",
                      "Team chat and file sharing",
                      "Customizable permissions and roles",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="flex-shrink-0 h-6 w-6 text-green-500" />
                        <p className="ml-3 text-lg text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-gray-50 py-20" id="pricing">
          <div className="max-w-7xl mx-auto">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Pricing
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Choose the Perfect Plan for Your Team
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Flexible options to suit teams of all sizes
              </p>
            </div>

            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
              {[
                {
                  name: "Starter",
                  price: "$9",
                  features: [
                    "Up to 5 team members",
                    "Basic task management",
                    "5GB storage",
                    "Email support",
                  ],
                },
                {
                  name: "Pro",
                  price: "$29",
                  features: [
                    "Up to 50 team members",
                    "Advanced task management",
                    "50GB storage",
                    "Priority support",
                  ],
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  features: [
                    "Unlimited team members",
                    "Custom integrations",
                    "Unlimited storage",
                    "24/7 dedicated support",
                  ],
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="px-6 py-8">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="mt-4 text-5xl font-extrabold text-gray-900">
                      {plan.price}
                    </p>
                    <p className="mt-1 text-xl text-gray-500">
                      {plan.name !== "Enterprise" ? "per month" : "pricing"}
                    </p>
                    <ul className="mt-6 space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircleIcon className="flex-shrink-0 h-6 w-6 text-green-500" />
                          <p className="ml-3 text-base text-gray-700">
                            {feature}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-6 py-8 bg-gray-50">
                    <Button
                      variant={plan.name === "Pro" ? "default" : "outline"}
                      className="w-full"
                    >
                      {plan.name === "Enterprise"
                        ? "Contact Sales"
                        : "Get started"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto">
            <div className="lg:text-center mb-12">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Testimonials
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                What Our Customers Say
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Thompson",
                  role: "Project Manager",
                  company: "TechCorp",
                  quote:
                    "Ekta has revolutionized how we manage projects. It's intuitive, powerful, and has greatly improved our team's productivity.",
                },
                {
                  name: "Michael Chen",
                  role: "CEO",
                  company: "StartupX",
                  quote:
                    "As a fast-growing startup, we needed a tool that could scale with us. Ekta has been the perfect solution for our team collaboration needs.",
                },
                {
                  name: "Emily Rodriguez",
                  role: "Marketing Director",
                  company: "CreativeWorks",
                  quote:
                    "The templates in Ekta have saved us countless hours. It's like having a productivity expert guiding us through our workflows.",
                },
              ].map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="bg-gray-50 rounded-lg p-6 shadow-md"
                >
                  <p className="text-gray-600 italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://www.w3schools.com/howto/img_avatar.png"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-indigo-50 to-indigo-200 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              <span className="block">Ready to boost your productivity?</span>
              <span className="block">Start using Ekta today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-600">
              Join thousands of teams who have already transformed their
              workflow with Ekta.
            </p>
            <Button size="lg" variant="secondary" className="mt-8">
              Start your free trial
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <LandingPageFooter />
    </div>
  );
};

export default LandingPage;
