"use client";
import Link from "next/link";
import React, { useState } from "react";
import KakrolaLogo from "@/app/kakrolaLogo";
import Image from "next/image";
import emailSentIcon from "./email_sent.png";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const ConfirmationPage = () => {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    setIsResending(true);
    setMessage("");

    try {
      const response = await axios.post("/api/auth/resend-confirmation-email");

      setMessage(response.data.message);
    } catch (error) {
      console.error("Error resending confirmation email:", error);
      setMessage("Failed to resend the email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="wrapper">
        <Link href="/" className="h-20 flex items-center">
          <KakrolaLogo size="sm" isTitle />
        </Link>

        {/* Main Content */}
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-6 bg-white shadow-md rounded-lg border border-primary-50 text-center"
          >
            {/* Illustration or Icon */}
            <div className="mb-4">
              <Image
                src={emailSentIcon}
                alt="Email Sent"
                width={60}
                height={60}
              />
            </div>

            {/* Confirmation Message */}
            <h2 className="text-primary-500 text-2xl font-semibold mb-4">
              Email Confirmation Sent
            </h2>
            <p className="text-text-500 mb-6">
              We've sent a confirmation link to your email address. Please check
              your inbox and click the link to complete your registration.
            </p>

            {/* Go to Login Button */}
            <div className="flex justify-center">
              <Link href="/auth/login">
                <Button>Go to Log in</Button>
              </Link>
            </div>

            {/* Additional Help */}
            <p className="text-text-400 mt-4 text-sm">
              Didn&apos;t receive the email?{" "}
              <button
                onClick={handleResend}
                className="text-primary-500 hover:text-primary-600"
                disabled={isResending}
              >
                Resend
              </button>{" "}
              or check your spam folder.
            </p>

            {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
