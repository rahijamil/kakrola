"use client";
import { LucideProps } from "lucide-react";
import React, {
  Dispatch,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  SetStateAction,
} from "react";

// Dialog Component
interface DialogProps {
  children: ReactNode;
  onClose?: () => void;
  size?: "xs" | "sm" | "md" | "lg";
  position?: "top" | "center";
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  onClose,
  size = "sm",
  position = "center",
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 cursor-default flex justify-center ${
        size == "sm" ? "bg-transparent" : " bg-black bg-opacity-40"
      } ${position == "center" ? "items-center" : "items-start pt-40"}`}
      onClick={onClose}
    >
      <div
        className={`bg-surface rounded-2xl shadow-xl w-11/12 flex flex-col ${
          size === "xs"
            ? "max-w-md"
            : size === "sm"
            ? "max-w-lg p-2"
            : size === "md"
            ? "max-w-2xl h-[93%]"
            : size === "lg"
            ? "max-w-5xl h-[93%]"
            : "max-w-3xl h-[93%]"
        }`}
        onClick={(ev) => ev.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

interface DialogHeaderProps {
  children: ReactNode;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => (
  <div className="flex items-center justify-between gap-8 border-b border-text-200 p-4 py-2">
    {children}
  </div>
);

interface DialogTitleProps {
  children: ReactNode;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);

interface DialogFooterProps {
  children: ReactNode;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ children }) => (
  <div className="mt-6 flex justify-end space-x-2">{children}</div>
);

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, ...props }, ref) => {
    const id = label?.replace(" ", "-").toLowerCase();
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="font-semibold">
            {label}
          </label>
        )}
        <input
          className={`w-full transition py-1 bg-transparent outline-none ${
            label &&
            "px-2 border rounded-2xl border-text-200 focus:border-text-400"
          } ${className}`}
          ref={ref}
          id={id}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  fullWidth?: boolean;
  label?: string;
  Icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  rows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, fullWidth = false, label, Icon, id, rows, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        {label && (
          <label htmlFor={id} className="font-semibold text-text-700">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <Icon
              strokeWidth={1.5}
              className="h-5 w-5 text-text-400 absolute top-1/2 left-3 -translate-y-1/2"
            />
          )}
          <textarea
            className={`outline-none border-none bg-transparent placeholder:text-text-400 w-full resize-none overflow-hidden ${className} ${Icon && "pl-10"}`}
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

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <button
      className={`px-4 py-2 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${className}`}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = "Button";

// Select Component
interface SelectProps {
  children: ReactNode;
  onValueChange: (value: string) => void;
  defaultValue: string;
}

export const Select: React.FC<SelectProps> = ({
  children,
  onValueChange,
  defaultValue,
}) => {
  return (
    <div className="relative">
      <select
        onChange={(e) => onValueChange(e.target.value)}
        defaultValue={defaultValue}
        className="w-full px-3 py-2 border border-text-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 appearance-none"
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-5 h-5 text-text-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </div>
  );
};

interface SelectContentProps {
  children: ReactNode;
}

export const SelectContent: React.FC<SelectContentProps> = ({ children }) => (
  <>{children}</>
);

interface SelectItemProps {
  children: ReactNode;
  value: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({ children, value }) => (
  <option value={value}>{children}</option>
);

interface SelectTriggerProps {
  children: ReactNode;
  className: string;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children }) => (
  <>{children}</>
);

interface SelectValueProps {
  placeholder: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => (
  <span className="text-text-500">{placeholder}</span>
);
