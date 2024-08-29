import KakrolaLogo from "@/app/kakrolaLogo";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import useScreen, { Breakpoint } from "@/hooks/useScreen";
import Link from "next/link";

const OnboardWrapper = ({
  leftSide,
  rightSide,
  useWithTeam,
  currentStep,
}: {
  leftSide: ReactNode;
  rightSide: ReactNode;
  useWithTeam?: boolean;
  currentStep?: number;
}) => {
  const { breakpoint, screenWidth } = useScreen();

  const isShowRightSide = (["lg", "xl"] as Breakpoint["breakpoint"][]).includes(
    breakpoint
  );

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <div
        className={`grid h-screen ${
          isShowRightSide ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* Left Side */}
        <div className="bg-surface">
          {isShowRightSide && (
            <Link href="/" className="flex items-center h-20 pl-32">
              <KakrolaLogo size="md" isTitle />
            </Link>
          )}

          <div className={`w-11/12 max-w-sm lg:max-w-md mx-auto h-full`}>
            {!isShowRightSide && (
              <div className="flex items-center justify-between whitespace-nowrap h-20">
                <Link href="/" className="flex items-center">
                  <KakrolaLogo
                    size="md"
                    isTitle={currentStep ? screenWidth >= 768 : true}
                  />
                </Link>

                {currentStep && (
                  <div className="bg-primary-100 px-3 py-1.5 rounded-full text-sm font-medium text-primary-700">
                    Step {currentStep} of {useWithTeam ? "5" : "2"}
                  </div>
                )}
              </div>
            )}

            <div className={`flex items-center h-[80%]`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`space-y-8 w-full ${
                  isShowRightSide ? "p-6 sm:p-10" : ""
                }`}
              >
                {leftSide}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        {isShowRightSide && (
          <div className="flex-grow bg-primary-50f bg-gradient-to-b from-primary-50 via-background to-primary-50">
            {currentStep && (
              <div className="flex items-center justify-end h-20 pr-32">
                <div className="bg-primary-100 px-3 py-1.5 rounded-full text-sm font-medium text-primary-700">
                  Step {currentStep} of {useWithTeam ? "5" : "2"}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center h-[80%]">
              <div className="flex items-center justify-center w-full h-full">
                {rightSide}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardWrapper;
