import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TaskType } from "@/types/project";

const sizeMap = {
  xs: 16, // Small size - 16px
  sm: 18, // Small size - 18px
  md: 20, // Medium size (default) - 20px
  lg: 24, // Large size - 24px
};

const AnimatedTaskCheckbox = ({
  priority,
  is_completed,
  handleCheckSubmit,
  playSound = true,
  disabled,
  size = "sm", // Default to 'md' size
}: {
  priority: TaskType["priority"];
  is_completed: boolean;
  handleCheckSubmit: () => void;
  playSound?: boolean;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg"; // Size prop with default 'md'
}) => {
  const [isChecked, setIsChecked] = useState(is_completed);
  const checkboxSize = sizeMap[size]; // Dynamically set the size based on the prop

  useEffect(() => {
    setIsChecked(is_completed);
  }, [is_completed]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!disabled) {
      setIsChecked(!isChecked);
      if (playSound && !isChecked) {
        new Audio("/sounds/done.wav").play();
      }
      handleCheckSubmit();
    }
  };

  const getColor = () => {
    switch (priority) {
      case "P1":
        return {
          hex: "#EF4444",
          class1: "bg-red-500",
          class2: "bg-red-50",
        };
      case "P2":
        return {
          hex: "#F97316",
          class1: "bg-orange-500",
          class2: "bg-orange-50",
        };
      case "P3":
        return {
          hex: "var(--color-primary-500)",
          class1: "bg-primary-500",
          class2: "bg-primary-50",
        };
      default:
        return {
          hex: "#6B7280",
          class1: "bg-text-500",
          class2: "bg-text-50",
        };
    }
  };

  const color = getColor();

  return (
    <motion.div
      className={`relative cursor-pointer flex items-center justify-center rounded-md ${
        isChecked && color.class1
      } ${disabled && "pointer-events-none"}`}
      style={{ width: checkboxSize, height: checkboxSize }}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: checkboxSize, height: checkboxSize }}
      >
        <motion.rect
          x="1"
          y="1"
          width={checkboxSize}
          height={checkboxSize}
          rx={checkboxSize / 4}
          ry={checkboxSize / 4}
          stroke={color.hex}
          strokeWidth="1.5"
        />

        <motion.path
          d="M7.5 12.5L10.5 15.5L16.5 9.5"
          stroke={isChecked ? "#fff" : color.hex}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: isChecked ? 1 : 0,
            opacity: isChecked ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
};

export default AnimatedTaskCheckbox;
