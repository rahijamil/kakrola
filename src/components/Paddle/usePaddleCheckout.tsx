import { useAuthProvider } from "@/context/AuthContext";
import {
  initializePaddle,
  Paddle,
  Environments,
  CheckoutEventsData,
} from "@paddle/paddle-js";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const usePaddleCheckout = ({
  id,
  priceId,
  quantity,
  paddleFrameRef,
  successUrl,
}: {
  priceId: string;
  quantity: number;
  id: "plus" | "business";
  paddleFrameRef: React.RefObject<HTMLDivElement>;
  successUrl?: string;
}) => {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(
    null
  );
  const { profile } = useAuthProvider();
  const pathname = usePathname();

  const handleCheckoutEvents = (event: CheckoutEventsData) => {
    setCheckoutData(event);
  };

  useEffect(() => {
    if (
      !paddle?.Initialized &&
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      process.env.NEXT_PUBLIC_PADDLE_ENV &&
      profile &&
      profile.metadata?.current_workspace_id
    ) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
        eventCallback: (event) => {
          if (event.data && event.name) {
            handleCheckoutEvents(event.data);
          }
        },
        checkout: {
          settings: {
            displayMode: "inline",
            theme: "light",
            allowLogout: !profile.email,
            showAddDiscounts: false,
            showAddTaxId: id === "business",
            frameTarget: "paddle-checkout-frame",
            frameInitialHeight: 450,
            frameStyle:
              "width: 100%; background-color: transparent; border: none",
            // successUrl: `${pathname}?settings=subscription&tab=checkout-success`,
            successUrl: successUrl ? successUrl : "/app",
          },
        },
      }).then(async (paddle) => {
        if (paddle && priceId && profile.metadata?.current_workspace_id) {
          setPaddle(paddle);
          paddle.Checkout.open({
            ...(profile.email && { customer: { email: profile.email } }),
            items: [{ priceId, quantity }],
            customData: {
              profile_id: profile.id,
              workspace_id: profile.metadata.current_workspace_id,
            },
          });
        }
      });
    }
  }, [paddle?.Initialized, priceId, profile]);

  useEffect(() => {
    if (paddle && priceId && paddle.Initialized) {
      paddle.Checkout.updateItems([{ priceId, quantity }]);
    }
  }, [paddle, priceId, quantity]);

  return { checkoutData };
};
