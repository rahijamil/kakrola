"use client";
import React, { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/PasswordInput";
import EktaLogo from "@/app/EktaLogo";
import Link from "next/link";
import Spinner from "./ui/Spinner";
import { AtSign } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "signup" | "login" | "forgotPassword" | "updatePassword";
  onSubmit: (data: { email: string; password?: string }) => Promise<{
    success: boolean;
    error: string;
  }>;
  socialButtons?: JSX.Element;
  additionalInfo?: JSX.Element;
  additionalFooter?: JSX.Element;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  socialButtons,
  additionalInfo,
  additionalFooter,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<ReactNode | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    // Basic validation
    if (!email && type !== "updatePassword") {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    // Validate email format using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && type !== "updatePassword") {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (type !== "forgotPassword" && !password) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }

    // Password validation for signup and login
    if (type !== "forgotPassword" && type !== "login") {
      const passwordCriteria = [
        { regex: /.{8,}/, message: "At least 8 characters long" },
        { regex: /[A-Z]/, message: "Include at least one uppercase letter" },
        { regex: /[a-z]/, message: "Include at least one lowercase letter" },
        { regex: /\d/, message: "Include at least one number" },
        {
          regex: /[!@#$%^&*(),.?":{}|<>]/,
          message:
            'Include at least one special character !@#$%^&*(),.?":{}|<>',
        },
      ];

      const failedCriteria = passwordCriteria.filter(
        ({ regex }) => !regex.test(password)
      );

      if (failedCriteria.length > 0) {
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
      setLoading(false);
      return;
    }

    try {
      const result = await onSubmit({ email, password });

      if (result?.error) {
        setError(result?.error);
        setLoading(false);
        return;
      }

      if (type === "forgotPassword" && result?.success) {
        setMessage("Password reset link has been sent to your email.");
      }

      if(result.success){
        router.push("/app");
      }
    } catch (error: any) {
      setError(
        error.message
          ? `${error.message}`
          : "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative">
      <div className="flex items-center justify-center h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
        >
          <div className="text-center space-y-6">
            <EktaLogo size="md" isTitle />
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                {type === "signup" && "Join Ekta Today"}
                {type === "login" && "Welcome back"}
                {type === "forgotPassword" && "Forgot your password?"}
                {type === "updatePassword" && "Update your password"}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {type === "signup" &&
                  "Create your Ekta account and start collaborating"}
                {type === "login" && "Log in to your Ekta account"}
                {type === "forgotPassword" &&
                  message !==
                    "Password reset link has been sent to your email." &&
                  "Enter your email address and we'll send you a link to reset your password."}
              </p>
            </div>
          </div>

          {socialButtons && (
            <>
              {socialButtons}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </>
          )}

          {error && <div className="text-red-600 text-center">{error}</div>}
          {message && (
            <div className="text-green-600 text-center">{message}</div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                      autoComplete="email"
                      required
                      Icon={AtSign}
                      className="pl-10 w-full"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}

              {type !== "forgotPassword" && (
                <>
                  <div>
                    <PasswordInput
                      password={password}
                      setPassword={setPassword}
                    />

                    {type == "login" && (
                      <div className="text-sm text-right">
                        <Link
                          href="/auth/forgot-password"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    )}
                  </div>

                  <div>
                    {type == "updatePassword" && (
                      <PasswordInput
                        password={confirmPassword}
                        setPassword={setConfirmPassword}
                        label="Confirm Password"
                      />
                    )}
                  </div>
                </>
              )}
            </div>

            {message !== "Password reset link has been sent to your email." && (
              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:hover:bg-indigo-600 text-white disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner color="white" />
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
        </motion.div>
      </div>
    </div>
  );
};

export default AuthForm;
