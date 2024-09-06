"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signInWithProvider } from "./action";
import { useSearchParams } from "next/navigation";

const SocialLogin = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL query parameters

  const socialProviders = [
    {
      name: "Google",
      icon: FcGoogle,
      onClick: () => signInWithProvider("google", token),
    },
    // {
    //   name: "GitHub",
    //   icon: FaGithub,
    //   onClick: () => signInWithProvider("github", token),
    // },
  ];

  return (
    <div>
      <ul className="w-full space-y-3">
        {socialProviders.map((provider) => (
          <li key={provider.name}>
            <Button
              variant="outline"
              color="gray"
              fullWidth
              onClick={provider.onClick}
            >
              <provider.icon className="w-5 h-5 mr-2" />
              Continue with {provider.name}
            </Button>
          </li>
        ))}
      </ul>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-text-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-surface text-text-500">
            Or continue with
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;
