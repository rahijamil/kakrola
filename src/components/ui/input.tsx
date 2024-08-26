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
              <label htmlFor={id} className="font-semibold text-text-700">
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
              className="h-5 w-5 text-text-400 absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none"
            />
          )}
          <input
            className={`flex w-full rounded-lg border border-text-300 hover:border-text-400 focus:border-text-300 bg-transparent ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-primary-10 read-only:cursor-default ${
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
