import React from "react";
import CustomSelect from "../ui/CustomSelect";

const colors = [
  {
    id: 1,
    label: "Red",
    value: "red-500",
    color: "#ef4444",
  },
  {
    id: 2,
    label: "Orange",
    value: "orange-500",
    color: "#f97316",
  },
  {
    id: 3,
    label: "Yellow",
    value: "yellow-500",
    color: "#eab308",
  },
  {
    id: 4,
    label: "Green",
    value: "green-500",
    color: "#22c55e",
  },
  {
    id: 5,
    label: "Blue",
    value: "blue-500",
    color: "#3b82f6",
  },
  {
    id: 6,
    label: "-indigo-",
    value: "-indigo--500",
    color: "#6366f1",
  },
  {
    id: 7,
    label: "Violet",
    value: "violet-500",
    color: "#8b5cf6",
  },
  {
    id: 8,
    label: "Purple",
    value: "purple-500",
    color: "#a855f7",
  },
  {
    id: 9,
    label: "Pink",
    value: "pink-500",
    color: "#ec4899",
  },
  {
    id: 10,
    label: "Teal",
    value: "teal-500",
    color: "#14b8a6",
  },
  {
    id: 11,
    label: "Gray",
    value: "gray-500",
    color: "#64748b",
  },
];

const ColorSelector = ({
  value,
  onChange,
  height
}: {
  value: string;
  onChange: (color: string) => void;
  height?: string
}) => {
  return (
    <CustomSelect
      id="color"
      label="Color"
      options={colors}
      value={value}
      onChange={({ target: { value } }) => onChange(value)}
      placeholder="Select a color"
      height={height}
    />
  );
};

export default ColorSelector;
