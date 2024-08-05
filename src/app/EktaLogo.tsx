import React from "react";

const EktaLogo = ({
  size = "sm",
  isTitle,
}: {
  size: "sm" | "md" | "lg";
  isTitle?: boolean;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`rounded-md bg-gradient-to-b from-indigo-500 to-indigo-700 flex items-center justify-center ${
          size == "sm"
            ? "w-9 h-9"
            : size == "md"
            ? "w-12 h-12"
            : size == "lg"
            ? "w-16 h-16"
            : "w-9 h-9"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`text-white ${
            size == "sm"
              ? "h-7 w-7"
              : size == "md"
              ? "h-9 w-9"
              : size == "lg"
              ? "h-12 w-12"
              : "h-8 w-8"
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
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
          Ekta
        </span>
      )}
    </div>
  );
};

export default EktaLogo;
