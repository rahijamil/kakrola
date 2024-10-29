"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  ArrowRight,
  CheckCircle2,
  FileText,
  Hash,
  Building2,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-primary-50 to-white">
      <div className="wrapper py-20 md:pb-32">
        <div className="relative z-10">
          {/* Top Stats Bar */}
          <div className="flex justify-center flex-wrap gap-8 mb-16 whitespace-nowrap">
            {/* <div className="flex items-center gap-2">
              <Users className="w-5 h-5 min-h-5 min-w-5 text-primary-600" />
              <span className="text-sm">1,234+ Active Teams</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 min-h-5 min-w-5 text-primary-600" />
              <span className="text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 min-h-5 min-w-5 text-primary-600" />
              <span className="text-sm">2h Support Response</span>
            </div> */}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full">
                <span className="text-primary-700 text-sm font-medium">
                  30-Day Money-Back Guarantee
                </span>
                <ArrowRight className="w-4 h-4 ml-2 text-primary-700" />
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                The Complete
                <br />
                <span className="relative inline-block">
                  Workspace
                  <div
                    className="absolute -bottom-2 left-0 w-full h-3 bg-primary-200 -z-10"
                    // initial={{ scaleX: 0 }}
                    // animate={{ scaleX: 1 }}
                    // transition={{ duration: 0.8 }}
                  />
                </span>
                <br />
                for Teams
              </h1>

              <p className="text-xl text-gray-600">
                Join growing teams who've simplified their workflow, reduced
                meetings, and gotten more done with our all-in-one solution.
              </p>

              <div className="flex items-center flex-wrap gap-6">
                <Link href="/auth/signup" className="w-full sm:w-fit">
                  <Button size="lg" className="shadow-lg w-full sm:w-fit">
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Free Trial
                  </Button>
                </Link>
                {/* <span className="text-sm text-gray-500">
                  From $10/month per user
                </span> */}
              </div>
            </div>

            {/* Right Column - Feature Showcase */}
            <div className="bg-primary-100 p-4 md:p-8 rounded-lg">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-primary-500">
                <Image
                  src="/images/hero_image.png"
                  fill
                  alt="Kakrola Hero"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
          <div className="aspect-square h-96 rounded-full bg-gradient-to-br from-primary-400 to-purple-400" />
        </div>
      </div>
    </div>
  );
}
