import Image from "next/image";
import React from "react";

const KriyaLogo = ({
  size = "sm",
  isTitle,
}: {
  size: "sm" | "md" | "lg";
  isTitle?: boolean;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`relative ${
          size == "sm"
            ? "w-9 h-9"
            : size == "md"
            ? "w-12 h-12"
            : size == "lg"
            ? "w-16 h-16"
            : "w-9 h-9"
        }`}
      >
        <Image src="/kriya.svg" alt="Ekta Logo" fill />
      </div>

      {isTitle && (
        <span
          className={`font-bold text-indigo-600 ${
            size == "sm"
              ? "text-2xl"
              : size == "md"
              ? "text-3xl"
              : size == "lg"
              ? "text-4xl"
              : "text-xl"
          }`}
        >
          Kriya
        </span>
      )}
    </div>
  );
};

export default KriyaLogo;
