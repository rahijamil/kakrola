"use client";

import { ErrorContent } from "@/components/settings/checkout/ui/error-content";
import {
  SubscriptionDetailResponse,
  TransactionResponse,
} from "@/lib/api.types";
import { SubscriptionHeader } from "./checkout/components/subscription-header";
import { SubscriptionNextPaymentCard } from "./checkout/components/subscription-next-payment-card";
import { SubscriptionLineItems } from "./checkout/components/subscription-line-items";
import { SubscriptionPastPaymentsCard } from "./checkout/components/subscription-past-payments-card";

interface Props {
  subscription: SubscriptionDetailResponse;
  transactions: TransactionResponse;
}

export default function BillingSettings({ subscription, transactions }: Props) {
  if (subscription?.data && transactions?.data) {
    return (
      <div className="space-y-6">
        <SubscriptionHeader subscription={subscription.data} />

        <div className="h-px w-full bg-text-100" />

        <SubscriptionLineItems subscription={subscription.data} />

        <SubscriptionNextPaymentCard
          transactions={transactions.data}
          subscription={subscription.data}
        />
        <SubscriptionPastPaymentsCard
          transactions={transactions.data}
          subscriptionId={subscription.data.id}
        />
      </div>
    );
  } else {
    return <ErrorContent />;
  }
}
