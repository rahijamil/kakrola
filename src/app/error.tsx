"use client";
import React from "react";

const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Oops!</h1>
      <p className="text-lg text-gray-700 mb-4">Sorry, something went wrong.</p>
      <p className="text-md text-gray-500">
        {error?.message || "An unexpected error has occurred."}
      </p>
      <button
        onClick={() => reset()} // This will reset the error boundary
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorPage;
