import React, { Dispatch, SetStateAction } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@/components/ui/dialog";
import { usePathname, useSearchParams } from "next/navigation";
import { Tier } from "@/lib/constants/pricing-tier";

const CheckoutSuccess = ({
  setSelectedPlan,
}: {
  setSelectedPlan: Dispatch<SetStateAction<Tier | null>>;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const settings = searchParams.get("settings");

  return (
    <Dialog
      open
      onOpenChange={() => {
        setSelectedPlan(null);
        window.history.pushState(null, "", `${pathname}?settings=${settings}`);
        window.dispatchEvent(new Event("popstate"));
      }}
    >
      <div
        className={
          "flex flex-col justify-center items-center text-text-900 text-center h-full"
        }
      >
        <CheckCircleIcon className={"pb-12 w-32 h-32 text-green-700"} />
        <h1
          className={
            "text-4xl md:text-[80px] leading-9 md:leading-[80px] font-medium pb-6"
          }
        >
          Payment successful
        </h1>
        <p className={"text-lg pb-4"}>
          Success! Your payment is complete, and you&apos;re all set.
        </p>
      </div>
    </Dialog>
  );
};

export default CheckoutSuccess;
