import React, { ReactNode } from "react";
import { motion } from "framer-motion";

const OnboardWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="min-h-screen overflow-hidden bg-background w-full">
      <div
        className={`w-11/12 max-w-sm mx-auto md:h-[calc(100vh-12rem)] flex-col flex items-center justify-center gap-10 bg-surface`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`space-y-8 md:space-y-10 w-full px-1 md:px-0`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardWrapper;
