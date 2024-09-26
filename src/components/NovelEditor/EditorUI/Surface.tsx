import { cn } from "../utils";
import { HTMLProps, forwardRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type SurfaceProps = HTMLProps<HTMLDivElement> & {
  withShadow?: boolean;
  withBorder?: boolean;
};

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  (
    { children, className, withShadow = true, withBorder = true, ...props },
    ref
  ) => {
    const surfaceClass = cn(
      className,
      "bg-surface shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)] rounded-lg",
      withShadow ? "shadow-sm" : "",
      withBorder ? "border border-text-100" : ""
    );

    return (
      <motion.div
        initial={{
          scaleY: 0.8,
          y: 10,
          opacity: 0,
          transformOrigin: "bottom left",
        }}
        animate={{
          scaleY: 1,
          y: [0, -5, 0],
          opacity: 1,
          transformOrigin: "bottom left",
        }}
        exit={{
          scaleY: 0.8,
          y: 10,
          opacity: 0,
          transformOrigin: "bottom left",
        }}
        transition={{
          duration: 0.2,
          ease: [0.25, 0.1, 0.25, 1],
          y: {
            type: "spring",
            stiffness: 300,
            damping: 15,
          },
        }}
      >
        <div className={surfaceClass} {...props} ref={ref}>
          {children}
        </div>
      </motion.div>
    );
  }
);

Surface.displayName = "Surface";
