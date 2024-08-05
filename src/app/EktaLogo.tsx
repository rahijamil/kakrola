import React from "react";

const EktaLogo = ({ size }: { size: "md" | "lg" }) => {
  return (
    <div
      className={`rounded-md bg-gradient-to-rfrom-indigo-500to-purple-500 bg-indigo-600 flex items-center justify-center ${
        size == "md" ? "w-12 h-12" : size == "lg" ? "w-16 h-16" : "w-9 h-9"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`text-white ${
          size == "md" ? "h-9 w-9" : size == "lg" ? "h-12 w-12" : "h-8 w-8"
        }`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </div>
  );
};

export default EktaLogo;
