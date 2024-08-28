import React from "react";
import { motion } from "framer-motion";
import CompaniesSection from "./CompaniesSection";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CircleCheckBig,
  FileText,
  Hash,
  MessageSquareText,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-24 relative z-10 bg-white">
      <div className="wrapper mt-16 sm:mt-24 space-y-8 lg:space-y-0">
        <div className="text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-bold text-gray-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl flex items-center justify-center gap-4 sm:gap-8"
          >
            Simplify Your Workflow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-6 md:max-w-2xl lg:text-2xl"
          >
            Manage tasks, communicate with your team, and get things done—all in
            one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-md mx-auto"
          >
            <Link href="/auth/signup" className="group">
              <Button
                className="uppercase"
                rightContent={
                  <div className="bg-background text-primary-500 rounded-full w-8 h-8 flex items-center justify-center">
                    <Hash className="w-5 h-5" />
                  </div>
                }
              >
                Get Started with Kakrola
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center relative mt-24 sm:mt-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative aspect-video border w-full max-w-5xl z-10 rounded-lg overflow-hidden shadow-md"
        >
          <Image
            src="/images/feature1.png"
            objectFit="cover"
            fill
            alt="feature1"
          />
        </motion.div>

        <div className="absolute top-1/2 bg-primary-25 h-[20vh] sm:h-[25vh] md:h-[32vh] lg:h-[35vh] w-full z-0"></div>
      </div>
    </section>
  );
};

export default HeroSection;
