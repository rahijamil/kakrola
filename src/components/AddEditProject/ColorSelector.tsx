import React from "react";
import CustomSelect from "../ui/CustomSelect";
import { LucideProps } from "lucide-react";
import { colors } from "@/utils/colors";

const ColorSelector = ({
  value,
  onChange,
  height,
  isShowLabel,
  Icon,
}: {
  value: string;
  onChange: (color: string) => void;
  height?: string;
  isShowLabel?: boolean;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
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
      isShowLabel={isShowLabel}
      Icon={Icon}
    />
  );
};

export default ColorSelector;
