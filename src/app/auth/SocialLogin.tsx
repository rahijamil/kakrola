"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaSlack } from "react-icons/fa";
import { FaTwitter, FaXTwitter } from "react-icons/fa6";
import { AiFillLinkedin } from "react-icons/ai";
import { SiNotion } from "react-icons/si";
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
    {
      name: "GitHub",
      icon: FaGithub,
      onClick: () => signInWithProvider("github", token),
    },
    {
      name: "X",
      icon: FaXTwitter,
      onClick: () => signInWithProvider("twitter", token),
    },
    {
      name: "LinkedIn",
      icon: AiFillLinkedin,
      svgIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="20px"
          height="20px"
        >
          <path
            fill="#0288D1"
            d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
          />
          <path
            fill="#FFF"
            d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
          />
        </svg>
      ),
      onClick: () => signInWithProvider("linkedin", token),
    },
    {
      name: "Notion",
      icon: SiNotion,
      onClick: () => signInWithProvider("notion", token),
    },
    {
      name: "Slack",
      icon: FaSlack,
      svgIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2447.6 2452.5"
          width="20"
          height="20"
        >
          <g clip-rule="evenodd" fill-rule="evenodd">
            <path
              d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z"
              fill="#36c5f0"
            />
            <path
              d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z"
              fill="#2eb67d"
            />
            <path
              d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z"
              fill="#ecb22e"
            />
            <path
              d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0"
              fill="#e01e5a"
            />
          </g>
        </svg>
      ),
      onClick: () => signInWithProvider("slack_oidc", token),
    },
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
              {provider.svgIcon ? (
                provider.svgIcon
              ) : (
                <provider.icon className="w-5 h-5 mr-2" />
              )}
              Continue with {provider.name}
            </Button>
          </li>
        ))}
      </ul>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-text-100" />
        </div>
        <div className="relative flex justify-center text-xs">
          {/* <span className="px-2 bg-background dark:bg-surface text-text-500">
            Or continue with
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;
