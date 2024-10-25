import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  showFocusInMobile?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className, showFocusInMobile, ...props }, ref) => {
    const focusClasses = showFocusInMobile
      ? "focus-within:ring-2 focus-within:ring-primary-300" // Mobile focus styles
      : "md:focus-within:ring-2 md:focus-within:ring-primary-300"; // Desktop focus styles

    return (
      <div>
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[60px] w-full rounded-md border border-input outline-none bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            focusClasses,
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
