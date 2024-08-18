import { LucideProps } from "lucide-react";
import React, {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  label?: string;
  labelRight?: ReactNode;
  Icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  rightIcon?: ReactNode;
  howBig?: "sm" | "md" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      fullWidth = false,
      label,
      Icon,
      id,
      labelRight,
      rightIcon,
      howBig = "md",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`space-y-1 ${fullWidth && "w-full"}`}>
        <div className="flex items-center justify-between">
          {label && (
            <>
              <label htmlFor={id} className="font-bold text-gray-700">
                {label}
              </label>

              {labelRight}
            </>
          )}
        </div>

        <div className="relative">
          {Icon && (
            <Icon
              strokeWidth={1.5}
              className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none"
            />
          )}
          <input
            className={`flex w-full rounded-md border border-gray-300 hover:border-gray-400 focus-visible:border-gray-300 bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-indigo-50 read-only:cursor-default ${
              howBig == "sm"
                ? "px-2 h-8"
                : howBig == "md"
                ? " px-3 py-2 h-10"
                : "py-3"
            } ${fullWidth ? "w-full" : ""} ${className} ${Icon && "pl-10"}`}
            ref={ref}
            id={id}
            {...props}
          />

          {rightIcon}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
