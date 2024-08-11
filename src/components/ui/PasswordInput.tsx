import React, { useState } from "react";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Input } from "./input";

const PasswordInput = ({
  password,
  setPassword,
  label,
}: {
  password: string;
  setPassword: (password: string) => void;
  label?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const id = label ? label.replace(/\s+/g, "") : "password";

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label ? label : "Password"}
      </label>
      <div className="relative">
        <Input
          id={id}
          name="password"
          type={showPassword ? "text" : "password"}
          required
          Icon={LockClosedIcon}
          className="pl-10 w-full pr-10" // Added pr-10 for spacing
          placeholder={label ? label : "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
