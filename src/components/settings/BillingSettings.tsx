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
import { getTransactions } from "@/utils/paddle/get-transactions";
import { useQuery } from "@tanstack/react-query";
import { Subscription } from "@/types/subscription";
import { getSubscription } from "@/utils/paddle/get-subscription";

interface Props {
  subscriptionId: Subscription["id"];
}

export default function BillingSettings({ subscriptionId }: Props) {
  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ["subscription", subscriptionId],
    queryFn: () => getSubscription(subscriptionId!),
    enabled: !!subscriptionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["transactions", subscriptionId],
    queryFn: () => getTransactions(subscriptionId!, ""),
    enabled: !!subscriptionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  if (isSubscriptionLoading || isTransactionsLoading) return "Loading...";

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
