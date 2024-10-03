"use client";

import { usePathname } from "next/navigation";
import React from "react";

const AdditionalFooter = ({ type }: { type: "signup" | "login" }) => {
  const pathname = usePathname();

  return type === "login" ? (
    <div className="text-center">
      <p className="text-sm text-text-600">
        Don&apos;t have an account?{" "}
        <button
          onClick={() =>
            window.history.pushState({}, "", `${pathname}?auth=signup`)
          }
          className="font-medium text-primary-600 hover:text-primary-600"
        >
          Sign up for free
        </button>
      </p>
    </div>
  ) : type === "signup" ? (
    <div className="text-center">
      <p className="mt-2 text-sm text-text-600">
        Already have an account?{" "}
        <button
          onClick={() =>
            window.history.pushState({}, "", `${pathname}?auth=login`)
          }
          className="font-medium text-primary-600 hover:text-primary-600"
        >
          Log in
        </button>
      </p>
    </div>
  ) : (
    <></>
  );
};

export default AdditionalFooter;
