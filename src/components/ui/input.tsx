import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  howBig?: "sm" | "md" | "lg"; // Add howBig prop with size options
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, Icon, howBig = "md", className, type, ...props }, ref) => {
    // Define base class and adjust size classes based on howBig
    const sizeClasses = {
      sm: "h-8 text-sm px-2 py-1",
      md: "h-9 text-sm px-3 py-1",
      lg: "h-10 text-base px-4 py-2",
    };

    return (
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={props.id}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="flex items-center border border-input rounded-md">
          {Icon && <Icon className="ml-2" />} {/* Render the icon if provided */}
          <input
            type={type}
            className={cn(
              "flex w-full rounded-md border-0 bg-transparent transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[howBig], // Use size classes based on howBig prop
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