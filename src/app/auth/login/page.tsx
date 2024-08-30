import React from "react";
import AuthForm from "@/components/AuthForm";
import { login } from "@/app/auth/action";

import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import the SocialLogin component with no SSR
const SocialLogin = dynamic(() => import("../SocialLogin"), { ssr: false });

const LoginPage = () => (
  <AuthForm
    type="login"
    onSubmit={async ({ email, password, captchaToken }) => {
      "use server";
      if (!password) {
        throw new Error("Password is required for log in.");
      }
      return await login({ email, password, captchaToken });
    }}
    socialButtons={<SocialLogin />}
    additionalFooter={
      <div className="text-center">
        <p className="text-sm text-text-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-primary-600 hover:text-primary-600"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    }
  />
);

export default LoginPage;
