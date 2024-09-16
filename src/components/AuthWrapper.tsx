import KakrolaLogo from "@/app/kakrolaLogo";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import useScreen, { Breakpoint } from "@/hooks/useScreen";
import Link from "next/link";

const AuthWrapper = ({
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
    <div className="min-h-screen overflow-hidden bg-background w-full">
      <div
        className={`${rightSide && "grid"} h-screen ${
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

          <div className={`w-full md:w-11/12 max-w-sm lg:max-w-md mx-auto h-full`}>
            <div
              className={`flex md:h-[calc(100vh-10rem)] overflow-y-auto onboard_scrollbar md:mt-5`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`space-y-8 w-full ${
                  isShowRightSide ? "p-6 md:p-10" : ""
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

export default AuthWrapper;
