import { Subscription } from "@paddle/paddle-node-sdk";
import Image from "next/image";
import { parseMoney } from "@/utils/paddle/parse-money";
import { SubscriptionAlerts } from "./subscription-alerts";
import dayjs from "dayjs";
import { Status } from "../ui/status";
import { SubscriptionHeaderActionButton } from "./subscription-header-action-button";

interface Props {
  subscription: Subscription;
}

export function SubscriptionHeader({ subscription }: Props) {
  const subscriptionItem = subscription.items[0];

  const price = parseFloat(
    subscription?.recurringTransactionDetails?.totals.total ?? "0"
  );
  const formattedPrice = parseMoney(
    price.toString(),
    subscription.currencyCode
  );
  const frequency =
    subscription.billingCycle.frequency === 1
      ? `/${subscription.billingCycle.interval}`
      : `every ${subscription.billingCycle.frequency} ${subscription.billingCycle.interval}s`;

  const formattedStartedDate = dayjs(subscription.startedAt).format(
    "MMM DD, YYYY"
  );

  return (
    <div
      className={
        "flex justify-between gap-8 items-start sm:items-center flex-col sm:flex-row"
      }
    >
      <div className={"flex flex-col w-full gap-2"}>
        <SubscriptionAlerts subscription={subscription} />
        <div className={"flex items-center gap-5"}>
          {/* {subscriptionItem.product.imageUrl && (
            <Image
              src={subscriptionItem.product.imageUrl}
              alt={subscriptionItem.product.name}
              width={48}
              height={48}
            />
          )} */}
          <h3 className="text-lg font-semibold text-text-900">
            {subscriptionItem.product.name}
          </h3>

          <div>
            <Status status={subscription.status} />
          </div>
        </div>
        <p className="text-text-500">{subscriptionItem.product.description}</p>

        <div className={"flex gap-1 items-end"}>
          <span className={"text-lg font-medium"}>{formattedPrice}</span>
          <span className={"text-text-500 text-xs font-medium"}>
            {frequency}
          </span>
        </div>

        <p className={"text-text-500"}>
          Started on:{" "}
          <span className="text-text-900">{formattedStartedDate}</span>
        </p>
      </div>
      <div>
        {!(
          subscription.scheduledChange || subscription.status === "canceled"
        ) && (
          <SubscriptionHeaderActionButton subscriptionId={subscription.id} />
        )}
      </div>
    </div>
  );
}
