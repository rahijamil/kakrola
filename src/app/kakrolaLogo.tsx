import Image from "next/image";
import React from "react";

const KakrolaLogo = ({
  size = "sm",
  isTitle,
}: {
  size: "sm" | "md" | "lg";
  isTitle?: boolean;
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-20 h-20",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`relative ${sizeClasses[size]}`}>
        <Image src="/kakrola.svg" alt="Kakrola Logo" fill />
      </div>

      {isTitle && (
        <span
          className={`font-semibold text-[#0076A3] ${
            size === "sm"
              ? "text-xl"
              : size === "md"
              ? "text-2xl"
              : "text-3xl"
          }`}
        >
          Kakrola
        </span>
      )}
    </div>
  );
};

export default KakrolaLogo;