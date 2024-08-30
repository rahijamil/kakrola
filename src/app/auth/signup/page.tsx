import React from "react";
import AuthForm from "@/components/AuthForm";
import { signup } from "@/app/auth/action";
import SocialLogin from "../SocialLogin";
import Link from "next/link";

const SignUpPage = () => (
  <AuthForm
    type="signup"
    onSubmit={async ({ email, password, captchaToken }) => {
      "use server";
      if (!password) {
        throw new Error("Password is required for sign up.");
      }

      return await signup({ email, password, captchaToken });
    }}
    socialButtons={<SocialLogin />}
    additionalFooter={
      <div className="text-center">
        <p className="mt-2 text-sm text-text-600">
          Already have an account?{" "}
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

export default SignUpPage;
