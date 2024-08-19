import { LucideProps } from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  fullWidth?: boolean;
  label?: string;
  Icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  rows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, fullWidth = false, label, Icon, id, rows, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="font-bold text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <Icon
              strokeWidth={1.5}
              className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2"
            />
          )}
          <textarea
            className={`flex w-full rounded-md border border-gray-300 hover:border-gray-400 focus-visible:border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 ${
              fullWidth ? "w-full" : ""
            } ${className} ${Icon && "pl-10"}`}
            ref={ref}
            id={id}
            rows={rows ? rows : 2}
            {...props}
          ></textarea>
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;