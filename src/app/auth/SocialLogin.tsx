import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signInWithProvider } from "./action";

const SocialLogin = () => {
  const socialProviders = [
    {
      name: "Google",
      icon: FcGoogle,
      onClick: () => {},
    },
    {
      name: "Apple",
      icon: FaApple,
      onClick: () => {},
    },
    {
      name: "GitHub",
      icon: FaGithub,
      onClick: () => signInWithProvider("github"),
    },
  ];

  return (
    <div>
      <ul className="w-full space-y-3">
        {socialProviders.map((provider) => (
          <li key={provider.name}>
            <Button variant="outline" color="gray" fullWidth>
              <provider.icon className="w-5 h-5 mr-2" />
              Continue with {provider.name}
            </Button>
          </li>
        ))}
      </ul>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;
