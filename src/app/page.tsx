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
          <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50 to-white z-0"></div>
          <HeroSection />
          <SectionsLayout />
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50 to-white z-0"></div>
          <section className="min-h-screen"></section>

          {/* CTA Section */}
          <section className="relative pb-20">
            <div className="wrapper bg-gradient-to-r from-primary-600 to-primary2 py-20 sm:py-32 rounded-xl">
              <div className="lg:flex lg:items-center lg:justify-between w-11/12 mx-auto max-w-5xl">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <span className="block">
                    Ready to boost your productivity?
                  </span>
                  <span className="block text-primary-200">
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
                        Start for free
                        <ChevronsRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
};

export default LandingPage;
