"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import { login } from "@/app/auth/action";
import { Button } from "@/components/ui/button";
import SocialLogin from "../SocialLogin";

const LoginPage = () => (
  <AuthForm
    type="login"
    onSubmit={async ({ email, password }) => {
      if (!password) {
        throw new Error("Password is required for log in.");
      }
      const response = await login({ email, password });
      if (!response.success) throw new Error(response.error);
    }}
    socialButtons={<SocialLogin />}
    additionalFooter={
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up for free
          </a>
        </p>
      </div>
    }
  />
);

export default LoginPage;
