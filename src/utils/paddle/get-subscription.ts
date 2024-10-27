"use server";

import { getCustomerId } from "@/utils/paddle/get-customer-id";
import { ErrorMessage, parseSDKResponse } from "@/utils/paddle/data-helpers";
import { getPaddleInstance } from "@/utils/paddle/get-paddle-instance";
import { SubscriptionDetailResponse } from "@/lib/api.types";
import { Subscription } from "@/types/subscription";

export async function getSubscription(
  subscriptionId: Subscription["id"]
): Promise<SubscriptionDetailResponse> {
  try {
    const customerId = await getCustomerId();
    if (customerId) {
      const subscription = await getPaddleInstance().subscriptions.get(
        subscriptionId.toString(),
        {
          include: ["next_transaction", "recurring_transaction_details"],
        }
      );

      return { data: parseSDKResponse(subscription) };
    }
  } catch (e) {
    return { error: ErrorMessage };
  }
  return { error: ErrorMessage };
}
