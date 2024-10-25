import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  howBig?: "xs" | "sm" | "md" | "lg";
  showFocusInMobile?: boolean;
  fullWidth?: boolean;
  borderLess?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      Icon,
      howBig = "md",
      showFocusInMobile = false,
      className,
      type,
      fullWidth = false,
      borderLess = false,
      ...props
    },
    ref
  ) => {
    // Define size classes for the input sizes
    const sizeClasses = {
      xs: "h-7 text-xs px-2 py-0.5",
      sm: "h-8 text-sm px-2 py-1",
      md: "h-9 text-sm px-3 py-1",
      lg: "h-10 text-base px-4 py-2",
    };

    // Conditional focus styles for mobile devices
    const focusClasses = showFocusInMobile
      ? "focus-within:ring-2 focus-within:ring-primary-300" // Mobile focus styles
      : "md:focus-within:ring-2 md:focus-within:ring-primary-300"; // Desktop focus styles

    return (
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={props.id}
            className="mb-1 block text-sm font-medium text-text-700"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex items-center border border-input rounded-md",
            focusClasses
          )}
        >
          {Icon && (
            <Icon
              className="ml-2 text-text-500 pointer-events-none"
              strokeWidth={1.5}
            />
          )}{" "}
          {/* Render the icon if provided */}
          <input
            type={type}
            className={cn(
              "flex rounded-md border-none outline-none bg-transparent transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[howBig], // Use size classes based on howBig prop
              fullWidth ? "w-full" : "w-full",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
