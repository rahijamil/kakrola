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
          <div className="space-y-8">
            <div className="gird lg:grid-cols-2 gap-16 items-center">
              {/* <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full">
                <span className="text-primary-700 text-sm font-medium">
                  14-Day Refund Guarantee
                </span>
                <ArrowRight className="w-4 h-4 ml-2 text-primary-700" />
              </div> */}

              <div className="flex items-center justify-center md:justify-start">
                <Link
                  href="https://www.producthunt.com/products/kakrola?utm_source=badge-follow&utm_medium=badge&utm_souce=badge-kakrola"
                  target="_blank"
                >
                  {/* <Image
                  src="https://api.producthunt.com/widgets/embed-image/v1/follow.svg?product_id=670035&theme=light"
                  alt="Kakrola - The&#0032;all&#0045;in&#0045;one&#0032;workspace&#0032;for&#0032;teams | Product Hunt"
                  width={250}
                  height={54}
                  className="min-w-[250px] min-h-[54px]"
                /> */}

                  <span
                    dangerouslySetInnerHTML={{
                      __html: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="250" height="54" viewBox="0 0 250 54" version="1.1">
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g transform="translate(-130.000000, -73.000000)">
      <g transform="translate(130.000000, 73.000000)">
        <rect stroke="#FF6154" stroke-width="1" fill="#FFFFFF" x="0.5" y="0.5" width="249" height="53" rx="10"/>
        <text font-family="Helvetica-Bold, Helvetica" font-size="9" font-weight="bold" fill="#FF6154">
          <tspan x="53" y="20">FOLLOW US ON</tspan>
        </text>
        <text font-family="Helvetica-Bold, Helvetica" font-size="16" font-weight="bold" fill="#FF6154">
          <tspan x="52" y="40">Product Hunt</tspan>
        </text>
        false
        <g transform="translate(11.000000, 12.000000)"><path d="M31,15.5 C31,24.0603917 24.0603917,31 15.5,31 C6.93960833,31 0,24.0603917 0,15.5 C0,6.93960833 6.93960833,0 15.5,0 C24.0603917,0 31,6.93960833 31,15.5" fill="#FF6154"/><path d="M17.4329412,15.9558824 L17.4329412,15.9560115 L13.0929412,15.9560115 L13.0929412,11.3060115 L17.4329412,11.3060115 L17.4329412,11.3058824 C18.7018806,11.3058824 19.7305882,12.3468365 19.7305882,13.6308824 C19.7305882,14.9149282 18.7018806,15.9558824 17.4329412,15.9558824 M17.4329412,8.20588235 L17.4329412,8.20601152 L10.0294118,8.20588235 L10.0294118,23.7058824 L13.0929412,23.7058824 L13.0929412,19.0560115 L17.4329412,19.0560115 L17.4329412,19.0558824 C20.3938424,19.0558824 22.7941176,16.6270324 22.7941176,13.6308824 C22.7941176,10.6347324 20.3938424,8.20588235 17.4329412,8.20588235" fill="#FFFFFF"/></g>
      </g>
    </g>
  </g>
</svg>`,
                    }}
                  ></span>
                </Link>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column */}
              <div className="space-y-8 text-center lg:text-left">
                <h1 className="space-y-2 lg:space-y-3">
                  <span className="block text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight">
                    One space for
                  </span>
                  <span className="block text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight">
                    <span className="relative inline-block">
                      your team
                      <div className="absolute -bottom-2 left-0 w-full border-b-8 lg:border-b-[12px] border-primary-200 border-dashed -z-10 transform origin-left transition-transform duration-500 ease-out" />
                    </span>
                  </span>
                  <span className="block text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight">
                    to thrive
                  </span>
                </h1>

                <p className="text-lg lg:text-xl text-gray-600 max-w-xl">
                  Tasks, docs, and chats in one place. No more switching between
                  apps.
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
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
          <div className="aspect-square h-96 rounded-full bg-gradient-to-br from-primary-400 to-purple-400" />
        </div>
      </div>
    </div>
  );
}
