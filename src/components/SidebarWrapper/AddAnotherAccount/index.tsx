import React, { Suspense } from "react";
import AuthForm from "../../AuthForm";
import SocialLogin from "@/app/auth/SocialLogin";
import { linkAccountsAfterAuth, login, signup } from "@/app/auth/action";
import AdditionalFooter from "./AdditionalFooter";
import Spinner from "@/components/ui/Spinner";

const handleSubmit = async (
  type: "signup" | "login",
  email: string,
  password: string
) => {
  if (!password) {
    throw new Error("Password is required for sign up.");
  }

  if (type === "login") {
    return await login({ email, password });
  } else {
    return await signup({ email, password });
  }
};

const AddAnotherAccount = ({
  onClose,
  type,
}: {
  onClose: () => void;
  type: "signup" | "login";
}) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-screen text-primary-500">
          <Spinner color="current" size="md" />
        </div>
      }
    >
      <AuthForm
        type={type}
        onSubmit={async ({ email, password, captchaToken }) => {
          // Save the profile ID before handling server-side auth

          // Call the server-side handler after saving the profile ID
          const result = await handleSubmit(type, email, password);

          // Link the accounts after successful login/signup
          const linkResult = await linkAccountsAfterAuth();

          if (!linkResult.success) {
            console.error("Failed to link accounts:", linkResult.error);
          }

          return result;
        }}
        socialButtons={<SocialLogin />}
        additionalFooter={<AdditionalFooter type={type} />}
        onClose={onClose}
      />
    </Suspense>
  );
};

export default AddAnotherAccount;
