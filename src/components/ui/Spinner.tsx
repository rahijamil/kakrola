import React from "react";

const Spinner = ({ color = "primary" }: { color?: "white" | "primary" }) => {
  return (
    <svg
      className={`w-6 h-6 animate-spin ${color == "primary" ? "text-primary-600" : "text-white"}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 016.293-7.293A4.992 4.992 0 0112 4a5 5 0 014.293 2.707A8.001 8.001 0 0120 12h-2a6 6 0 00-5.293-5.293A6.002 6.002 0 006 12H4z"
      />
    </svg>
  );
};

export default Spinner;
