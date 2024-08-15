import Image from "next/image";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronsRight } from "lucide-react";
import CompaniesSection from "./CompaniesSection";
import { Button } from "@/components/ui/button";

// Hero Section
const HeroSection = () => {
  return (
    <section className="pt-16 sm:pt-24 relative z-10">
      <div className="wrapper mt-12 sm:mt-16 space-y-8 lg:space-y-0">
        <div className="text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Your Tasks, Organized.
            <br />
            Your Day, Simplified.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-6 md:max-w-2xl lg:text-xl"
          >
            Streamline task management, capture ideas effortlessly, and
            collaborate seamlessly with your team. Achieve more with less
            effort.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 max-w-md mx-auto flex justify-center"
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

        {/* Companies Section */}
        <CompaniesSection />
      </div>

      <div className="flex flex-col items-center justify-center relative mt-8 px-4">
        <div className="relative aspect-video border w-full max-w-5xl z-10 rounded-md overflow-hidden shadow-xl">
          <Image
            src="/images/feature1.png"
            objectFit="cover"
            fill
            alt="feature1"
          />
        </div>

        <div className="absolute top-1/2 bg-[#E6E6FA] h-[20vh] sm:h-[25vh] md:h-[32vh] w-full z-0"></div>
      </div>
    </section>
  );
};

export default HeroSection;
