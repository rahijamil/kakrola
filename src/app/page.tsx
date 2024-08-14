"use client";
import React from "react";
import {
  CheckCircleIcon,
  UsersIcon,
  CalendarIcon,
  LightbulbIcon,
  LayoutDashboardIcon,
  ClipboardListIcon,
  StarIcon,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import LandingPageHeader from "./LandingPageHeader";
import LandingPageFooter from "./LandingPageFooter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

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

  const pricing = [
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
  ];

  const testimonials = [
    {
      name: "Sarah Thompson",
      role: "Project Manager",
      company: "TechCorp",
      quote:
        "Kriya has revolutionized how we manage projects. It's intuitive, powerful, and has greatly improved our team's productivity.",
    },
    {
      name: "Michael Chen",
      role: "CEO",
      company: "StartupX",
      quote:
        "As a fast-growing startup, we needed a tool that could scale with us. Kriya has been the perfect solution for our team collaboration needs.",
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      company: "CreativeWorks",
      quote:
        "The templates in Kriya have saved us countless hours. It's like having a productivity expert guiding us through our workflows.",
    },
  ];

  http://localhost:3000/#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6Im15Zi9kQ0VuN2pjSHZhaXkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2NyamFqa2J4cGZubm11ZWFka2ViLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3ZTIyNjRlZi1hMDg0LTQyNWYtODJhNy0wZTAxOWQ3ZjM5MWMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzIzMzcyNzkzLCJpYXQiOjE3MjMzNjkxOTMsImVtYWlsIjoibW9oYW1tYWRyYWhpMDAzQGdhbWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJtb2hhbW1hZHJhaGkwMDNAZ2FtaWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjdlMjI2NGVmLWEwODQtNDI1Zi04MmE3LTBlMDE5ZDdmMzkxYyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im90cCIsInRpbWVzdGFtcCI6MTcyMzM2OTE5M31dLCJzZXNzaW9uX2lkIjoiMmEzMDE5NmYtOGRjOC00ODJmLWIzYmEtNGZhYmYzNTM1YzRlIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.t7rzE3S1O0vtAMjKn0aXCXb__f83TF_JHLL2knIgbCQ&expires_at=1723372793&expires_in=3600&refresh_token=mCdoqYfayKeJdwd63Cui4Q&token_type=bearer&type=recovery

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
      <LandingPageHeader />

      <main>
        {/* Hero Section */}
        <section className="py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <div className="text-center relative z-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl"
              >
                <span className="block">Unify Your Work with</span>
                <span className="block text-indigo-600 mt-2">Kriya</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-6 max-w-md mx-auto text-xl text-gray-500 sm:text-2xl md:mt-8 md:max-w-3xl"
              >
                Experience seamless task management, note-taking, and team
                collaboration. Organize, plan, and achieve more together.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-12"
              >
                <Link
                  href="/auth/signup"
                  className="group transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <Button size="lg">
                    Start for free
                    <ChevronsRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-32 bg-white" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Features
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                Everything you need to stay organized
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Kriya brings together the best of task management, note-taking,
                and team collaboration in one unified platform.
              </p>
            </div>

            <div className="mt-16">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    className="relative p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true"  strokeWidth={1.5} />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        {feature.name}
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      {feature.description}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="relative py-20 sm:py-32 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Interactive Demo
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                Experience Kriya in Action
              </p>
            </div>
            <div className="relative">
              <motion.div
                className="bg-white rounded-lg shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Add your interactive demo component here */}
                <div className="aspect-w-16 aspect-h-9 relative">
                  <Image
                    src=""
                    alt="Kriya Demo"
                    className="object-cover"
                    fill
                  />
                </div>
              </motion.div>

              {/* Decorative elements */}
              <svg
                className="absolute top-full right-0 transform translate-x-1/3 -translate-y-1/4 lg:translate-x-1/2 xl:-translate-y-1/2"
                width="404"
                height="404"
                fill="none"
                viewBox="0 0 404 404"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="85737c0e-0916-41d7-917f-596dc7edfa27"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      className="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width="404"
                  height="404"
                  fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* For Teams Section */}
        <section className="bg-white py-20 sm:py-32" id="for-teams">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                For Teams
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Empower Your Team with Kriya
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Boost collaboration and productivity across your entire
                organization
              </p>
            </div>

            <div className="mt-16">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <motion.div
                  className="lg:w-1/2 bg-gradient-to-r from-indigo-50 to-purple-100 rounded-lg shadow-lg overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 400 300"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Add an SVG illustration representing team collaboration */}
                    {/* This is a placeholder, replace with a more detailed SVG */}
                    <rect width="400" height="300" fill="#f3f4f6" />
                    <circle cx="200" cy="150" r="100" fill="#818cf8" />
                    <rect
                      x="150"
                      y="100"
                      width="100"
                      height="100"
                      fill="#4f46e5"
                    />
                    <polygon points="200,50 250,150 150,150" fill="#7c3aed" />
                  </svg>
                </motion.div>
                <motion.div
                  className="lg:w-1/2 mt-8 lg:mt-0 lg:ml-12"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Seamless Collaboration
                  </h3>
                  <ul className="space-y-4">
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
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-gray-50 py-20 sm:py-32" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Pricing
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Choose the Perfect Plan for Your Team
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Flexible options to suit teams of all sizes
              </p>
            </div>

            <div className="mt-16 space-y-4 sm:mt-20 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
              {pricing.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
                          <CheckCircleIcon className="flex-shrink-0 h-6 w-6 text-green-500" strokeWidth={1.5} />
                          <p className="ml-3 text-base text-gray-700">
                            {feature}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-white py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Testimonials
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                What Our Customers Say
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  className="bg-gray-50 rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6">
                  &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        className="rounded-full object-cover"
                        // src={`https://i.pravatar.cc/150?img=${index + 1}`}
                        src=""
                        width={48}
                        height={48}
                        alt={testimonial.name}
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to boost your productivity?</span>
                <span className="block text-indigo-200">
                  Start using Kriya today.
                </span>
              </h2>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <Link href="/auth/signup">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="text-lg px-8 py-4"
                    >
                      Start your free trial
                      <ChevronsRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 bg-white text-indigo-600 hover:bg-indigo-50"
                  >
                    Learn more
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingPageFooter />
    </div>
  );
};

export default LandingPage;
