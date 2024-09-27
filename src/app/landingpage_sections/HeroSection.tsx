import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import HeroCarousel from "./HeroCarousel";

const HeroSection = () => {
  return (
    <section className="relative bg-white">
      <div className="wrapper py-20 sm:pt-32 space-y-10 sm:space-y-20">
        <div className="text-center relative">
          <h1 className="font-bold text-gray-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            One tool for your <br /> entire workflow
          </h1>
          <p className="mt-4 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-6 md:max-w-2xl lg:text-2xl">
            Seamlessly integrate tasks, chats, and docs. Experience
            Kakrola&apos;s power - start free today!
          </p>

          <div className="mt-8 max-w-md mx-auto">
            <Link href="/auth/signup" className="group">
              <Button
                className="uppercase shadow-lg hover:shadow-xl transition-all hero_button"
                rightContent={
                  <div className="bg-background text-primary-500 rounded-lg w-8 h-8 flex items-center justify-center">
                    <Rocket className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                }
              >
                Get Started - It's Free
              </Button>
            </Link>
          </div>
        </div>

        <HeroCarousel />
      </div>
    </section>
  );
};

export default HeroSection;
