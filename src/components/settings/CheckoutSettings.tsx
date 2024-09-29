import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, Label, RadioGroup, RadioGroupItem } from "../ui";
import { usePaddleCheckout } from "../Paddle/usePaddleCheckout";
import { PricingPlanForSettings } from "./pricing.types";

const CheckoutSettings = ({
  selectedPlan,
  setSelectedPlan,
}: {
  selectedPlan: PricingPlanForSettings;
  setSelectedPlan: Dispatch<SetStateAction<PricingPlanForSettings | null>>;
}) => {
  const [billingCycle, setBillingCycle] = useState<"annually" | "monthly">(
    "annually"
  );
  const [teamSize, setTeamSize] = useState(1);

  const { openCheckout, isReady } = usePaddleCheckout();

  useEffect(() => {
    if (isReady) {
      openCheckout({
        priceId:
          selectedPlan.priceId[billingCycle === "annually" ? "year" : "month"],
        quantity: teamSize,
        id: selectedPlan.id as "pro" | "business",
      });
    }
  }, [selectedPlan, billingCycle, teamSize, isReady]);

  return (
    <Dialog onClose={() => setSelectedPlan(null)} size="md">
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-text-900">
            Upgrade to {selectedPlan.name}
          </h2>

          <p className="text-text-600">
            Do more with unlimited charts, files, automations & integrations
          </p>

          <div className="flex gap-8">
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <RadioGroup
                  value={billingCycle}
                  onValueChange={(value) =>
                    setBillingCycle(value as "monthly" | "annually")
                  }
                  className="space-y-2"
                >
                  <Label
                    htmlFor="annually"
                    className={`flex-1 border rounded-lg p-4 flex items-center gap-4 cursor-pointer ${
                      billingCycle === "annually"
                        ? "border-primary-500"
                        : "border-text-200"
                    }`}
                  >
                    <RadioGroupItem value="annually" id="annually" />

                    <div className="flex items-center justify-between gap-4 w-full">
                      <div>
                        <div className="font-medium">Pay annually</div>
                        <div className="text-sm text-text-500">
                          {selectedPlan.price(true)} / month / member
                        </div>
                      </div>

                      <div className="text-xs text-green-700 font-semibold">
                        Save 20%
                      </div>
                    </div>
                  </Label>

                  <Label
                    htmlFor="monthly"
                    className={`flex-1 border rounded-lg p-4 flex items-center gap-4 cursor-pointer ${
                      billingCycle === "monthly"
                        ? "border-primary-500"
                        : "border-text-200"
                    }`}
                  >
                    <RadioGroupItem value="monthly" id="monthly" />

                    <div>
                      <div className="font-medium">Pay monthly</div>
                      <div className="text-sm text-text-500">
                        {selectedPlan.price(false)} / month / member
                      </div>
                    </div>
                  </Label>
                </RadioGroup>

                {/* <div className="relative">
            <select className="w-full p-3 pr-10 border border-text-200 rounded-lg appearance-none">
              <option>US Dollar (USD)</option>
              <option>Euro (EUR)</option>
              <option>British Pound (GBP)</option>
              <option>Japanese Yen (JPY)</option>
              <option>Canadian Dollar (CAD)</option>
              <option>Australian Dollar (AUD)</option>
              <option>Swiss Franc (CHF)</option>
              <option>Chinese Yuan (CNY)</option>
              <option>Swedish Krona (SEK)</option>
              <option>New Zealand Dollar (NZD)</option>
              
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-500" />
          </div>
          <p className="text-xs text-text-500">
            You cannot change your currency after upgrading.
          </p> */}
              </div>

              <div className="space-y-2 text-text-700">
                <p>
                  You'll be charged{" "}
                  <span className="font-semibold text-text-900">
                    $
                    {parseInt(
                      selectedPlan
                        .price(billingCycle === "annually")
                        .split("$")[1]
                    ) * (billingCycle == "annually" ? 12 : 1)}{" "}
                    per {billingCycle === "annually" ? "year" : "month"} per
                    member
                  </span>{" "}
                  <span>
                    for{" "}
                    <span className="font-semibold text-text-900">
                      2 members
                    </span>{" "}
                    ($
                    {parseInt(
                      selectedPlan
                        .price(billingCycle === "annually")
                        .split("$")[1]
                    ) *
                      (billingCycle == "annually" ? 12 : 1) *
                      2}
                    )
                  </span>
                </p>
                <p className="text-xs text-text-500">
                  Applicable taxes will be calculated at checkout.
                </p>
              </div>

              {/* <Button
            fullWidth
            size="lg"
            onClick={() =>
              openCheckout({
                priceId:
                  selectedPlan.priceId[
                    billingCycle === "annually" ? "year" : "month"
                  ],
                quantity: teamSize,
                id: selectedPlan.id as "pro" | "business",
              })
            }
          >
            Continue to checkout
          </Button> */}
            </div>

            {/* <div className="flex-1">
        <div className="bg-background p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">
            What you get on the {selectedPlan.name} plan
          </h3>
          <ul className="space-y-3">
            {selectedPlan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div> */}
          </div>

          <p className="text-xs text-center text-text-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <div className="paddle-checkout"></div>
      </div>
    </Dialog>
  );
};

export default CheckoutSettings;
