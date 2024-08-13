import React from "react";

// Simplified utility function to combine class names
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Simplified types for button variants and colors
type ButtonVariant = "default" | "outline" | "ghost" | "secondary" | "gray";
type ButtonColor = "indigo" | "red" | "gray";
type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon";

const getButtonClasses = (
  variant: ButtonVariant = "default",
  color: ButtonColor = "indigo",
  size: ButtonSize = "default",
  fullWidth: boolean = false,
  className?: string
) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    default: {
      indigo:
        "text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:to-indigo-600",
      red: "text-white bg-gradient-to-r from-red-700 to-red-600 hover:to-red-700",
      gray: ""
    },
    outline: {
      indigo: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
      red: "border border-red-600 text-red-600 hover:bg-red-50",
      gray: "border border-gray-300 hover:border-gray-400 focus:border-gray-300",
    },
    ghost: {
      indigo: "text-indigo-600 hover:bg-indigo-50",
      red: "text-red-600 hover:bg-red-50",
      gray: ""
    },
    secondary: {
      indigo: "bg-white text-indigo-600 hover:bg-gray-100",
      red: "bg-white text-red-600 hover:bg-gray-100",
      gray: ""
    },
    gray: {
      indigo:
        "bg-gradient-to-r from-gray-300 to-gray-200 text-gray-600 hover:to-gray-300",
      red: "bg-gradient-to-r from-gray-300 to-gray-200 text-gray-600 hover:to-gray-300",
      gray: ""
    },
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    xs: "h-7 rounded-md px-3",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return cn(
    baseClasses,
    variantClasses[variant][color],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      color = "indigo",
      size = "default",
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={getButtonClasses(variant, color, size, fullWidth, className)}
        ref={ref}
        tabIndex={0}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
