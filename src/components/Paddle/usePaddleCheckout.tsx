import { useAuthProvider } from "@/context/AuthContext";
import useTheme from "@/hooks/useTheme";
import { PricingTier, Tier } from "@/lib/constants/pricing-tier";
import { initializePaddle, Paddle, Environments } from "@paddle/paddle-js";
import { useEffect, useState } from "react";

export const usePaddleCheckout = () => {
  const [paddle, setPaddle] = useState<Paddle>();
  const { profile } = useAuthProvider();
  const { theme } = useTheme();

  useEffect(() => {
    const paddleEnv = process.env.NEXT_PUBLIC_PADDLE_ENV;
    const paddleToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    if (!paddle && paddleEnv && paddleToken) {
      initializePaddle({
        environment: paddleEnv as Environments,
        token: paddleToken,
      })
        .then((paddleInstance: Paddle | undefined) => {
          if (paddleInstance) {
            setPaddle(paddleInstance);
          }
        })
        .catch((error) => {
          console.error("Failed to initialize Paddle:", error);
        });
    }
  }, []);

  const openCheckout = (selectedPlan: {
    priceId: string;
    quantity: number;
    id: "pro" | "business";
  }) => {
    if (!paddle || !profile) {
      console.error("Paddle not initialized or profile not available");
      return;
    }

    try {
      paddle.Checkout.open({
        customer: {
          email: profile.email,
          address: {},
        },
        items: [
          {
            priceId: selectedPlan.priceId,
            quantity: selectedPlan.quantity,
          },
        ],
        settings: {
          displayMode: "inline",
          frameTarget: "paddle-checkout",
          frameInitialHeight: 450,
          frameStyle:
            "width: 100%; min-width: 312px; background-color: transparent; border: none;",
          theme: theme === "dark" ? "dark" : "light",
          allowLogout: false,
          showAddDiscounts: false,
          locale: "en",
          showAddTaxId: selectedPlan.id === "business",
        },
        customData: {
          teamSize: selectedPlan.quantity,
        },
      });
    } catch (error) {
      console.error("Paddle checkout error:", error);
    }
  };

  return { openCheckout, isReady: !!paddle };
};
