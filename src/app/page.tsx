"use client";
import React from "react";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import LandingPageHeader from "./LandingPageHeader";
import LandingPageFooter from "./LandingPageFooter";
import { Button } from "@/components/ui/button";
import SectionsLayout from "./landingpage_sections/SectionsLayout";
import HeroSection from "./landingpage_sections/HeroSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <LandingPageHeader />

      <main>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50 to-white z-0"></div>
          <HeroSection />
          <SectionsLayout />
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50 to-white z-0"></div>
          <section className="min-h-screen"></section>
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20 sm:py-32">
          <div className="wrapper">
            <div className="lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to boost your productivity?</span>
                <span className="block text-indigo-200">
                  Start using Kakrola today.
                </span>
              </h2>
              <div className="mt-8 flex flex-wrap sm:flex-nowrap gap-3 lg:mt-0 lg:flex-shrink-0 whitespace-nowrap">
                <div className="inline-flex rounded-lg shadow">
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
                <div className="inline-flex rounded-lg shadow">
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
