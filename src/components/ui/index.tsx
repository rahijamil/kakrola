import { generateSlug } from "@/utils/generateSlug";
import { LucideProps } from "lucide-react";
import React, {
  Dispatch,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  SetStateAction,
  createContext,
  useContext,
  useId,
  useState,
  useEffect,
} from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import PortalWrapper from "../PortalWrapper";

// Dialog Component
interface DialogProps {
  children: ReactNode;
  onClose?: () => void;
  size?: "xs" | "sm" | "md" | "lg";
  position?: "top" | "center";
  bgWhite?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  onClose,
  size = "sm",
  position = "center",
  bgWhite,
}) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  return (
    <PortalWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`fixed inset-0 z-50 cursor-default flex justify-center bg-black ${
          bgWhite
            ? "bg-opacity-70 backdrop-blur-sm"
            : "bg-opacity-80 dark:bg-opacity-90"
        } ${position == "center" ? "items-center" : "items-start pt-40"}`}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`md:rounded-lg md:shadow-lg w-full md:w-11/12 flex flex-col ${
            bgWhite ? "bg-white" : "bg-surface"
          } ${
            size === "xs"
              ? "max-w-md"
              : size === "sm"
              ? "max-w-lg"
              : size === "md"
              ? "max-w-[800px] h-full md:h-auto md:aspect-[4/2.5]"
              : size === "lg"
              ? "max-w-7xl h-full md:h-auto md:aspect-[4/2.5]"
              : "max-w-3xl h-[90%]"
          }`}
          onClick={(ev) => ev.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </PortalWrapper>
  ); // Dialog Component
};

interface DialogHeaderProps {
  children: ReactNode;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => (
  <div className="flex items-center justify-between gap-8 border-b border-text-100 p-4 py-2">
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

type RadioGroupContextType = {
  value: string;
  onChange: (value: string) => void;
  name: string;
};

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(
  undefined
);

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  children,
  className,
}) => {
  const name = useId();

  return (
    <RadioGroupContext.Provider
      value={{ value, onChange: onValueChange, name }}
    >
      <div role="radiogroup" className={className}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

interface RadioGroupItemProps {
  value: string;
  id: string;
  className?: string;
  theme?: "light" | "dark";
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  id,
  className,
  theme,
}) => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup");
  }

  const { value: groupValue, onChange, name } = context;

  return (
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={value === groupValue}
      onChange={() => onChange(value)}
      className={`appearance-none w-4 h-4 min-w-4 min-h-4 rounded-full border border-text-300 checked:border-4 focus:outline-none checked:ring-2 ${
        theme === "light"
          ? "checked:ring-kakrola-500 checked:border-kakrola-500 checked:bg-kakrola-500"
          : "checked:ring-primary-500 checked:border-primary-500 checked:bg-primary-500"
      } checked:ring-offset-2 ${className}`}
    />
  );
};

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <label
      className={`text-sm font-medium text-text-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, ...props }, ref) => {
    const id = label ? generateSlug(label) : "";
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
            "px-2 border rounded-lg border-text-100 focus:border-text-400"
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
            className={`outline-none border-none bg-transparent placeholder:text-text-400 w-full resize-none overflow-hidden ${className} ${
              Icon && "pl-10"
            }`}
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
      className={`px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${className}`}
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
        className="w-full px-3 py-2 border border-text-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 appearance-none"
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
