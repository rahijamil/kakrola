"use client";
import React, { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import { updatePassword } from "@/app/auth/action";

const UpdatePassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
