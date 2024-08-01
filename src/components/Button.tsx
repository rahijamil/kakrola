import React, { ReactNode } from "react";

const Button = ({ children, type }: { children: ReactNode, type: "button" | "submit" }) => {
  return (
    <button type={type} className="px-4 py-1 text-sm text-white bg-blue-600 rounded-full hover:bg-blue-700 transition">
      {children}
    </button>
  );
};

export default Button;