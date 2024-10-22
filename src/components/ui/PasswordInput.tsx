import React, { ReactNode, useState } from "react";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Input } from "./input";
import { generateSlug } from "@/utils/generateSlug";

const PasswordInput = ({
  password,
  setPassword,
  label,
  labelRight,
  required = false,
  autoFocus
}: {
  password: string;
  setPassword: (password: string) => void;
  label?: string;
  labelRight?: ReactNode;
  required?: boolean;
  autoFocus?: boolean
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const id = label ? generateSlug(label) : "password";

  return (
    <Input
      id={id}
      name="password"
      type={showPassword ? "text" : "password"}
      required={required}
      // Icon={LockClosedIcon}
      // rightIcon={
      //   <button
      //     type="button"
      //     className="absolute top-1/2 -translate-y-1/2 right-0 pr-3 flex items-center cursor-pointer"
      //     onClick={togglePasswordVisibility}
      //   >
      //     {showPassword ? (
      //       <EyeSlashIcon className="h-5 w-5 text-text-400" />
      //     ) : (
      //       <EyeIcon className="h-5 w-5 text-text-400" />
      //     )}
      //   </button>
      // }
      className="pl-10 w-full pr-10"
      placeholder={label ? label : "Password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      // label={label}
      // labelRight={labelRight}
      autoFocus={autoFocus}
    />
  );
};

export default PasswordInput;
