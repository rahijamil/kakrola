import React, { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import { forgotPassword } from "@/app/auth/action";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

const ForgotPassword = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center w-full h-screen text-primary-500">
        <Spinner color="current" size="md" />
      </div>
    }
  >
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
  </Suspense>
);

export default ForgotPassword;
