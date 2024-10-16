"use server";

import { ErrorMessage, parseSDKResponse } from "@/utils/paddle/data-helpers";
import { getPaddleInstance } from "./get-paddle-instance";
import { SubscriptionDetailResponse } from "@/lib/api.types";

export async function updateSubscription(
  subscriptionId: string,
  priceId: string,
  quantity: number
): Promise<SubscriptionDetailResponse | { error: string }> {
  try {
    if (!priceId || !quantity) return { error: ErrorMessage };

    const update = await getPaddleInstance().subscriptions.update(
      subscriptionId,
      {
        prorationBillingMode: "prorated_immediately",
        items: [
          {
            priceId,
            quantity,
          },
        ],
      }
    );

    return { data: parseSDKResponse(update) };
  } catch (e) {
    return { error: ErrorMessage };
  }
  return { error: ErrorMessage };
}
