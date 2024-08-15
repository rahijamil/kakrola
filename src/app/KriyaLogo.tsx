import { CheckCheck } from "lucide-react";
import Image from "next/image";
import React from "react";

const KriyaLogo = ({
  size = "sm",
  isTitle,
}: {
  size: "sm" | "md" | "lg";
  isTitle?: boolean;
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`relative ${sizeClasses[size]}`}>
        <Image src="/kriya.svg" alt="Kriya Logo" fill />
      </div>

      {isTitle && (
        <span
          className={`font-bold text-indigo-600 ${
            size === "sm"
              ? "text-xl"
              : size === "md"
              ? "text-3xl"
              : "text-4xl"
          }`}
        >
          Kriya
        </span>
      )}
    </div>
  );
};

export default KriyaLogo;