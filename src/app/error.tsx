"use client";
import React from "react";
import OnboardWrapper from "./app/onboarding/OnboardWrapper";
import { Button } from "@/components/ui/button";

const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="space-y-4 w-11/12 mx-auto max-w-md h-screen pt-40 flex flex-col items-center">
      <div>
        <h1 className="text-3xl font-bold text-red-500 mb-4">Oops!</h1>
        <p className="text-lg text-text-700 mb-4">
          Sorry, something went wrong.
        </p>
        <p className="text-md text-text-500">
          {error?.message || "An unexpected error has occurred."}
        </p>
      </div>
      <div className="flex items-start">
        <Button
          onClick={() => reset()} // This will reset the error boundary
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
