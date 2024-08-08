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
  const switchClasses = size === "sm" ? "h-4 w-8" : "h-6 w-11";
  const dotClasses = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const translateClasses = checked
    ? size === "sm"
      ? "translate-x-4"
      : "translate-x-6"
    : size === "sm"
    ? "translate-x-1"
    : "translate-x-1";

  return (
    <button
      id={id}
      type="button"
      onClick={(ev) => {
        ev.stopPropagation();
        onCheckedChange(!checked);
      }}
      className={`${
        checked ? "bg-indigo-600" : "bg-gray-200"
      } relative inline-flex ${switchClasses} items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
    >
      <span className="sr-only">Enable feature</span>
      <span
        className={`inline-block ${dotClasses} transform rounded-full bg-white transition-transform ${translateClasses}`}
      />
    </button>
  );
};
