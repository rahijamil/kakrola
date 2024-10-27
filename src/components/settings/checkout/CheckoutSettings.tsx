import React, { Dispatch, SetStateAction } from "react";
import { Dialog } from "../../ui/dialog";
import { Tier } from "@/lib/constants/pricing-tier";
import FreeTrialComponent from "./FreeTrialComponent";

const CheckoutSettings = ({
  selectedPlan,
  setSelectedPlan,
}: {
  selectedPlan: Tier;
  setSelectedPlan: Dispatch<SetStateAction<Tier | null>>;
}) => {
  return (
    <Dialog
      open
      onOpenChange={() => {
        setSelectedPlan(null);
      }}
    >
      <FreeTrialComponent selectedPlan={selectedPlan} />
    </Dialog>
  );
};

export default CheckoutSettings;
