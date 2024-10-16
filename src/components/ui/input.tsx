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
  howBig?: "xs" | "sm" | "md" | "lg";
  showFocusInMobile?: boolean;
  borderLess?: boolean;
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
      showFocusInMobile = false,
      type,
      borderLess,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`space-y-2 ${fullWidth && "w-full"}`}>
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={id}
              className="font-semibold text-text-700 pl-4 md:p-0"
            >
              {label}
            </label>

            {labelRight}
          </div>
        )}

        <div className="relative">
          {Icon && (
            <Icon
              strokeWidth={1.5}
              className="h-5 w-5 text-text-400 absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none"
            />
          )}
          <input
            className={`flex w-full bg-transparent ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-500 focus:outline-none focus:ring-offset-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-primary-10 read-only:cursor-default ${
              borderLess
                ? "border-none outline-none"
                : "border-text-300 hover:border-text-400 focus:border-text-300"
            } ${
              showFocusInMobile
                ? `rounded-lg ${type !== "radio" && "border focus:ring-2"}`
                : `${borderLess ? "md:rounded-md" : "md:rounded-lg"} ${
                    type !== "radio" && "border-b md:border md:focus:ring-2"
                  }`
            } ${
              type !== "radio" &&
              (howBig == "xs"
                ? borderLess
                  ? "px-1 h-5"
                  : "px-3 h-8"
                : howBig == "sm"
                ? "px-3 h-10"
                : howBig == "md"
                ? "px-4 py-2 h-10"
                : "px-4 py-3 h-14")
            } ${fullWidth ? "w-full" : ""} ${className} ${Icon && "pl-10"}`}
            ref={ref}
            id={id}
            type={type}
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
