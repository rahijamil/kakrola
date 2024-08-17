"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronsRight } from "lucide-react";

const HeroSectionEmailCollector = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Replace with your email collection logic
      // e.g., call an API or send the email to a service
      console.log("Email submitted:", email);
      setEmail("");
    } catch (err) {
      setError("Failed to submit email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-16 sm:pt-24 relative z-10">
      <div className="text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Join the Waitlist for Early Access
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-6 md:max-w-2xl lg:text-xl"
        >
          Be among the first to experience our new platform. Sign up now and get
          exclusive early access!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 max-w-md mx-auto flex flex-col items-center"
        >
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md items-center space-x-4"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1"
            />
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="flex-shrink-0"
            >
              {loading ? "Submitting..." : "Join Now"}
              <ChevronsRight
                strokeWidth={1.5}
                className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300"
              />
            </Button>
          </form>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSectionEmailCollector;
