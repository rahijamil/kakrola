import React, { useRef, useState } from "react";
import { usePaddleCheckout } from "../../Paddle/usePaddleCheckout";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { Tier } from "@/lib/constants/pricing-tier";
import { cn } from "./lib/utils";

const FreeTrialComponent = ({
  selectedPlan,
  hideDetails,
  successUrl,
}: {
  selectedPlan: Tier;
  hideDetails?: boolean;
  successUrl?: string;
}) => {
  const { teamMembers } = useSidebarDataProvider();
  const [showDetails, setShowDetails] = useState(false);
  const paddleFrameRef = useRef<HTMLDivElement>(null);

  const { checkoutData } = usePaddleCheckout({
    priceId: selectedPlan.priceId,
    quantity: teamMembers.length,
    id: selectedPlan.id,
    paddleFrameRef,
    successUrl,
  });

  return (
    <div className="overflow-y-auto text-[#111827] bg-white space-y-6">
      <div className="text-center">
        {/* <Rocket className="w-8 h-8" strokeWidth={1.5} /> */}

        <h2 className="text-lg font-semibold">
          Start the Plus plan free trial for 7 days
        </h2>

        <p className="text-text-500 text-lg">Cancel anytime.</p>
      </div>

      <div
        className={cn(
          "flex flex-col bg-text-100 rounded-lg",
          !hideDetails && "md:grid md:grid-cols-[55%_45%]"
        )}
      >
        <div
          className={cn(
            !hideDetails && "order-2 md:order-1 p-4 md:p-6 md:pr-3",
            hideDetails && "p-4"
          )}
        >
          <div
            ref={paddleFrameRef}
            id="paddle-checkout-frame"
            className={"paddle-checkout-frame"}
          />

          {hideDetails && (
            <p className="text-text-500 text-[11px] text-center">
              At the end of your trial, every member of your team will be
              automatically upgraded to the full price of {selectedPlan.price} /
              member / month. Billed annually.
            </p>
          )}
        </div>

        {!hideDetails && (
          <div className="order-1 md:order-2 p-6 md:pl-3 space-y-6">
            <div className="flex gap-8">
              <div className="flex-1 space-y-6">
                {/* <div className="space-y-4">
              <RadioGroup
                value={billingCycle}
                onValueChange={(value) =>
                  setBillingCycle(value as "monthly" | "annually")
                }
                className="space-y-2"
              >
                <Label
                  htmlFor="monthly"
                  className={`flex-1 border rounded-lg p-2 px-4 flex items-center gap-4 cursor-pointer ${
                    billingCycle === "monthly"
                      ? "border-primary-500"
                      : "border-text-[#e0e0e0]"
                  }`}
                >
                  <RadioGroupItem
                    value="monthly"
                    id="monthly"
                    theme="light"
                  />

                  <div>
                    <div className="font-medium text-[#111827]">
                      Pay monthly
                    </div>
                    <div className="text-xs text-[#666666]">
                      {selectedPlan.price(false)} / month / member
                    </div>
                  </div>
                </Label>

                <Label
                  htmlFor="annually"
                  className={`flex-1 border rounded-lg p-2 px-4 flex items-center gap-4 cursor-pointer ${
                    billingCycle === "annually"
                      ? "border-kakrola-500"
                      : "border-text-[#e0e0e0]"
                  }`}
                >
                  <RadioGroupItem
                    value="annually"
                    id="annually"
                    theme="light"
                  />

                  <div className="flex items-center justify-between gap-4 w-full">
                    <div>
                      <div className="font-medium text-[#111827]">
                        Pay annually
                      </div>
                      <div className="text-xs text-[#666666]">
                        {selectedPlan.price(true)} / month / member
                      </div>
                    </div>

                    <div className="text-xs text-green-700 font-semibold">
                      Save 20%
                    </div>
                  </div>
                </Label>
              </RadioGroup>

      
            </div> */}

                {checkoutData && (
                  <div className="space-y-2 text-[#666666]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 justify-between">
                        <p className="font-semibold text-base text-[#111827]">
                          ${checkoutData.totals.subtotal} /{" "}
                          {checkoutData.items[0].billing_cycle?.interval}{" "}
                          {checkoutData.items[0].billing_cycle?.interval ==
                            "year" && (
                            <span className="text-xs text-green-700 font-medium bg-green-500/10 px-1 rounded-md">
                              ${(checkoutData.totals.subtotal * 0.3).toFixed(0)}{" "}
                              off
                            </span>
                          )}
                        </p>

                        <button
                          className="p-1 pl-2 rounded-lg bg-[#ebebeb] flex items-center gap-1"
                          onClick={() => setShowDetails(!showDetails)}
                        >
                          <span className="text-xs text-[#666666]">
                            Details
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-[#666666] ${
                              showDetails ? "rotate-180" : ""
                            }`}
                            strokeWidth={1.5}
                          />
                        </button>
                      </div>

                      {showDetails && (
                        <div className="space-y-1 text-xs font-medium">
                          <p className="flex items-center gap-2 justify-between">
                            <span>Members in your team</span>
                            <span>{checkoutData.items[0].quantity}</span>
                          </p>

                          <p className="flex items-center gap-2 justify-between">
                            <span>
                              x $
                              {checkoutData.totals.subtotal /
                                checkoutData.items[0].quantity /
                                (checkoutData.items[0].billing_cycle?.frequency
                                  ? checkoutData.items[0].billing_cycle
                                      ?.frequency
                                  : 12)}{" "}
                              / month / member
                            </span>

                            <span>
                              $
                              {(
                                checkoutData.totals.subtotal /
                                (checkoutData.items[0].billing_cycle?.frequency
                                  ? checkoutData.items[0].billing_cycle
                                      ?.frequency
                                  : 12)
                              ).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    {showDetails && (
                      <div className="space-y-1 text-xs font-medium">
                        <div className="h-px w-full bg-[#ebebeb]" />

                        <div className="space-y-1">
                          <p className="flex items-center gap-2 justify-between">
                            <span>Subtotal</span>

                            <div className="flex items-center gap-2">
                              {checkoutData.items[0].billing_cycle?.interval ==
                                "year" && (
                                <span className="text-[#666666] line-through">
                                  $
                                  {(
                                    checkoutData.totals.subtotal +
                                    checkoutData.totals.subtotal * 0.3
                                  ).toFixed(2)}
                                </span>
                              )}

                              <span>
                                ${checkoutData.totals.subtotal.toFixed(2)}
                              </span>
                            </div>
                          </p>

                          <p className="flex items-center gap-2 justify-between">
                            <span>Tax if applicable</span>
                            <span>—</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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
            id: selectedPlan.id as "plus" | "business",
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

            <p className="text-xs text-center text-[#666666]">
              By continuing, you agree to Kakrola's{" "}
              <Link
                href="https://kakrola.com/terms-of-service"
                target="_blank"
                className="text-[#666666] underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="https://kakrola.com/privacy-policy"
                target="_blank"
                className="text-[#666666] underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeTrialComponent;
