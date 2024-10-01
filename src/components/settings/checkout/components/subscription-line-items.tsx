import { Subscription } from "@paddle/paddle-node-sdk";
import { parseMoney } from "@/utils/paddle/parse-money";
import { Card } from "../ui/card";

interface Props {
  subscription?: Subscription;
}

export function SubscriptionLineItems({ subscription }: Props) {
  const billingCycle = subscription?.billingCycle.interval;

  return (
    <Card className={"border-text-100 p-6 flex flex-col w-ful"}>
      <div
        className={"flex justify-between py-4 pt-0 border-text-100 border-b"}
      >
        <div className={"col-span-3 w-full text-text-700"}>Members</div>
        <div className={"col-span-3 w-full text-right text-text-700"}>
          {subscription?.items[0].quantity}
        </div>
      </div>
      <div className={"flex justify-between py-4 border-text-100 border-b"}>
        <div className={"w-full text-text-700 whitespace-nowrap"}>
          Subtotal{" "}
          <span>
            (x{" "}
            {parseMoney(
              (
                Number(
                  subscription?.recurringTransactionDetails?.totals.subtotal
                ) / Number(subscription?.items[0].quantity)
              ).toString(),
              subscription?.currencyCode
            )}{" "}
            /{" "}
            {subscription?.billingCycle.interval == "month" ? "month" : "year"}{" "}
            / member)
          </span>
        </div>
        <div className={"col-span-3 w-full text-right text-text-700"}>
          {parseMoney(
            subscription?.recurringTransactionDetails?.totals.subtotal,
            subscription?.currencyCode
          )}
        </div>
      </div>
      <div className={"flex justify-between py-4 border-text-100 border-b"}>
        <div className={"text-text-700 flex items-center gap-1"}>
          <span className="inline-block">Tax</span>
          <span className="inline-block">
            (
            {parseFloat(
              subscription?.recurringTransactionDetails?.lineItems[0].taxRate ??
                "0"
            ) * 100}
            %)
          </span>
        </div>
        <div className={"col-span-3 w-full text-right text-text-700"}>
          {parseMoney(
            subscription?.recurringTransactionDetails?.totals.tax,
            subscription?.currencyCode
          )}
        </div>
      </div>
      <div className={"flex justify-between pt-4"}>
        <div className={"col-span-3 w-full text-text-700"}>
          Total (Inc. tax)
        </div>
        <div className={"col-span-3 w-full font-semibold text-right"}>
          {parseMoney(
            subscription?.recurringTransactionDetails?.totals.total,
            subscription?.currencyCode
          )}
        </div>
      </div>
    </Card>
  );
}
