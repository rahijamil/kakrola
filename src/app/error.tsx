"use client";
import React from "react";
import OnboardWrapper from "./app/onboard/OnboardWrapper";
import { Button } from "@/components/ui/button";

const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <OnboardWrapper
      leftSide={
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-red-500 mb-4">Oops!</h1>
            <p className="text-lg text-gray-700 mb-4">
              Sorry, something went wrong.
            </p>
            <p className="text-md text-gray-500">
              {error?.message || "An unexpected error has occurred."}
            </p>
          </div>
          <Button
            onClick={() => reset()} // This will reset the error boundary
          >
            Try Again
          </Button>
        </div>
      }
      rightSide={null}
    />
  );
};

export default ErrorPage;
