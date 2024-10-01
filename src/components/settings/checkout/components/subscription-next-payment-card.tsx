import { Subscription, Transaction } from "@paddle/paddle-node-sdk";
import dayjs from "dayjs";
import { parseMoney } from "@/utils/paddle/parse-money";
import { PaymentMethodSection } from "./payment-method-section";
import { Card } from "../ui/card";
interface Props {
  transactions?: Transaction[];
  subscription?: Subscription;
}

export function SubscriptionNextPaymentCard({
  subscription,
  transactions,
}: Props) {
  if (!subscription?.nextBilledAt) {
    return null;
  }
  return (
    <Card className={"border-text-100 p-6"}>
      <div className={"flex gap-6 flex-col border-text-100 border-b pb-6"}>
        <div className={"text-lg font-semibold text-text-900"}>Next payment</div>
        <div className={"flex gap-1 items-end @16xs:flex-wrap"}>
          <span className={"text-xl leading-5 font-medium text-primary"}>
            {parseMoney(
              subscription?.nextTransaction?.details.totals.total,
              subscription?.currencyCode
            )}
          </span>
          <span className={"text-text-500"}>due</span>
          <span className={"ext-base leading-4 font-semibold text-primary"}>
            {dayjs(subscription?.nextBilledAt).format("MMM DD, YYYY")}
          </span>
        </div>
      </div>
      <PaymentMethodSection
        transactions={transactions}
        updatePaymentMethodUrl={
          subscription?.managementUrls?.updatePaymentMethod
        }
      />
    </Card>
  );
}
