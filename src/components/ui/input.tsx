import { LucideProps } from "lucide-react";
import React, {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  label?: string;
  Icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, fullWidth = false, label, Icon, id, ...props }, ref) => {
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
          <input
            className={`flex h-10 w-full rounded-md border border-gray-300 hover:border-gray-400 focus-visible:border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 ${
              fullWidth ? "w-full" : ""
            } ${className} ${Icon && "pl-10"}`}
            ref={ref}
            id={id}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
