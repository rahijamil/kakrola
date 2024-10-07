import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import HeroCarousel from "./HeroCarousel";

const HeroSection = () => {
  return (
    <section className="relative bg-white">
      <div className="wrapper py-20 sm:pt-32 space-y-10 sm:space-y-20">
        <div className="flex md:items-center justify-center flex-col">
          <h1 className="font-bold text-gray-900 text-7xl leading-[80px] hidden md:block">
            Make things happen.
          </h1>
          <h1 className="font-bold text-gray-900 text-7xl leading-[80px] block md:hidden">
            Make <br /> things <br /> happen.
          </h1>
          <p className="mt-4 text-lg text-gray-600 sm:text-xl md:mt-6 md:max-w-2xl lg:text-2xl font-semibold md:font-normal">
            Seamlessly integrate tasks, chats, and docs. Experience
            Kakrola&apos;s power - start free today!
          </p>

          <div className="mt-8">
            <Link href="/auth/signup">
              <Button className="shadow-lg hover:shadow-xl transition-all hero_button w-full md:w-auto">
                <Rocket className="w-5 h-5" strokeWidth={1.5} />
                Get Kakrola Free
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
