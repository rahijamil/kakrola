import React from "react";
import AuthForm from "@/components/AuthForm";
import { forgotPassword } from "@/app/auth/action";
import Link from "next/link";

const ForgotPassword = () => (
  <AuthForm
    type="forgotPassword"
    onSubmit={async ({ email, captchaToken }) => {
      "use server";
      return await forgotPassword(email, captchaToken);
    }}
    additionalFooter={
      <div className="mt-6 text-center">
        <p className="text-sm text-text-600">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary-600 hover:text-primary-600"
          >
            Log in
          </Link>
        </p>
      </div>
    }
  />
);

export default ForgotPassword;
