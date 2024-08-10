"use client";
import React from "react";
import AuthForm from "@/components/AuthForm";
import { forgotPassword } from "@/app/auth/action";

const ForgotPassword = () => (
  <AuthForm
    type="forgotPassword"
    onSubmit={async ({ email }) => {
      const response = await forgotPassword(email);
      if (!response.success) throw new Error(response.error);
    }}
    additionalFooter={
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Remember your password? <a href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</a>
        </p>
      </div>
    }
  />
);

export default ForgotPassword;