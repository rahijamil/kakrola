"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { CircleAlert, CircleCheck } from "lucide-react";
import { useState } from "react";
import { cancelSubscription } from "../lib/actions";
import ConfirmAlert from "@/components/AlertBox/ConfirmAlert";

interface Props {
  subscriptionId: string;
}

export function SubscriptionHeaderActionButton({ subscriptionId }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  function handleCancelSubscription() {
    setModalOpen(false);
    setLoading(true);
    cancelSubscription(subscriptionId)
      .then(() => {
        toast(
          <div className={"flex items-center gap-3"}>
            <CircleCheck size={20} color={"#25F497"} />
            <div className={"flex flex-col gap-1"}>
              <span className={"text-primary font-medium test-sm leading-5"}>
                Cancellation scheduled
              </span>
              <span className={"text-muted-foreground test-sm leading-5"}>
                Subscription scheduled to cancel at the end of the billing
                period.
              </span>
            </div>
          </div>
        );
      })
      .catch((error) => {
        toast(
          <div className={"flex items-start gap-3"}>
            <CircleAlert size={20} color={"#F42566"} />
            <div className={"flex flex-col gap-1"}>
              <div className={"text-primary font-medium test-sm leading-5"}>
                Error
              </div>
              <div className={"text-muted-foreground test-sm leading-5"}>
                Something went wrong, please try again later
              </div>
            </div>
          </div>
        );
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Button
        disabled={loading}
        onClick={() => setModalOpen(true)}
        size={"sm"}
        color={"gray"}
        variant="outline"
      >
        Cancel subscription
      </Button>

      {isModalOpen && (
        <ConfirmAlert
          description={
            "This subscription will be scheduled to cancel at the end of the billing period."
          }
          title={"Cancel subscription?"}
          onCancel={() => setModalOpen(false)}
          onConfirm={handleCancelSubscription}
          submitBtnText={"Cancel subscription"}
        />
      )}
    </>
  );
}
