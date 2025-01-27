"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, Clock, Star, Rocket } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CtaSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-primary-50 to-white">
      <div className="wrapper py-20 md:pb-32">
        <div className="relative z-10 mx-auto text-center">
          <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
            Scale Your Team's Success
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join growing teams who've simplified their workflow, reduced
            meetings, and gotten more done
          </p>

          <div className="mb-12 flex justify-center items-center flex-wrap gap-4">
            <Link href="/auth/signup" className="w-full sm:w-fit">
              <Button size="lg" className="shadow-lg w-full sm:w-fit">
                <Rocket className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-fit">
              <Button
                size="lg"
                className="text-lg px-8 w-full sm:w-fit"
                variant="outline"
              >
                Explore Pricing
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 max-w-2xl mx-auto">
            <TooltipProvider>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-2 rounded-full bg-primary-50">
                      <Star className="h-4 w-4 text-primary-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Try all features risk-free</p>
                  </TooltipContent>
                </Tooltip>
                <span>7-day free trial</span>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-2 rounded-full bg-primary-50">
                      <Clock className="h-4 w-4 text-primary-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>No long-term commitment required</p>
                  </TooltipContent>
                </Tooltip>
                <span>Cancel anytime</span>
              </div>
            </TooltipProvider>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200 rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-200 rounded-full opacity-10 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
