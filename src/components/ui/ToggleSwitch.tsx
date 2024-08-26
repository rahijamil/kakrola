import React from "react";

interface ToggleSwitchProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  size?: "sm" | "md"; // Added size prop with "sm" and "md" options
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked,
  onCheckedChange,
  size = "md", // Default size is "md"
}) => {
  // Set switch and dot sizes based on the 'size' prop
  const switchClasses =
    size === "sm"
      ? "h-5 w-9 p-0.5" // Updated small size
      : "h-6 w-11 p-1"; // Updated medium size

  const dotClasses = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  // Determine the translation distance for the dot
  const translateClasses = checked
    ? size === "sm"
      ? "translate-x-4"
      : "translate-x-5" // Adjusted medium size for consistency
    : "translate-x-0.5";

  return (
    <button
      id={id}
      type="button"
      onClick={(ev) => {
        ev.stopPropagation();
        onCheckedChange(!checked);
      }}
      className={`${
        checked ? "bg-primary-600" : "bg-text-300"
      } relative inline-flex ${switchClasses} items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none`}
    >
      <span className="sr-only">Enable feature</span>
      <span
        className={`inline-block ${dotClasses} transform bg-surface rounded-full transition-transform duration-200 ease-in-out ${translateClasses}`}
      />
    </button>
  );
};
