import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, Sparkles } from "lucide-react";
import HeroCarousel from "./HeroCarousel";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-white via-primary-25 to-white overflow-hidden">
      <div className="wrapper pt-20 pb-10 sm:py-32 space-y-16 sm:space-y-24">
        <div className="flex md:items-center justify-center flex-col text-center">
          <h1 className="font-bold text-gray-900 text-5xl sm:text-6xl md:text-7xl leading-tight">
            Your team's <br className="hidden sm:block" />
            <span className="text-primary relative">
              command
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-primary-300"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,10 Q50,20 100,10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            </span>{" "}
            center
          </h1>
          <p className="mt-6 text-xl text-gray-600 sm:text-2xl md:max-w-2xl">
            Stop switching between tools. Kakrola brings tasks, docs, and team
            chat into one lightning-fast workspace.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
              >
                <Rocket className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Start for Free
              </Button>
            </Link>
            {/* <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Sparkles className="w-5 h-5 mr-2" strokeWidth={1.5} />
                See it in action
              </Button>
            </Link> */}
          </div>
        </div>

        <HeroCarousel />
      </div>

      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-300 to-secondary-300 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
