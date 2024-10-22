"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, Clock, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CtaSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-primary-50 to-white">
      <div className="wrapper px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 mx-auto text-center"
        >
          <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
            Scale Your Team's Success
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join growing teams who've simplified their workflow, reduced
            meetings, and gotten more done
          </p>

          <div className="mb-12 flex justify-center">
            <Link href="/pricing">
              <Button size="lg" className="text-lg px-8">
                View Pricing Plans
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 max-w-2xl mx-auto">
            <TooltipProvider>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
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
                <span>14-day free trial</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
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
              </motion.div>

              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-2 rounded-full bg-primary-50">
                      <Shield className="h-4 w-4 text-primary-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enterprise-grade security for all plans</p>
                  </TooltipContent>
                </Tooltip>
                <span>Enterprise security</span>
              </motion.div>
            </TooltipProvider>
          </div>
        </motion.div>

        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute top-20 left-20 w-72 h-72 bg-primary-200 rounded-full opacity-10 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-200 rounded-full opacity-10 blur-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default CtaSection;