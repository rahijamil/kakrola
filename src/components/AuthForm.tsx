"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/PasswordInput";
import Link from "next/link";
import Spinner from "./ui/Spinner";
import { AtSign, ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import loginImage from "./login.png";
import Hcaptcha from "./Hcaptcha";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import axios from "axios";
import KakrolaLogo from "@/app/kakrolaLogo";
import useScreen from "@/hooks/useScreen";
import AuthWrapper from "./AuthWrapper";

interface AuthFormProps {
  type: "signup" | "login" | "forgotPassword" | "updatePassword";
  onSubmit: (data: {
    email: string;
    password: string;
    captchaToken: string;
  }) => Promise<{
    success: boolean;
    error: string;
  }>;
  socialButtons?: JSX.Element;
  additionalInfo?: JSX.Element;
  additionalFooter?: JSX.Element;
}

const passwordCriteria = [
  { regex: /.{8,}/, message: "At least 8 characters long" },
  { regex: /[A-Z]/, message: "Include at least one uppercase letter" },
  { regex: /[a-z]/, message: "Include at least one lowercase letter" },
  { regex: /\d/, message: "Include at least one number" },
  {
    regex: /[!@#$%^&*(),.?":{}|<>]/,
    message: 'Include at least one special character !@#$%^&*(),.?":{}|<>',
  },
];

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  socialButtons,
  additionalInfo,
  additionalFooter,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL query parameters

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<ReactNode | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Hcaptcha
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captcha = useRef<HCaptcha | null>(null);

  const handleVerify = (token: string) => {
    setCaptchaToken(token);
  };

  useEffect(() => {
    // Pre-fill the email field if the email is present in the query params
    const emailParam = searchParams.get("email");
    if (emailParam && emailParam.length > 0) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (type !== "forgotPassword" && type !== "login") {
      const failedCriteria = passwordCriteria.filter(
        ({ regex }) => !regex.test(password)
      );

      if (password.length > 0 && failedCriteria.length > 0) {
        setError(
          <div className="text-left text-sm">
            <p className="font-semibold mb-2">
              Your password must meet the following criteria:
            </p>
            <ul className="list-inside list-disc space-y-1">
              {passwordCriteria.map(({ regex, message }, index) => (
                <li
                  key={index}
                  className={
                    regex.test(password) ? "text-green-600" : "text-red-500"
                  }
                >
                  {message}
                </li>
              ))}
            </ul>
          </div>
        );
        setLoading(false);
        return;
      } else {
        setError(null);
        setLoading(false);
        return;
      }
    }
  }, [password, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!captchaToken) {
      setError("Please complete the hCaptcha");
      captcha.current?.resetCaptcha();
      setLoading(false);
      return;
    }

    // Basic validation
    if (!email && type !== "updatePassword") {
      setError("Please enter your email address.");
      captcha.current?.resetCaptcha();
      setLoading(false);
      return;
    }

    // Validate email format using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && type !== "updatePassword") {
      setError("Please enter a valid email address.");
      captcha.current?.resetCaptcha();
      setLoading(false);
      return;
    }

    if (type !== "forgotPassword" && !password) {
      setError("Please enter your password.");
      captcha.current?.resetCaptcha();
      setLoading(false);
      return;
    }

    // Password validation for signup and login
    if (type !== "forgotPassword" && type !== "login") {
      const failedCriteria = passwordCriteria.filter(
        ({ regex }) => !regex.test(password)
      );

      if (failedCriteria.length > 0) {
        captcha.current?.resetCaptcha();
        setError(
          <div className="text-left text-sm">
            <p className="font-semibold mb-2">Password must:</p>
            <ul className="list-inside list-disc space-y-1">
              {passwordCriteria.map(({ regex, message }, index) => (
                <li
                  key={index}
                  className={
                    regex.test(password) ? "text-green-600" : "text-red-500"
                  }
                >
                  {message}
                </li>
              ))}
            </ul>
          </div>
        );
        setLoading(false);
        return;
      }
    }

    if (type === "updatePassword" && password !== confirmPassword) {
      setError("Passwords do not match.");
      captcha.current?.resetCaptcha();
      setLoading(false);
      return;
    }

    try {
      const result = await onSubmit({ email, password, captchaToken });

      if (result?.error) {
        setError(result?.error);
        setLoading(false);
        captcha.current?.resetCaptcha();
        return;
      }

      if (type === "forgotPassword" && result?.success) {
        setMessage("Password reset link has been sent to your email.");
      }

      if (result?.success) {
        if (token && (type == "login" || type == "signup")) {
          axios.get(`/api/invite/accept-invite?token=${token}`);
        }

        router.push("/app");
      }
    } catch (error: any) {
      setError(
        error.message
          ? `${error.message}`
          : "An unexpected error occurred. Please try again later."
      );
      captcha.current?.resetCaptcha();
      setLoading(false);
    } finally {
      setLoading(false);
      captcha.current?.resetCaptcha();
    }
  };

  const { screenWidth } = useScreen();

  return (
    <AuthWrapper
      content={
        <div className="w-full space-y-6 md:space-y-8 max-w-sm md:mt-12 px-6 md:px-4">
          <div className="max-w-xs">
            <h2 className="text-2xl md:text-3xl font-bold text-text-900">
              {type === "signup" && "Join Kakrola Today!"}
              {type === "login" && "Welcome Back!"}
              {type === "forgotPassword" && "Forgot Your Password?"}
              {type === "updatePassword" && "Update Your Password"}
            </h2>
            <p className="mt-2 text-sm text-text-600">
              {type === "signup" &&
                "Create your Kakrola account and start collaborating with your team."}
              {type === "login" &&
                "Log in to your Kakrola account to continue your productivity journey."}
              {type === "forgotPassword" &&
                message !==
                  "Password reset link has been sent to your email." &&
                "No worries! Just enter your email address, and we’ll send you a link to reset your password."}
              {type == "updatePassword" &&
                "Please enter your new password below."}
            </p>
          </div>

          {socialButtons && <>{socialButtons}</>}

          {error && <div className="text-red-600 text-center">{error}</div>}
          {message && (
            <div className="text-green-600 text-center">{message}</div>
          )}

          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {type !== "updatePassword" &&
                message !==
                  "Password reset link has been sent to your email." && (
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>

                    <Input
                      id="email-address"
                      name="email"
                      type="email"
                      label="Email"
                      autoComplete="email"
                      required
                      Icon={AtSign}
                      className="pl-10 w-full"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                    />
                  </div>
                )}

              {type !== "forgotPassword" && (
                <>
                  <div className="space-y-1">
                    <PasswordInput
                      autoFocus={type == "updatePassword"}
                      password={password}
                      setPassword={setPassword}
                      label="Password"
                      labelRight={
                        <>
                          {type == "login" && (
                            <div className="text-xs text-right">
                              <Link
                                href="/auth/forgot-password"
                                className="font-medium text-primary-600 hover:text-primary-600 transition"
                              >
                                Forgot your password?
                              </Link>
                            </div>
                          )}
                        </>
                      }
                    />
                  </div>

                  <div>
                    {type == "updatePassword" && (
                      <PasswordInput
                        password={confirmPassword}
                        setPassword={setConfirmPassword}
                        label="Confirm Password"
                        required
                      />
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-center">
              <Hcaptcha ref={captcha} onVerify={handleVerify} />
            </div>

            {message !== "Password reset link has been sent to your email." && (
              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-700 disabled:hover:bg-primary-500 text-surface disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner color="white" size="sm" />
                  ) : (
                    <>
                      {type === "signup" && "Sign up"}
                      {type === "login" && "Log in"}
                      {type === "forgotPassword" && "Send reset link"}
                      {type === "updatePassword" && "Update password"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>

          {additionalInfo}
          {additionalFooter}
        </div>
      }
      type={type}
    />
  );
};

export default AuthForm;
