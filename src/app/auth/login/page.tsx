import React from "react";
import AuthForm from "@/components/AuthForm";
import { login } from "@/app/auth/action";

import dynamic from "next/dynamic";

// Dynamically import the SocialLogin component with no SSR
const SocialLogin = dynamic(() => import("../SocialLogin"), { ssr: false });

const LoginPage = () => (
  <AuthForm
    type="login"
    onSubmit={async ({ email, password }) => {
      "use server";
      if (!password) {
        throw new Error("Password is required for log in.");
      }
      return await login({ email, password });
    }}
    socialButtons={<SocialLogin />}
    additionalFooter={
      <div className="text-center">
        <p className="text-sm text-text-600">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/signup"
            className="font-medium text-primary-600 hover:text-primary-600"
          >
            Sign up for free
          </a>
        </p>
      </div>
    }
  />
);

export default LoginPage;
