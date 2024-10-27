import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const OnboardWrapper = ({
  children,
  size,
}: {
  children: ReactNode;
  size?: "md";
}) => {
  return (
    <div
      className={cn(
        "bg-background wrapper flex items-center justify-center min-h-[calc(100vh-150px)]",
        size == "md" ? "max-w-md" : "max-w-sm"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`space-y-8 md:space-y-10 w-full px-1 md:px-0 h-fit`}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default OnboardWrapper;
