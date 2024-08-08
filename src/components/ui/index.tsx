"use client";
import React, { Dispatch, forwardRef, ReactNode, SetStateAction } from "react";

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
        className={`bg-white rounded-lg shadow-xl w-full flex flex-col ${
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
  <div className="flex items-center justify-between gap-8 border-b border-gray-200 p-4 py-2">
    {children}
  </div>
);

interface DialogTitleProps {
  children: ReactNode;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => (
  <h2 className="text-xl font-bold">{children}</h2>
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
          <label htmlFor={id} className="font-bold">
            {label}
          </label>
        )}
        <input
          className={`w-full transition py-1 outline-none text-sm ${
            label &&
            "px-2 border rounded-md border-gray-200 focus:border-gray-400"
          } ${className}`}
          ref={ref}
          id={id}
          {...props}
        />
      </div>
    );
  }
);

// Textarea Component
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => (
    <textarea
      className={`w-full border-none outline-none ${className}`}
      ref={ref}
      {...props}
    />
  )
);

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <button
      className={`px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${className}`}
      ref={ref}
      {...props}
    />
  )
);

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
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
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
  <span className="text-gray-500">{placeholder}</span>
);
