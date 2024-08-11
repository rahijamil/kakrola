"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import { signup } from "@/app/auth/action";
import { Button } from "@/components/ui/button";
import SocialLogin from "../SocialLogin";

const SignUpPage = () => (
  <AuthForm
    type="signup"
    onSubmit={async ({ email, password }) => {
      if (!password) {
        throw new Error("Password is required for sign up.");
      }

      return await signup({ email, password });
    }}
    socialButtons={<SocialLogin />}
    additionalFooter={
      <div className="text-center">
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </a>
        </p>
      </div>
    }
  />
);

export default SignUpPage;
