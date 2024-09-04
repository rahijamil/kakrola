import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TaskType } from "@/types/project";

const AnimatedTaskCheckbox = ({
  priority,
  is_completed,
  handleCheckSubmit,
  playSound = true,
  disabled,
}: {
  priority: TaskType["priority"];
  is_completed: boolean;
  handleCheckSubmit: () => void;
  playSound?: boolean;
  disabled?: boolean;
}) => {
  const [isChecked, setIsChecked] = useState(is_completed);

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
          class1: "bg-gray-500",
          class2: "bg-gray-50",
        };
    }
  };

  const color = getColor();

  return (
    <motion.div
      className={`relative w-5 h-5 min-w-5 min-h-5 cursor-pointer flex items-center justify-center rounded-full ${
        isChecked && color.class1
      } ${disabled && "pointer-events-none"}`}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <motion.path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
          stroke={color.hex}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
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
