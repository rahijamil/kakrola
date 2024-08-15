"use client";
import React from "react";
import {
  CheckCircleIcon,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import LandingPageHeader from "./LandingPageHeader";
import LandingPageFooter from "./LandingPageFooter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import TabsSection from "./landingpage_sections/TabSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
      <LandingPageHeader />

      <main>
        {/* Hero Section */}
        <section className="py-20 sm:py-32 bg-white">
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

        {/* Tab section */}
        <TabsSection />

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
