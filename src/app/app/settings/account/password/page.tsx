"use client";
import React, { ReactNode, useEffect } from "react";
import PasswordInput from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/client";

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

const Password = () => {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<ReactNode | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  useEffect(() => {
    if (password.length > 0) {
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
      else {
        setError(null);
      }
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!password) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }

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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabaseBrowser.auth.updateUser({ password });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setMessage("Password updated successfully.");
        setLoading(false);
        router.back();
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
    <form className="space-y-6 mt-6 ml-6 max-w-sm" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="password" className="font-bold">
            New password
          </label>
          <PasswordInput
            required
            password={password}
            setPassword={setPassword}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="font-bold">
            Confirm new password
          </label>
          <PasswordInput
            password={confirmPassword}
            setPassword={setConfirmPassword}
          />
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      <div className="flex items-center justify-center gap-4">
        <Button
          type="button"
          variant="gray"
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full bg-primary-500 hover:bg-primary-700 disabled:hover:bg-primary-500 text-surface disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? <Spinner color="white" /> : <>Update Password</>}
        </Button>
      </div>
    </form>
  );
};

export default Password;
