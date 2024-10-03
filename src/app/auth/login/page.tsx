import React, { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import { login } from "@/app/auth/action";

import dynamic from "next/dynamic";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

// Dynamically import the SocialLogin component with no SSR
const SocialLogin = dynamic(() => import("../SocialLogin"), { ssr: false });

const LoginPage = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center w-full h-screen text-primary-500">
        <Spinner color="current" size="md" />
      </div>
    }
  >
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
  </Suspense>
);

export default LoginPage;
