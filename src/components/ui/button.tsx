import React, { ReactNode } from "react";
import { LucideIcon, LucideProps } from "lucide-react";

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
  className?: string,
  leftAlign?: boolean,
  rightContent?: boolean
) => {
  const baseClasses = `inline-flex items-center gap-2 rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
    leftAlign ? "justify-start text-left" : "justify-center"
  }`;

  const variantClasses = {
    default: {
      indigo:
        "text-surface bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:hover:to-primary-500",
      red: "text-surface bg-gradient-to-r from-red-700 to-red-600 hover:to-red-700",
      gray: "",
    },
    outline: {
      indigo: "border border-primary-600 text-primary-600 hover:bg-primary-50",
      red: "border border-red-600 text-red-600 hover:bg-red-50",
      gray: "border border-text-300 hover:border-text-400 focus:border-text-300",
    },
    ghost: {
      indigo: "text-primary-600 hover:bg-primary-50",
      red: "text-red-600 hover:bg-red-50",
      gray: "",
    },
    secondary: {
      indigo: "bg-surface text-primary-600 hover:bg-text-100",
      red: "bg-surface text-red-600 hover:bg-text-100",
      gray: "",
    },
    gray: {
      indigo:
        "bg-gradient-to-r from-text-300 to-text-200 text-text-600 hover:to-text-300",
      red: "bg-gradient-to-r from-text-300 to-text-200 text-text-600 hover:to-text-300",
      gray: "",
    },
  };

  const sizeClasses = {
    default: rightContent ? "pl-5 h-12 pr-2 gap-4" : "px-6 h-12",
    xs: "h-7 px-3",
    sm: "h-8 px-4",
    lg: "h-12 px-8",
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
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  leftAlign?: boolean;
  rightContent?: ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      color = "indigo",
      size = "default",
      fullWidth = false,
      icon: Icon,
      children,
      leftAlign,
      rightContent,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={getButtonClasses(
          variant,
          color,
          size,
          fullWidth,
          className,
          leftAlign,
          !!rightContent
        )}
        ref={ref}
        tabIndex={0}
        {...props}
      >
        {Icon && <Icon className="h-5 w-5" />}
        {children}
        {rightContent}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
