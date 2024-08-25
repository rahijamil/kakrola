import React from "react";
import AuthForm from "@/components/AuthForm";
import { forgotPassword } from "@/app/auth/action";

const ForgotPassword = () => (
  <AuthForm
    type="forgotPassword"
    onSubmit={async ({ email }) => {
      "use server";
      return await forgotPassword(email);
    }}
    additionalFooter={
      <div className="mt-6 text-center">
        <p className="text-sm text-text-600">
          Remember your password?{" "}
          <a
            href="/auth/login"
            className="font-medium text-primary-600 hover:text-primary-600"
          >
            Log in
          </a>
        </p>
      </div>
    }
  />
);

export default ForgotPassword;
