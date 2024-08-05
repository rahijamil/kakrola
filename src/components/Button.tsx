import React, { ReactNode } from "react";

const Button = ({
  children,
  type = "button",
  onClick,
}: {
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-4 py-1 text-sm text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition"
    >
      {children}
    </button>
  );
};

export default Button;
