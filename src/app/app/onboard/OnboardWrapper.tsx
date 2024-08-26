import KakrolaLogo from "@/app/kakrolaLogo";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import useScreen, { Breakpoint } from "@/hooks/useScreen"; // Import the custom hook

const OnboardWrapper = ({
  imageSrc,
  useWithTeam,
  leftSide,
  currentStep,
}: {
  useWithTeam: boolean;
  imageSrc: StaticImageData;
  leftSide: ReactNode;
  currentStep: number;
}) => {
  const { breakpoint, screenWidth } = useScreen();

  const isShowRightSide = (["lg", "xl"] as Breakpoint["breakpoint"][]).includes(
    breakpoint
  );

  return (
    <div className="min-h-screen bg-background bg-gradient-to-br from-background via-primary-50 to-background overflow-hidden">
      <div
        className={`grid h-screen ${
          isShowRightSide ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* Left Side */}
        <div className="bg-surface">
          {isShowRightSide && (
            <div className="flex items-center h-20 pl-32">
              <KakrolaLogo size="md" isTitle />
            </div>
          )}

          <div className={`w-11/12 max-w-sm mx-auto h-full`}>
            {!isShowRightSide && (
              <div className="flex items-center justify-between whitespace-nowrap h-20">
                <div className="flex items-center">
                  <KakrolaLogo size="md" isTitle={screenWidth >= 768} />
                </div>

                <div className="bg-primary-100 px-3 py-1.5 rounded-lg text-sm font-medium text-primary-700">
                  Step {currentStep} of {useWithTeam ? "5" : "2"}
                </div>
              </div>
            )}

            <div className={`flex items-center h-[85%]`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`space-y-8 w-full ${isShowRightSide ? "p-6 sm:p-10" : ""}`}
              >
                {leftSide}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        {isShowRightSide && (
          <div className="flex-grow bg-primary-50">
            <div className="flex items-center justify-end h-20 pr-32">
              <div className="bg-primary-100 px-3 py-1.5 rounded-lg text-sm font-medium text-primary-700">
                Step {currentStep} of {useWithTeam ? "5" : "2"}
              </div>
            </div>

            <div className="flex items-center justify-center pt-60">
              <div className="flex items-center justify-center h-full">
                <Image
                  src={imageSrc}
                  width={400}
                  height={400}
                  alt=""
                  className="rounded-lg border border-text-200"
                  objectFit="cover"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardWrapper;
