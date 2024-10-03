"use client";
import React, { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import { updatePassword } from "@/app/auth/action";
import Spinner from "@/components/ui/Spinner";

const UpdatePassword = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-screen text-primary-500">
          <Spinner color="current" size="md" />
        </div>
      }
    >
      <AuthForm
        type="updatePassword"
        onSubmit={async ({ password, captchaToken }) => {
          if (!password) {
            throw new Error("Please enter your password.");
          }
          return await updatePassword(password!);
        }}
      />
    </Suspense>
  );
};

export default UpdatePassword;
