import React, { ReactNode } from "react";
import { motion } from "framer-motion";

const OnboardWrapper = ({
  leftSide,
  currentStep,
}: {
  leftSide: ReactNode;
  currentStep?: number;
}) => {
  return (
    <div className="min-h-screen overflow-hidden bg-background w-full">
      <div className="bg-surface">
        <div
          className={`w-11/12 max-w-sm mx-auto md:h-[calc(100vh-12rem)] flex-col flex items-center justify-center gap-10`}
        >
          {currentStep && (
            <div className="bg-primary-100 px-3 py-1.5 rounded-lg text-sm font-medium text-primary-700">
              Step {currentStep} of 4
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`space-y-8 w-full px-1 md:px-0`}
          >
            {leftSide}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OnboardWrapper;
